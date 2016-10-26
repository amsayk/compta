const makeAlias = require('../utils').makeAlias;
const formatError = require('../utils').formatError;

const createParseObjectPointer = require('../utils').createParseObjectPointer;

const Company = require('../types').Company;

const withCompany = require('../utils').withCompany;

const makeWords = require('../makeWords');

const take = require('lodash.take');
const flatmap = require('lodash.flatmap');

const AccountClass = require('../types').Account;
const TransactionClass = require('../types').Transaction;
const OperationClass = require('../types').Operation;

const InvoiceClass = require('../types').Invoice;
const BillClass = require('../types').Bill;
const ExpenseClass = require('../types').Expense;
const PaymentOfInvoicesClass = require('../types').PaymentOfInvoices;
const PaymentOfBillsClass = require('../types').PaymentOfBills;
const SaleClass = require('../types').Sale;

const InvoiceItemClass = require('../types').InvoiceItem;
const BillItemClass = require('../types').BillItem;
const SaleItemClass = require('../types').SaleItem;
const ExpenseItemClass = require('../types').ExpenseItem;
const PaymentOfInvoicesItemClass = require('../types').PaymentOfInvoicesItem;
const PaymentOfBillsItemClass = require('../types').PaymentOfBillsItem;

const moment = require('moment');


module.exports.delSale = function delSale(request, response) {
  const Sale = SaleClass({id: request.params.companyId});

  const SaleItem = SaleItemClass({id: request.params.companyId});

  const Operation = OperationClass({id: request.params.companyId});

  const Transaction = TransactionClass({id: request.params.companyId});

  const sale = new Sale();
  sale.id = request.params.id;

  function handleError(error) {
    response.error(formatError(error));
  }

  function dropSaleItems(sale) {

    const q = new Parse.Query(SaleItem);
    q.equalTo('sale', sale);
    q.select([]);
    return q.find().then(items => {
      // const relation = sale.relation('items');
      // items.forEach(item => relation.remove(item));
      // return Parse.Promise.when([
      //   sale.save(), Parse.Object.destroyAll(items)]).then((result) => result[0]);

      return Parse.Object.destroyAll(items).then(() => sale);
    });
    // const relation = sale.relation('items');
    // const q = relation.query();
    // return q.find().then(items => {
    //   items.forEach(item => relation.remove(item));
    //   return Parse.Promise.when([
    //     sale.save(), Parse.Object.destroyAll(items)]).then((result) => result[0]);
    // });
  }

  dropSaleItems(sale)
    .then(sale => Parse.Promise.when([
      dropJournalEntries(sale),
      sale.destroy(),
    ]))
    .then(function () {
      response.success({deletedSaleId: sale.id});
    }, handleError);

  function dropJournalEntries(sale) {

    function dropTransaction(sale) {

      const qry = new Parse.Query(Transaction);
      qry.equalTo('sale', sale);
      qry.limit(1);
      return qry.first().then(transaction => {
        if (transaction) {
          return dropOperations(transaction)
            .then(() => transaction.destroy())
            .then(() => sale)
        }

        return Promise.resolve(sale);
      });
    }

    function dropOperations(transaction) {
      const qry = new Parse.Query(Operation);
      qry.equalTo('transaction', transaction);
      qry.limit(100000);
      return qry.find().then(operations => Parse.Object.destroyAll(operations));
    }

    return dropTransaction(sale);
  }
}

module.exports.addSale = function addSale(request, response) {

  const companyId = request.params.companyId;

  withCompany(companyId, function (err, company) {

    if (err) {
      handleError(err);
      return;
    }

    const Operation = OperationClass({id: companyId});

    const Transaction = TransactionClass({id: companyId});

    const SaleItem = SaleItemClass({id: companyId});

    const Sale = SaleClass({id: companyId});
    const sale = new Sale();
    const id = request.params.id;

    function setSaleStatus(sale) {

      function getTotalDiscount(subtotal, {type, value}) {
        switch (type) {
          case 1:
            return value || 0.0;
          case 'Value':
            return value || 0.0;

          case 2:
            return subtotal * ((value || 0.0) / 100);
          case 'Percent':
            return subtotal * ((value || 0.0) / 100);
        }
      }

      function itemGetDiscount(amount, {type, value}) {
        switch (type) {
          case 'Value':
            return value || 0.0;
          case 1:
            return value || 0.0;

          case 'Percent':
            return amount * ((value || 0.0) / 100);
          case 2:
            return amount * ((value || 0.0) / 100);
        }
      }

      const VAT_ID_TO_VALUE = {
        Value_20: 0.20,
        Value_14: 0.14,
        Value_10: 0.1,
        Value_Exempt: 0.0,
        Value_7: 0.07,
      };

      const VAT_KEY_TO_VALUE = {
        1: 0.20,
        2: 0.14,
        3: 0.1,
        4: 0.0,
        5: 0.07,
      };

      function itemGeVATPart__Amount(taxableAmount /* !!! ALWAYS HT */, itemVATPart) {

        if (itemVATPart) {
          const {inputType, value = 4,} = itemVATPart;

          // taxableAmount is HT: VAT = %VAT * taxableAmountHT
          return function () {
            const VAT_percentage = VAT_KEY_TO_VALUE[value];

            const taxableAmountHT = taxableAmount;

            const VAT_amount = VAT_percentage * taxableAmountHT;

            return VAT_amount;
          }();

        }

        return 0;
      }

      function itemGetAmount__TTC(entryValue, itemVATPart) {
        if (itemVATPart) {
          const {inputType, value = 4,} = itemVATPart;

          switch (inputType) {
            case 1:
            case 'HT':

              // entryValue is HT: TTC = (1 + %VAT) * entryValueHT;
              return (1 + VAT_KEY_TO_VALUE[value]) * entryValue;

            case 2:
            case 'TTC':

              // entryValue is TTC: TTC = entryValueTTC;
              return entryValue;

            case 3:
            case 'NO_VAT':

              return entryValue;

            default:

              throw new Error(`itemGetAmount__TTC: Invalid inputType`, inputType);
          }
        }

        return entryValue;
      }

      function itemGetAmount__HT(entryValue, itemVATPart) {
        if (itemVATPart) {
          const {inputType, value = 4,} = itemVATPart;

          switch (inputType) {
            case 1:
            case 'HT':

              // entryValue is HT: HT = entryValueHT;
              return entryValue;

            case 2:
            case 'TTC':

              // entryValue is TTC: HT =  entryValueTTC / (1 + %VAT);
              return entryValue / (1 + VAT_KEY_TO_VALUE[value]);

            case 3:
            case 'NO_VAT':

              return entryValue;

            default:

              throw new Error(`itemGetAmount__HT: Invalid inputType`, inputType);
          }
        }

        return entryValue;
      }

      function getTotal(items, {discountType, discountValue,}) {

        const subtotalHT = items
          .reduce((sum, item) => {
            const qty = item.get('qty');
            const rate = item.get('rate');
            const itemVATPart = item.get('VATPart');

            return sum + itemGetAmount__HT(qty * rate, itemVATPart);
          }, 0.0);

        const itemsTotalDiscount = items
          .reduce((sum, item) => {

            const qty = item.get('qty');
            const rate = item.get('rate');
            const itemDiscountPart = item.get('discountPart');
            const itemVATPart = item.get('VATPart');

            const entryValue = qty * rate;

            const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

            const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

            return sum + itemDiscount;
          }, 0.0);

        const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, {
          type: discountType,
          value: discountValue,
        });

        const totalHT = subtotalHT - totalDiscount - itemsTotalDiscount;

        const totalTaxAmount = items
          .reduce((sum, item) => {

            const qty = item.get('qty');
            const rate = item.get('rate');
            const itemDiscountPart = item.get('discountPart');
            const itemVATPart = item.get('VATPart');

            const entryValue = qty * rate;

            const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

            const itemTotalDiscount = itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart);

            const amountHT = amountHT__BeforeDiscount - itemTotalDiscount;

            function itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart) {
              const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

              const amountPercentage = (amountHT__BeforeDiscount * 100 / subtotalHT);

              const discountPart = amountPercentage / 100 * totalDiscount;

              return itemDiscount + discountPart;
            }

            const taxableAmount = amountHT - itemTotalDiscount;

            return sum + itemGeVATPart__Amount(taxableAmount, itemVATPart);
          }, 0.0);

        return {
          totalHT,
          total: totalHT + totalTaxAmount,
          VAT: totalTaxAmount,
        };
      }

      function calcTotal(sale) {
        const q = new Parse.Query(SaleItem);
        q.equalTo('sale', sale);
        q.select(['qty', 'rate', 'VATPart', 'discountPart', 'item', 'item.incomeAccountCode']);
        q.include(['item']);
        return q.find().then(items => {
          const discountType = sale.get('discountType');
          const discountValue = sale.get('discountValue');
          return getTotal(items, {
            discountType,
            discountValue,
          });
        });
      }

      return calcTotal(sale).then(({total, totalHT, VAT, }) => {
        sale.set('total', total);
        sale.set('totalHT', totalHT);
        sale.set('VAT', VAT);

        sale.set('balanceDue', 0.0);
        return sale.save(null);
      });
    }

    function dropSaleItems(sale) {
      const q = new Parse.Query(SaleItem);
      q.equalTo('sale', sale);
      q.select([]);
      return q.find().then(items => {
        return Parse.Object.destroyAll(items).then(() => sale);
      });
    }

    function handleError(error) {
      response.error(formatError(error));
    }

    if (typeof id !== 'undefined') {
      sale.id = id;
      sale.fetch().then(sale => {
        return dropSaleItems(sale)
          .then(sale => doSave(sale, true))
          .then(sale => Parse.Promise.when([
            setSaleStatus(sale),
            enterJournalEntries(sale, true),
          ]).then(() => sale));
      }).then(function (object) {
        response.success({addedSaleId: object.id});
      }, handleError);
    } else {
      doSave(sale)
        .then(sale => Parse.Promise.when([
          setSaleStatus(sale),
          enterJournalEntries(sale, false),
        ]).then(() => sale))
        .then(function (object) {
          response.success({addedSaleId: object.id});
        }, handleError);
    }

    function enterJournalEntries(sale, existed) {

      function dropJournalEntries(sale) {

        function dropTransaction(sale) {
          const qry = new Parse.Query(Transaction);
          qry.equalTo('sale', sale);
          qry.limit(1);
          return qry.first().then(transaction => {
            if (transaction) {
              return dropOperations(transaction)
                .then(() => transaction.destroy())
                .then(() => sale)
            }

            return Promise.resolve(sale);
          }).catch(error => {
            return Promise.resolve(sale);
          });
        }

        function dropOperations(transaction) {
          const qry = new Parse.Query(Operation);
          qry.equalTo('transaction', transaction);
          qry.limit(100000);
          return qry.find().then(operations => Parse.Object.destroyAll(operations));
        }

        return dropTransaction(sale);
      }

      function addJournalEntries(sale) {
        const q = new Parse.Query(SaleItem);
        q.equalTo('sale', sale);
        q.select(['qty', 'rate', 'discountPart', 'VATPart', 'item', 'item.incomeAccountCode']);
        q.include(['item']);
        return q.find().then(items => {

          function itemGetDiscount(amount, {type, value}) {
            switch (type) {
              case 'Value':
                return value || 0.0;
              case 1:
                return value || 0.0;

              case 'Percent':
                return amount * ((value || 0.0) / 100);
              case 2:
                return amount * ((value || 0.0) / 100);
            }
          }

          const VAT_ID_TO_VALUE = {
            Value_20: 0.20,
            Value_14: 0.14,
            Value_10: 0.1,
            Value_Exempt: 0.0,
            Value_7: 0.07,
          };

          const VAT_KEY_TO_VALUE = {
            1: 0.20,
            2: 0.14,
            3: 0.1,
            4: 0.0,
            5: 0.07,
          };

          function itemGeVATPart__Amount(taxableAmount /* !!! ALWAYS HT */, itemVATPart) {

            if (itemVATPart) {
              const {inputType, value = 4,} = itemVATPart;

              // taxableAmount is HT: VAT = %VAT * taxableAmountHT
              return function () {
                const VAT_percentage = VAT_KEY_TO_VALUE[value];

                const taxableAmountHT = taxableAmount;

                const VAT_amount = VAT_percentage * taxableAmountHT;

                return VAT_amount;
              }();

            }

            return 0;
          }

          function itemGetAmount__TTC(entryValue, itemVATPart) {
            if (itemVATPart) {
              const {inputType, value = 4,} = itemVATPart;

              switch (inputType) {
                case 1:
                case 'HT':

                  // entryValue is HT: TTC = (1 + %VAT) * entryValueHT;
                  return (1 + VAT_KEY_TO_VALUE[value]) * entryValue;

                case 2:
                case 'TTC':

                  // entryValue is TTC: TTC = entryValueTTC;
                  return entryValue;

                case 3:
                case 'NO_VAT':

                  return entryValue;

                default:

                  throw new Error(`itemGetAmount__TTC: Invalid inputType`, inputType);
              }
            }

            return entryValue;
          }

          function itemGetAmount__HT(entryValue, itemVATPart) {
            if (itemVATPart) {
              const {inputType, value = 4,} = itemVATPart;

              switch (inputType) {
                case 1:
                case 'HT':

                  // entryValue is HT: HT = entryValueHT;
                  return entryValue;

                case 2:
                case 'TTC':

                  // entryValue is TTC: HT =  entryValueTTC / (1 + %VAT);
                  return entryValue / (1 + VAT_KEY_TO_VALUE[value]);

                case 3:
                case 'NO_VAT':

                  return entryValue;

                default:

                  throw new Error(`itemGetAmount__HT: Invalid inputType`, inputType);
              }
            }

            return entryValue;
          }

          const subtotalHT = items
            .reduce((sum, item) => {
              const qty = item.get('qty');
              const rate = item.get('rate');
              const itemVATPart = item.get('VATPart');

              return sum + itemGetAmount__HT(qty * rate, itemVATPart);
            }, 0.0);

          function getTotalDiscount(subtotal, {type, value}) {
            switch (type) {
              case 1:
                return value || 0.0;
              case 'Value':
                return value || 0.0;

              case 2:
                return subtotal * ((value || 0.0) / 100);
              case 'Percent':
                return subtotal * ((value || 0.0) / 100);
            }
          }

          const itemsTotalDiscount = items
            .reduce((sum, item) => {

              const qty = item.get('qty');
              const rate = item.get('rate');
              const itemDiscountPart = item.get('discountPart');
              const itemVATPart = item.get('VATPart');

              const entryValue = qty * rate;

              const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

              const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

              return sum + itemDiscount;
            }, 0.0);

          const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, {
            type: sale.get('discountType'),
            value: sale.get('discountValue'),
          });

          const operations = flatmap(items, item => {
            const operation = new Operation();
            operation.set('sale', sale);
            operation.set('refNo', sale.get('refNo'));
            operation.set('date', sale.get('date'));
            operation.set('transactionType', 'Sale');
            operation.set('customer', sale.get('customer'));
            operation.set('memo', sale.get('memo'));
            operation.set('company', {className: 'Company', id: request.params.companyId,});

            const qty = item.get('qty');
            const rate = item.get('rate');
            const itemDiscountPart = item.get('discountPart');
            const itemVATPart = item.get('VATPart');

            const taxableAmount = function () {

              const entryValue = qty * rate;

              const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

              const itemTotalDiscount = itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart);

              const amountHT = amountHT__BeforeDiscount - itemTotalDiscount;

              function itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart) {
                const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

                const amountPercentage = (amountHT__BeforeDiscount * 100 / subtotalHT);

                const discountPart = amountPercentage / 100 * totalDiscount;

                return itemDiscount + discountPart;
              }

              const taxableAmount = amountHT - itemTotalDiscount;

              return taxableAmount;
            }();

            const VAT = itemGeVATPart__Amount(taxableAmount, itemVATPart);

            // const amount = function () {
            //   const qty = item.get('qty');
            //   const rate = item.get('rate');
            //   const itemDiscountPart = item.get('discountPart');
            //
            //   const amount = qty * rate;
            //   const itemDiscount = itemGetDiscount(amount, itemDiscountPart);
            //
            //   const amountPercentage = (amount * 100 / subtotal);
            //   const discountPart = amountPercentage / 100 * totalDiscount;
            //
            //   return (amount - discountPart) - itemDiscount;
            // }();
            // operation.set('amount', amount);

            function getSalesAccountOp(op) {
              const amount = taxableAmount;
              op.set('amount', amount);

              op.set('saleItem', item);

              op.set('VAT', VAT);

              op.set('isSale', true);

              const accountCode = item.has('item') ? function () {
                const p = item.get('item');
                return p.get('incomeAccountCode');
              }() : '7.1.1.1';

              op.set('accountCode', accountCode);

              op.set('categoryCode',
                take(accountCode.split(/\./), 2).join('.'));

              op.set('groupCode',
                take(accountCode.split(/\./), 3).join('.'));

              op.set('classCode',
                take(accountCode.split(/\./), 1).join('.'));

              op.set('type', 'CREDIT');

              return op;
            }

            function getBankOp(op) {
              const amount = taxableAmount + VAT;
              op.set('amount', amount);

              const accountCode = sale.get('depositToAccountCode'); // '5.1.6.1.1'; // Caisse centrale;
              // const accountCode = '5.1.4.3'; // Trésorerie Générale

              op.set('accountCode', accountCode);

              op.set('categoryCode',
                take(accountCode.split(/\./), 2).join('.'));

              op.set('groupCode',
                take(accountCode.split(/\./), 3).join('.'));

              op.set('classCode',
                take(accountCode.split(/\./), 1).join('.'));

              op.set('type', 'DEBIT');

              return op;
            }

            function getVATOp(op) {
              const amount = VAT;
              op.set('amount', amount);

              const accountCode = '4.4.5.5'; // 4455 État, TVA facturée

              op.set('accountCode', accountCode);

              op.set('categoryCode',
                take(accountCode.split(/\./), 2).join('.'));

              op.set('groupCode',
                take(accountCode.split(/\./), 3).join('.'));

              op.set('classCode',
                take(accountCode.split(/\./), 1).join('.'));

              op.set('type', 'CREDIT');

              return op;
            }

            return [
              getSalesAccountOp(
                operation.clone()),

              getBankOp(
                operation.clone()),

              ...(VAT > 0 ? [
                getVATOp(
                  operation.clone()),
              ] : []),

            ];
          });

          const transaction = new Transaction();
          transaction.set('sale', sale);
          transaction.set('refNo', sale.get('refNo'));
          transaction.set('date', sale.get('date'));
          transaction.set('transactionType', 'Sale');
          transaction.set('customer', sale.get('customer'));
          transaction.set('memo', sale.get('memo'));
          transaction.set('company', {className: 'Company', id: request.params.companyId,});

          return transaction.save(null).then(obj => {
            return Parse.Object.saveAll(operations.map(op => {
              op.set('transaction', obj);
              return op;
            }));
          });
        });
      }

      if (existed) {
        // drop entries first
        return dropJournalEntries(sale)
          .then(sale => {
            // create journal entries
            return addJournalEntries(sale);
          });
      }

      // create journal entries
      return addJournalEntries(sale);
    }

    function doSave(sale, existed = false) {
      const items = [];

      const props = request.params;

      Object.keys(props).forEach(function (fieldName) {
        const value = props[fieldName];

        if (fieldName === 'items') {
          value.forEach(function (item) {
            items.push(item);
          });
          return;
        }

        if (fieldName === 'date') {
          sale.set(fieldName, new Date(value));
          return;
        }

        if (fieldName === 'companyId') {
          sale.set('company', {className: 'Company', id: value});
          return;
        }

        if (fieldName === 'customer' && value) {
          sale.set('customer',
            createParseObjectPointer(Parse, value.className, value.id));
          return;
        }

        sale.set(fieldName, value);
      });

      sale.set('words', makeWords([
        sale.get('memo'),
        sale.get('billingAddress'),
      ]));

      if (!existed) {
        sale.set('company', {className: 'Company', id: request.params.companyId,});
        sale.set('user', request.user ? {className: '_User', id: request.user.id,} : null);
      }

      // 1. save sale
      // 2. save all items
      // 3. save relation

      return sale.save(null).then(
        function (object) {

          return Parse.Object.saveAll(items.map(function (item) {
            const p = new SaleItem();
            Object.keys(item).forEach(function (fieldName) {
              const value = item[fieldName];
              if (fieldName === 'item' && value) {
                p.set('item',
                  createParseObjectPointer(Parse, value.className, value.id));
                return;
              }
              if (fieldName === 'date') {
                p.set(fieldName, value ? new Date(value) : null);
                return;
              }
              p.set(fieldName, value);
            });
            p.set('company', {className: 'Company', id: request.params.companyId});
            p.set('sale', object);
            return p;
          })).then(function () {
            return object;
          });

        });
    }

  });
}

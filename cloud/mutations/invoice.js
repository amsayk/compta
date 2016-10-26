const makeAlias = require('../utils').makeAlias;
const formatError = require('../utils').formatError;

const createParseObjectPointer = require('../utils').createParseObjectPointer;

const Company = require('../types').Company;

const makeWords = require('../makeWords');

const withCompany = require('../utils').withCompany;

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

module.exports.delInvoice = function delInvoice(request, response) {
  const PaymentOfInvoicesItem = PaymentOfInvoicesItemClass({id: request.params.companyId});

  const InvoiceItem = InvoiceItemClass({id: request.params.companyId});

  const Invoice = InvoiceClass({id: request.params.companyId});

  const Operation = OperationClass({id: request.params.companyId});

  const Transaction = TransactionClass({id: request.params.companyId});

  function handleError(error) {
    response.error(formatError(error));
  }

  const q = new Parse.Query(Invoice);
  q.get(request.params.id).then(invoice => {

    return checkPaymentStatus(invoice).then(exists => {
      if (exists) {
        return Parse.Promise.error('error.payments-exists');
      }

      return Parse.Promise.when([
        dropInvoiceItems(invoice),
        dropJournalEntries(invoice),
      ]).then(() => invoice.destroy());

    }).then(function () {
      response.success({deletedInvoiceId: invoice.id});
    }, handleError);
  });

  // ! ALL Payments must be deleted first !

  function checkPaymentStatus(invoice) {
    const q = new Parse.Query(PaymentOfInvoicesItem);
    q.equalTo('invoice', invoice);
    q.select([]);
    return q.count().then(invoices => {
      return invoices > 0;
    });
  }

  // delete items
  // delete payments
  // delete transactions
  // delete journal entries

  function dropInvoiceItems(invoice) {
    const q = new Parse.Query(InvoiceItem);
    q.equalTo('invoice', invoice);
    q.select([]);
    return q.find().then(items => {
      // const relation = invoice.relation('items');
      // items.forEach(item => relation.remove(item));
      // return Parse.Promise.when([
      //   invoice.save(), Parse.Object.destroyAll(items)]).then((result) => result[0]);

      return Parse.Object.destroyAll(items).then(() => invoice);
    });
  }

  function dropJournalEntries(invoice) {

    function dropTransaction(invoice) {

      const qry = new Parse.Query(Transaction);
      qry.exists('invoice');
      qry.equalTo('invoice', invoice);
      qry.limit(1);
      return qry.first().then(transaction => {
        if (transaction) {
          return dropOperations(transaction)
            .then(() => transaction.destroy())
            .then(() => invoice)
        }

        return Promise.resolve(invoice);
      }).catch(error => {
        return Promise.resolve(invoice);
      });
    }

    function dropOperations(transaction) {
      const qry = new Parse.Query(Operation);
      qry.equalTo('transaction', transaction);
      qry.limit(100000);
      return qry.find().then(operations => Parse.Object.destroyAll(operations));
    }

    return dropTransaction(invoice);
  }
}

module.exports.addInvoice = function addInvoice(request, response) {

  const companyId = request.params.companyId;

  withCompany(companyId, function (err, company) {

    if (err) {
      handleError(err);
      return;
    }

    const PaymentOfInvoicesItem = PaymentOfInvoicesItemClass({id: companyId});

    const InvoiceItem = InvoiceItemClass({id: companyId});

    const Operation = OperationClass({id: companyId});

    const Transaction = TransactionClass({id: companyId});

    const Invoice = InvoiceClass({id: companyId});

    const invoice = new Invoice();
    const id = request.params.id;

    function handleError(error) {
      response.error(formatError(error));
    }

    function dropInvoiceItems(invoice) {
      const q = new Parse.Query(InvoiceItem);
      q.equalTo('invoice', invoice);
      q.select([]);
      return q.find().then(items => {
        // const relation = invoice.relation('items');
        // items.forEach(item => relation.remove(item));
        // return Parse.Promise.when([
        //   invoice.save(), Parse.Object.destroyAll(items)]).then((result) => result[0]);

        return Parse.Object.destroyAll(items).then(() => invoice);
      });
    }

    if (typeof id !== 'undefined') {
      invoice.id = id;
      invoice.fetch().then(invoice => {
        return dropInvoiceItems(invoice)
          .then(invoice => doSave(invoice, true))
          .then(invoice => Parse.Promise.when([
            setInvoiceStatus(invoice, true),
            enterJournalEntries(invoice, true)
          ]).then(() => invoice));
      }).then(function (object) {
        response.success({addedInvoiceId: object.id, changedPaymentsIds: []});
      }, handleError);
    } else {
      doSave(invoice)
        .then(invoice => Parse.Promise.when([
          setInvoiceStatus(invoice, false),
          enterJournalEntries(invoice, false)
        ]).then(() => invoice))
        .then(function (object) {
          response.success({addedInvoiceId: object.id, changedPaymentsIds: []});
        }, handleError);
    }

    function enterJournalEntries(invoice, existed) {

      function dropJournalEntries(invoice) {

        function dropTransaction(invoice) {
          const qry = new Parse.Query(Transaction);
          qry.equalTo('invoice', invoice);
          qry.limit(1);
          return qry.first().then(transaction => {
            if (transaction) {
              return dropOperations(transaction)
                .then(() => transaction.destroy())
                .then(() => invoice)
            }

            return Promise.resolve(invoice);
          });
        }

        function dropOperations(transaction) {
          const qry = new Parse.Query(Operation);
          qry.equalTo('transaction', transaction);
          qry.limit(100000);
          return qry.find().then(operations => Parse.Object.destroyAll(operations));
        }

        return dropTransaction(invoice);
      }

      function addJournalEntries(invoice) {
        const q = new Parse.Query(InvoiceItem);
        q.equalTo('invoice', invoice);
        q.select(['qty', 'rate', 'VATPart', 'discountPart', 'item', 'item.incomeAccountCode']);
        q.include(['item']);

        const refNo = invoice.get('refNo');
        const customer = invoice.get('customer');

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

            if(itemVATPart){
              const { inputType, value = 4, } = itemVATPart;

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
            if(itemVATPart){
              const { inputType, value = 4, } = itemVATPart;

              switch (inputType){
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
            if(itemVATPart){
              const { inputType, value = 4, } = itemVATPart;

              switch (inputType){
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

          const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, { type: invoice.get('discountType'), value: invoice.get('discountValue'), });

          const operations = flatmap(items, item => {
            const operation = new Operation();
            operation.set('invoice', invoice);
            operation.set('refNo', refNo);
            operation.set('date', invoice.get('date'));
            operation.set('transactionType', 'Invoice');
            operation.set('customer', customer);
            operation.set('memo', invoice.get('memo'));
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

            function getSalesAccountOp(op) {
              const amount = taxableAmount;
              op.set('amount', amount);

              op.set('invoiceItem', item);

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

            function getAccountsReceivableOp(op) {
              const amount = taxableAmount + VAT;
              op.set('amount', amount);

              const accountCode = '3.4.2.1.1'; // Clients - catégorie A

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

              getAccountsReceivableOp(
                operation.clone()),

              ...(VAT > 0 ? [
                getVATOp(
                  operation.clone()),
              ] : []),

            ];
          });

          const transaction = new Transaction();
          transaction.set('invoice', invoice);
          transaction.set('refNo', refNo);
          transaction.set('date', invoice.get('date'));
          transaction.set('transactionType', 'Invoice');
          transaction.set('customer', customer);
          transaction.set('memo', invoice.get('memo'));
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
        return dropJournalEntries(invoice)
          .then(invoice => {
            // create journal entries
            return addJournalEntries(invoice);
          });
      }

      // create journal entries
      return addJournalEntries(invoice);
    }

    function setInvoiceStatus(invoice, existed) {

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

        if(itemVATPart){
          const { inputType, value = 4, } = itemVATPart;

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
        if(itemVATPart){
          const { inputType, value = 4, } = itemVATPart;

          switch (inputType){
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
        if(itemVATPart){
          const { inputType, value = 4, } = itemVATPart;

          switch (inputType){
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

      function getTotal(items, {discountType, discountValue, }) {

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

        const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, { type: discountType, value: discountValue, });

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

      function calcTotal(invoice) {
        const q = new Parse.Query(InvoiceItem);
        q.equalTo('invoice', invoice);
        q.select(['qty', 'rate', 'VATPart', 'discountPart', 'item', 'item.incomeAccountCode']);
        q.include([ 'item' ]);
        return q.find().then(items => {
          const discountType = invoice.get('discountType');
          const discountValue = invoice.get('discountValue');
          return getTotal(items, {
            discountType,
            discountValue,
          });
        });
      }

      function calcTotalReceived(invoice) {
        const q = new Parse.Query(PaymentOfInvoicesItem);
        q.equalTo('invoice', invoice);
        q.select(['amount']);
        return q.find().then(amounts => {
          return amounts.reduce((sum, next) => sum + next.get('amount'), 0.0);
        });
      }

      if (existed) {
        return Parse.Promise.when([calcTotal(invoice), calcTotalReceived(invoice)]).then(([ {total, totalHT, VAT, }, totalReceived ]) => {
          const balanceDue = total - totalReceived;
          invoice.set('total', total);
          invoice.set('totalHT', totalHT);
          invoice.set('VAT', VAT);
          invoice.set('balanceDue', balanceDue);

          return invoice.save(null);
        });
      }
      return calcTotal(invoice).then(({total, totalHT, VAT, }) => {
        invoice.set('total', total);
        invoice.set('totalHT', totalHT);
        invoice.set('VAT', VAT);
        invoice.set('balanceDue', total);
        return invoice.save(null);
      });
    }

    function doSave(invoice, existed = false) {
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

        if (fieldName === 'date' || fieldName === 'dueDate') {
          invoice.set(fieldName, new Date(value));
          return;
        }

        if (fieldName === 'companyId') {
          invoice.set('company',
            {className: 'Company', id: value});
          return;
        }

        if (fieldName === 'customer' && value) {
          // customer.id = value.id;
          invoice.set('customer',
            createParseObjectPointer(Parse, value.className, value.id));
          return;
        }

        invoice.set(fieldName, value);
      });

      invoice.set('words', makeWords([
        invoice.get('memo'),
        invoice.get('billingAddress'),
      ]));

      if (!existed) {
        invoice.set('company', {className: 'Company', id: request.params.companyId,});
        invoice.set('user', request.user ? {className: '_User', id: request.user.id,} : null);
      }

      // 1. save invoice
      // 2. save all items
      // 3. save relation

      return invoice.save(null).then(
        function (object) {

          return Parse.Object.saveAll(items.map(function (item) {
            const p = new InvoiceItem();
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
            p.set('invoice', object);
            return p;
          })).then(function () {
            return object;
          });

        });
    }

  });

}

const makeAlias = require('../utils').makeAlias;
const formatError = require('../utils').formatError;

const withCompany = require('../utils').withCompany;

const createParseObjectPointer = require('../utils').createParseObjectPointer;

const Company = require('../types').Company;

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
const BillProductItemClass = require('../types').BillProductItem;
const SaleItemClass = require('../types').SaleItem;
const ExpenseItemClass = require('../types').ExpenseItem;
const PaymentOfInvoicesItemClass = require('../types').PaymentOfInvoicesItem;
const PaymentOfBillsItemClass = require('../types').PaymentOfBillsItem;

const moment = require('moment');

module.exports.delBill = function delBill(request, response) {
  const Bill = BillClass({id: request.params.companyId});

  const Operation = OperationClass({id: request.params.companyId});

  const Transaction = TransactionClass({id: request.params.companyId});

  const PaymentOfBillsItem = PaymentOfBillsItemClass({id: request.params.companyId});

  // const BillProductItem = BillProductItemClass({id: request.params.companyId});

  const BillItem = BillItemClass({id: request.params.companyId});

  const bill = new Bill();
  bill.id = request.params.id;

  function handleError(error) {
    response.error(formatError(error));
  }

  function dropBillItems(bill) {

    function accountItems_drop() {
      const q = new Parse.Query(BillItem);
      q.equalTo('bill', bill);
      q.select([]);
      return q.find().then(items => {
        return Parse.Object.destroyAll(items);
      });
    }

    function productItems_drop() {
      const q = new Parse.Query(BillProductItem);
      q.equalTo('bill', bill);
      q.select([]);
      return q.find().then(items => {
        return Parse.Object.destroyAll(items);
      });
    }

    return Parse.Promise.when([
      // productItems_drop(),
      accountItems_drop()
    ]).then(() => bill.save(null));
  }

  // dropBillItems(bill)
  //   .then(bill => Parse.Promise.when([
  //     dropJournalEntries(bill),
  //     bill.destroy(),
  //   ]))
  //   .then(function () {
  //       response.success({deletedBillId: bill.id});
  //     }, handleError);
  const q = new Parse.Query(Bill);
  q.get(request.params.id).then(bill => {

    return checkPaymentStatus(bill).then(exists => {
      if (exists) {
        return Parse.Promise.error('error.payments-exists');
      }

      return Parse.Promise.when([
        dropBillItems(bill),
        dropJournalEntries(bill),
      ]).then(() => bill.destroy());

    }).then(function () {
      response.success({deletedBillId: bill.id});
    }, handleError);
  });

  function checkPaymentStatus(bill) {
    const q = new Parse.Query(PaymentOfBillsItem);
    q.equalTo('bill', bill);
    q.select([]);
    return q.count().then(bills => {
      return bills > 0;
    });
  }

  function dropJournalEntries(bill) {

    function dropTransaction(bill) {
      const qry = new Parse.Query(Transaction);
      qry.equalTo('bill', bill);
      qry.limit(1);
      return qry.first().then(transaction => {
        if (transaction) {
          return dropOperations(transaction)
            .then(() => transaction.destroy())
            .then(() => bill)
        }

        return Promise.resolve(bill);
      });
    }

    function dropOperations(transaction) {
      const qry = new Parse.Query(Operation);
      qry.equalTo('transaction', transaction);
      qry.limit(100000);
      return qry.find().then(operations => Parse.Object.destroyAll(operations));
    }

    return dropTransaction(bill);
  }
};

module.exports.addBill = function addBill(request, response) {

  const companyId = request.params.companyId;

  withCompany(companyId, function (err, company) {

    if (err) {
      handleError(err);
      return;
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

    const Operation = OperationClass({id: request.params.companyId});

    const Transaction = TransactionClass({id: request.params.companyId});

    // const BillProductItem = BillProductItemClass({id: request.params.companyId});

    const PaymentOfBillsItem = PaymentOfBillsItemClass({id: request.params.companyId});

    const BillItem = BillItemClass({id: request.params.companyId});

    const Bill = BillClass({id: request.params.companyId});

    const bill = new Bill();
    const id = request.params.id;

    function handleError(error) {
      response.error(formatError(error));
    }

    function dropBillItems(bill) {
      const q = new Parse.Query(BillItem);
      return q.find().then(items => {
        return Parse.Object.destroyAll(items).then(() => bill);
      });
    }

    function getChangedPaymentIds(bill) {
      const q = new Parse.Query(PaymentOfBillsItem);
      q.equalTo('bill', bill);
      q.include(['']);
      q.select(['']);
      return q.find().then(items => {
        return items.map(item => item.id);
      });
    }

    if (typeof id !== 'undefined') {
      bill.id = id;
      bill.fetch().then(bill => {
        return dropBillItems(bill)
          .then(bill => doSave(bill, true))
          .then(bill => Parse.Promise.when([
            setBillStatus(bill, true),
            enterJournalEntries(bill, true)
          ]).then(() => bill));
      }).then(function (object) {
        getChangedPaymentIds(object).then(changedPaymentsIds => {
          response.success({addedBillId: object.id, changedPaymentsIds,});
        });
      }, handleError);
    } else {
      doSave(bill)
        .then(bill => Parse.Promise.when([
          setBillStatus(bill, false),
          enterJournalEntries(bill, false)
        ]).then(() => bill))
        .then(function (object) {
          response.success({addedBillId: object.id, changedPaymentsIds: [],});
        }, handleError);
    }

    function enterJournalEntries(bill, existed) {

      function dropJournalEntries(bill) {

        function dropTransaction(bill) {
          const qry = new Parse.Query(Transaction);
          qry.equalTo('bill', bill);
          qry.limit(1);
          return qry.first().then(transaction => {
            if (transaction) {
              return dropOperations(transaction)
                .then(() => transaction.destroy())
                .then(() => bill)
            }

            return Promise.resolve(bill);
          });
        }

        function dropOperations(transaction) {
          const qry = new Parse.Query(Operation);
          qry.equalTo('transaction', transaction);
          qry.limit(100000);
          return qry.find().then(operations => Parse.Object.destroyAll(operations));
        }

        return dropTransaction(bill);
      }

      function productItems__addJournalEntries(bill) {

        // const q = new Parse.Query(BillProductItem);
        // q.equalTo('bill', bill);
        // q.select(['qty', 'rate', 'VATPart', 'item', 'item.expenseAccountCode']);
        // q.include(['item']);
        // return q.find().then(items => {
        //
        //   const operations = flatmap(items, item => {
        //
        //     const entryValue = item.get('amount');
        //     const itemVATPart = item.get('VATPart');
        //
        //     const taxableAmount = function () {
        //
        //       const amountHT = itemGetAmount__HT(entryValue, itemVATPart);
        //
        //
        //       const taxableAmount = amountHT;
        //
        //       return taxableAmount;
        //     }();
        //
        //     const VAT = itemGeVATPart__Amount(taxableAmount, itemVATPart);
        //
        //     const expensesAccountCode = item.has('item') ? function () {
        //       const p = item.get('item');
        //       return p.get('expenseAccountCode');
        //     }() : '6.1.1.1';
        //
        //     const operation = new Operation();
        //     operation.set('bill', bill);
        //     operation.set('refNo', bill.get('refNo'));
        //     operation.set('date', bill.get('date'));
        //     operation.set('transactionType', 'Bill');
        //     operation.set('payee', bill.get('payee'));
        //     operation.set('memo', bill.get('memo'));
        //     operation.set('company', {className: 'Company', id: request.params.companyId,});
        //
        //     function getExpensesAccountOp(op) {
        //       const amount = taxableAmount;
        //       op.set('amount', amount);
        //
        //       op.set('billItem', item);
        //
        //       op.set('VAT', VAT);
        //
        //       op.set('isExpense', true);
        //
        //       const accountCode = expensesAccountCode;
        //
        //       op.set('accountCode', accountCode);
        //
        //       op.set('categoryCode',
        //         take(accountCode.split(/\./), 2).join('.'));
        //
        //       op.set('groupCode',
        //         take(accountCode.split(/\./), 3).join('.'));
        //
        //       op.set('classCode',
        //         take(accountCode.split(/\./), 1).join('.'));
        //
        //       op.set('type', 'DEBIT');
        //
        //       return op;
        //     }
        //
        //     function getAccountsPayableOp(op) {
        //       const amount = taxableAmount + VAT;
        //       op.set('amount', amount);
        //
        //       const accountCode = '4.4.1.1.1'; // Fournisseurs;
        //
        //       op.set('accountCode', accountCode);
        //
        //       op.set('categoryCode',
        //         take(accountCode.split(/\./), 2).join('.'));
        //
        //       op.set('groupCode',
        //         take(accountCode.split(/\./), 3).join('.'));
        //
        //       op.set('classCode',
        //         take(accountCode.split(/\./), 1).join('.'));
        //
        //       op.set('type', 'CREDIT');
        //
        //       return op;
        //     }
        //
        //     function getVATOp(op) {
        //       const amount = VAT;
        //       op.set('amount', amount);
        //
        //       const accountCode = expensesAccountCode[0] === '6'
        //           ? '3.4.5.5.2' // 34552 État - TVA récupérable sur charges
        //           : '3.4.5.5.1'  // 34551 État - TVA récupérable sur immobilisations
        //         ;
        //
        //       op.set('accountCode', accountCode);
        //
        //       op.set('categoryCode',
        //         take(accountCode.split(/\./), 2).join('.'));
        //
        //       op.set('groupCode',
        //         take(accountCode.split(/\./), 3).join('.'));
        //
        //       op.set('classCode',
        //         take(accountCode.split(/\./), 1).join('.'));
        //
        //       op.set('type', 'DEBIT');
        //
        //       return op;
        //     }
        //
        //     return [
        //       getExpensesAccountOp(
        //         operation.clone()),
        //
        //       getAccountsPayableOp(
        //         operation.clone()),
        //
        //       ...(VAT > 0 ? [
        //         getVATOp(
        //           operation.clone()),
        //       ] : []),
        //
        //     ];
        //   });
        //
        //   const transaction = new Transaction();
        //   transaction.set('bill', bill);
        //   transaction.set('refNo', bill.get('refNo'));
        //   transaction.set('date', bill.get('date'));
        //   transaction.set('transactionType', 'Bill');
        //   transaction.set('payee', bill.get('payee'));
        //   transaction.set('memo', bill.get('memo'));
        //   transaction.set('company', {className: 'Company', id: request.params.companyId,});
        //
        //   return transaction.save(null).then(obj => {
        //     return Parse.Object.saveAll(operations.map(op => {
        //       op.set('transaction', obj);
        //       return op;
        //     }));
        //   });
        // });
      }

      function accountItems__addJournalEntries(bill) {
        const q = new Parse.Query(BillItem);
        q.equalTo('bill', bill);
        q.select(['amount', 'VATPart', 'accountCode']);
        return q.find().then(items => {

          const operations = flatmap(items, item => {

            const entryValue = item.get('amount');
            const itemVATPart = item.get('VATPart');

            const taxableAmount = function () {

              const amountHT = itemGetAmount__HT(entryValue, itemVATPart);


              const taxableAmount = amountHT;

              return taxableAmount;
            }();

            const VAT = itemGeVATPart__Amount(taxableAmount, itemVATPart);

            const expensesAccountCode = item.get('accountCode');

            const operation = new Operation();
            operation.set('bill', bill);
            operation.set('refNo', bill.get('refNo'));
            operation.set('date', bill.get('date'));
            operation.set('transactionType', 'Bill');
            operation.set('payee', bill.get('payee'));
            operation.set('memo', bill.get('memo'));
            operation.set('company', {className: 'Company', id: request.params.companyId,});

            function getExpensesAccountOp(op) {
              const amount = taxableAmount;
              op.set('amount', amount);

              const accountCode = expensesAccountCode;

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

            function getAccountsPayableOp(op) {
              const amount = taxableAmount + VAT;
              op.set('amount', amount);

              const accountCode = '4.4.1.1.1'; // Fournisseurs;

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

            function getVATOp(op) {
              const amount = VAT;
              op.set('amount', amount);

              const accountCode = expensesAccountCode[0] === '6'
                  ? '3.4.5.5.2' // 34552 État - TVA récupérable sur charges
                  : '3.4.5.5.1'  // 34551 État - TVA récupérable sur immobilisations
                ;

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

            return [
              getExpensesAccountOp(
                operation.clone()),

              getAccountsPayableOp(
                operation.clone()),

              ...(VAT > 0 ? [
                getVATOp(
                  operation.clone()),
              ] : []),

            ];
          });

          const transaction = new Transaction();
          transaction.set('bill', bill);
          transaction.set('refNo', bill.get('refNo'));
          transaction.set('date', bill.get('date'));
          transaction.set('transactionType', 'Bill');
          transaction.set('payee', bill.get('payee'));
          transaction.set('memo', bill.get('memo'));
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
        return dropJournalEntries(bill)
          .then(bill => {
            // create journal entries
            return Parse.Promise.when([
              // productItems__addJournalEntries(bill),
              accountItems__addJournalEntries(bill)
            ]).then(() => bill);
          });
      }

      // create journal entries
      return Parse.Promise.when([
        // productItems__addJournalEntries(bill),
        accountItems__addJournalEntries(bill)
      ]).then(() => bill);
    }

    function setBillStatus(bill, existed) {

      function getTotal(items) {

        const subtotalHT = items
          .reduce((sum, item) => {
            const entryValue = item.get('amount');
            const itemVATPart = item.get('VATPart');

            return sum + itemGetAmount__HT(entryValue, itemVATPart);
          }, 0.0);

        const totalHT = subtotalHT;

        const totalTaxAmount = items
          .reduce((sum, item) => {

            const itemDiscountPart = item.get('discountPart');
            const itemVATPart = item.get('VATPart');

            const entryValue = item.get('amount');

            const amountHT = itemGetAmount__HT(entryValue, itemVATPart);


            const taxableAmount = amountHT;

            return sum + itemGeVATPart__Amount(taxableAmount, itemVATPart);
          }, 0.0);

        return {
          totalHT,
          total: totalHT + totalTaxAmount,
          VAT: totalTaxAmount,
        };
      }

      function calcTotal(bill) {
        const q = new Parse.Query(BillItem);
        q.equalTo('bill', bill);
        return q.find().then(items => {
          return getTotal(items);
        });
      }

      function calcTotalPaid(bill) {
        const q = new Parse.Query(PaymentOfBillsItem);
        q.equalTo('bill', bill);
        q.select(['amount']);
        return q.find().then(amounts => {
          return amounts.reduce((sum, next) => sum + next.get('amount'), 0.0);
        });
      }

      if (existed) {
        return Parse.Promise.when([calcTotal(bill), calcTotalPaid(bill)]).then(values => {
          const {total, totalHT, VAT, } = values[0];
          const totalPaid = values[1];
          bill.set('total', total);
          bill.set('totalHT', totalHT);
          bill.set('VAT', VAT);
          bill.set('balanceDue', total - totalPaid);
          return bill.save();
        });
      }
      return calcTotal(bill).then(({total, totalHT, VAT, }) => {
        bill.set('total', total);
        bill.set('totalHT', totalHT);
        bill.set('VAT', VAT);
        bill.set('balanceDue', total);
        return bill.save();
      });
    }

    function doSave(bill, existed = false) {
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
          bill.set(fieldName, new Date(value));
          return;
        }

        if (fieldName === 'companyId') {
          bill.set('company',
            {className: 'Company', id: value});
          return;
        }

        if (fieldName === 'payee' && value) {
          bill.set('payee',
            createParseObjectPointer(Parse, value.className, value.id));
          return;
        }

        bill.set(fieldName, value);
      });

      bill.set('words', makeWords([
        bill.get('memo'),
        bill.get('mailingAddress'),
        bill.get('paymentRef'),
      ]));

      if (!existed) {
        bill.set('company', {className: 'Company', id: request.params.companyId,});
        bill.set('user', request.user ? {className: '_User', id: request.user.id,} : null);
      }

      // 1. save bill
      // 2. save all items
      // 3. save relation

      return bill.save(null).then(
        function (object) {

          return Parse.Object.saveAll(items.map(function (item) {
            const p = new BillItem();
            Object.keys(item).forEach(function (fieldName) {
              const value = item[fieldName];
              // if (fieldName === 'item' && value) {
              //   p.set('item',
              //     createParseObjectPointer(Parse, value.className, value.id));
              //   return;
              // }
              // if (fieldName === 'date') {
              //   p.set(fieldName, value ? new Date(value) : null);
              //   return;
              // }
              p.set(fieldName, value);
            });
            p.set('company', {className: 'Company', id: request.params.companyId});
            p.set('bill', object);
            return p;
          })).then(function (items) {
            return object;
          });

        });
    }

  });

};

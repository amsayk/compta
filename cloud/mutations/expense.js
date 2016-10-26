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
const SaleItemClass = require('../types').SaleItem;
const ExpenseItemClass = require('../types').ExpenseItem;
const ExpenseProductItemClass = require('../types').ExpenseProductItem;
const PaymentOfInvoicesItemClass = require('../types').PaymentOfInvoicesItem;
const PaymentOfBillsItemClass = require('../types').PaymentOfBillsItem;

const moment = require('moment');

module.exports.delExpense = function delExpense(request, response) {
  // const ExpenseProductItem = ExpenseProductItemClass({id: request.params.companyId});
  const ExpenseItem = ExpenseItemClass({id: request.params.companyId});

  const Operation = OperationClass({id: request.params.companyId});

  const Transaction = TransactionClass({id: request.params.companyId});

  const Expense = ExpenseClass({id: request.params.companyId});

  const expense = new Expense();
  expense.id = request.params.id;

  function handleError(error) {
    response.error(formatError(error));
  }

  function dropExpenseItems(expense) {

    function accountItems_drop() {
      const q = new Parse.Query(ExpenseItem);
      q.equalTo('expense', expense);
      q.select([]);
      return q.find().then(items => {
        // const relation = expense.relation('items');
        // items.forEach(item => relation.remove(item));
        return Parse.Object.destroyAll(items);
      });
    }

    function productItems_drop() {

      const q = new Parse.Query(ExpenseProductItem);
      q.equalTo('expense', expense);
      q.select([]);
      return q.find().then(items => {
        // const relation = expense.relation('productItems');
        // items.forEach(item => relation.remove(item));
        return Parse.Object.destroyAll(items);
      });
    }

    return Parse.Promise.when([
      // productItems_drop(),
      accountItems_drop()
    ]).then(() => expense.save(null));
  }

  dropExpenseItems(expense)
    .then(expense => Parse.Promise.when([
      dropJournalEntries(expense),
      expense.destroy(),
    ]))
    .then(function () {
      response.success({deletedExpenseId: expense.id});
    }, handleError);

  function dropJournalEntries(expense) {

    function dropTransaction(expense) {
      const qry = new Parse.Query(Transaction);
      qry.equalTo('expense', expense);
      qry.limit(1);
      return qry.first().then(transaction => {
        if (transaction) {
          return dropOperations(transaction)
            .then(() => transaction.destroy())
            .then(() => expense)
        }

        return Promise.resolve(expense);
      }).catch(error => {
        return Promise.resolve(expense);
      });
    }

    function dropOperations(transaction) {
      const qry = new Parse.Query(Operation);
      qry.equalTo('transaction', transaction);
      qry.limit(100000);
      return qry.find().then(operations => Parse.Object.destroyAll(operations));
    }

    return dropTransaction(expense);
  }
}

module.exports.addExpense = function addExpense(request, response) {

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

    // const ExpenseProductItem = ExpenseProductItemClass({id: request.params.companyId});

    const Operation = OperationClass({id: request.params.companyId});

    const Transaction = TransactionClass({id: request.params.companyId});

    const ExpenseItem = ExpenseItemClass({id: request.params.companyId});

    const Expense = ExpenseClass({id: request.params.companyId});

    const expense = new Expense();
    const id = request.params.id;

    function setExpenseStatus(expense) {

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

      function calcTotal(expense) {
        const q = new Parse.Query(ExpenseItem);
        q.equalTo('expense', expense);
        q.limit(100000);
        return q.find().then(items => {
          return getTotal(items);
        });
      }

      return calcTotal(expense).then(({total, totalHT, VAT, }) => {
        expense.set('total', total);
        expense.set('totalHT', totalHT);
        expense.set('VAT', VAT);

        expense.set('balanceDue', 0.0);
        return expense.save();
      });
    }

    function handleError(error) {
      const errStr = formatError(error);
      response.error(errStr);
    }

    function dropExpenseItems(expense) {
      const q = new Parse.Query(ExpenseItem);
      q.equalTo('expense', expense);
      q.limit(100000);
      return q.find().then(items => {
        return Parse.Object.destroyAll(items).then(() => expense);
      });
    }

    if (typeof id !== 'undefined') {
      expense.id = id;
      expense.fetch().then(expense => {
        return dropExpenseItems(expense)
          .then(expense => doSave(expense, true))
          .then(expense => Parse.Promise.when([
            setExpenseStatus(expense),
            enterJournalEntries(expense, true),
          ]).then(() => expense));
      }).then(function (object) {
        response.success({addedExpenseId: object.id});
      }, handleError);
    } else {
      doSave(expense)
        .then(expense => Parse.Promise.when([
          setExpenseStatus(expense),
          enterJournalEntries(expense, false),
        ]).then(() => expense))
        .then(function (object) {
          response.success({addedExpenseId: object.id});
        }, handleError);
    }

    function enterJournalEntries(expense, existed) {

      function dropJournalEntries(expense) {

        function dropTransaction(expense) {
          const qry = new Parse.Query(Transaction);
          qry.equalTo('expense', expense);
          qry.limit(1);
          return qry.first().then(transaction => {
            if (transaction) {
              return dropOperations(transaction)
                .then(() => transaction.destroy())
                .then(() => expense)
            }

            return Promise.resolve(expense);
          });
        }

        function dropOperations(transaction) {
          const qry = new Parse.Query(Operation);
          qry.equalTo('transaction', transaction);
          qry.limit(100000);
          return qry.find().then(operations => Parse.Object.destroyAll(operations));
        }

        return dropTransaction(expense);
      }

      function productItems__addJournalEntries(expense) {
        const q = new Parse.Query(ExpenseProductItem);
        q.equalTo('expense', expense);
        q.select(['qty', 'VATPart', 'rate', 'item', 'item.expenseAccountCode']);
        q.include(['item']);

        const payeeType = expense.get('payeeType');

        const customer = expense.get('customer');
        const employee = expense.get('employee');
        const vendor = expense.get('vendor');

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

            const operation = new Operation();
            operation.set('expense', expense);
            operation.set('refNo', expense.get('refNo'));
            operation.set('date', expense.get('date'));
            operation.set('transactionType', 'Expense');
            // operation.set('payee', expense.get('payee'));
            operation.set('payeeType', payeeType);
            vendor && operation.set('vendor', vendor);
            employee && operation.set('employee', employee);
            customer && operation.set('customer', customer);
            operation.set('memo', expense.get('memo'));
            operation.set('company', {className: 'Company', id: request.params.companyId,});

            const expensesAccountCode = item.has('item') ? function () {
              const p = item.get('item');
              return p.get('expenseAccountCode');
            }() : '6.1.1.1';

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

            function getBankOp(op) {
              const amount = taxableAmount + VAT;
              op.set('amount', amount);

              const accountCode = expense.get('creditToAccountCode'); // '5.1.6.1.1'; // Caisse centrale;
              // const accountCode = '5.1.4.3'; // Trésorerie Générale

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

              getBankOp(
                operation.clone()),

              ...(VAT > 0 ? [
                getVATOp(
                  operation.clone()),
              ] : []),

            ];
          });

          const transaction = new Transaction();
          transaction.set('expense', expense);
          transaction.set('refNo', expense.get('refNo'));
          transaction.set('date', expense.get('date'));
          transaction.set('transactionType', 'Expense');
          // transaction.set('payee', expense.get('payee'));
          transaction.set('payeeType', payeeType);
          vendor && transaction.set('vendor', vendor);
          employee && transaction.set('employee', employee);
          customer && transaction.set('customer', customer);
          transaction.set('memo', expense.get('memo'));
          transaction.set('company', {className: 'Company', id: request.params.companyId,});

          return transaction.save(null).then(obj => {
            return Parse.Object.saveAll(operations.map(op => {
              op.set('transaction', obj);
              return op;
            }));
          });
        });
      }

      function accountItems__addJournalEntries(expense) {
        const q = new Parse.Query(ExpenseItem);
        q.equalTo('expense', expense);
        q.select(['amount', 'VATPart', 'accountCode']);

        const payeeType = expense.get('payeeType');

        const customer = expense.get('customer');
        const employee = expense.get('employee');
        const vendor = expense.get('vendor');

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
            operation.set('expense', expense);
            operation.set('refNo', expense.get('refNo'));
            operation.set('date', expense.get('date'));
            operation.set('transactionType', 'Expense');
            operation.set('payeeType', payeeType);
            vendor && operation.set('vendor', vendor);
            employee && operation.set('employee', employee);
            customer && operation.set('customer', customer);
            operation.set('memo', expense.get('memo'));
            operation.set('company', {className: 'Company', id: request.params.companyId,});

            function getExpensesAccountOp(op) {
              const amount = taxableAmount;
              op.set('amount', amount);

              op.set('expenseItem', item);

              op.set('VAT', VAT);

              op.set('isExpense', true);

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

            function getBankOp(op) {
              const amount = taxableAmount + VAT;
              op.set('amount', amount);

              const accountCode = '4.4.1.1.1'; // Fournisseurs - catégorie A

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

              getBankOp(
                operation.clone()),

              ...(VAT > 0 ? [
                getVATOp(
                  operation.clone()),
              ] : []),

            ];
          });

          const transaction = new Transaction();
          transaction.set('expense', expense);
          transaction.set('refNo', expense.get('refNo'));
          transaction.set('date', expense.get('date'));
          transaction.set('transactionType', 'Expense');
          // transaction.set('payee', expense.get('payee'));
          transaction.set('payeeType', payeeType);
          vendor && transaction.set('vendor', vendor);
          employee && transaction.set('employee', employee);
          customer && transaction.set('customer', customer);
          transaction.set('memo', expense.get('memo'));
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
        return dropJournalEntries(expense)
          .then(expense => {
            // create journal entries
            return Parse.Promise.when([
              // productItems__addJournalEntries(expense),
              accountItems__addJournalEntries(expense)
            ]).then(() => expense);
          });
      }

      // create journal entries
      return Parse.Promise.when([
        // productItems__addJournalEntries(expense),
        accountItems__addJournalEntries(expense)
      ]).then(() => expense);
    }

    function doSave(expense, existed = false) {
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
          expense.set(fieldName, new Date(value));
          return;
        }

        if (fieldName === 'companyId') {
          expense.set('company', {className: 'Company', id: value});
          return;
        }

        if (fieldName === 'payee' && value) {
          expense.set('payeeType', value.type);

          switch (value.type) {
            case 1 /* 'Customer' */
            :
            case 'Customer':
              expense.set('customer',
                createParseObjectPointer(Parse, value.className, value.id));
              break;

            case 2 /* 'Vendor' */
            :
            case 'Vendor':
              expense.set('vendor',
                createParseObjectPointer(Parse, value.className, value.id));
              break;

            case 3 /* 'Employee' */
            :
            case 'Employee':
              expense.set('employee',
                createParseObjectPointer(Parse, value.className, value.id));
              break;
          }
          return;
        }

        expense.set(fieldName, value);
      });

      expense.set('words', makeWords([
        expense.get('memo'),
        expense.get('paymentRef'),
      ]));

      if (!existed) {
        expense.set('company', {className: 'Company', id: request.params.companyId,});
        expense.set('user', request.user ? {className: '_User', id: request.user.id} : null);
      }

      // 1. save expense
      // 2. save all items
      // 3. save relation

      return expense.save(null).then(
        function (object) {

          return Parse.Object.saveAll(items.map(function (item) {
            const p = new ExpenseItem();
            Object.keys(item).forEach(function (fieldName) {
              const value = item[fieldName];
              p.set(fieldName, value);
            });
            p.set('company', {className: 'Company', id: request.params.companyId});
            p.set('expense', object);
            return p;
          })).then(function (items) {
            return object;
          });

        });
    }

  });
}

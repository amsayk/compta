const makeAlias = require('../utils').makeAlias;
const formatError = require('../utils').formatError;

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
const PaymentOfInvoicesItemClass = require('../types').PaymentOfInvoicesItem;
const PaymentOfBillsItemClass = require('../types').PaymentOfBillsItem;

const moment = require('moment');

module.exports.delPaymentOfBills = function delPaymentOfBills(request, response) {
  const Operation = OperationClass({id: request.params.companyId});

  const Transaction = TransactionClass({id: request.params.companyId});

  const PaymentOfBillsItem = PaymentOfBillsItemClass({id: request.params.companyId});

  const PaymentOfBills = PaymentOfBillsClass({id: request.params.companyId});

  const payment = new PaymentOfBills();
  payment.id = request.params.id;

  function handleError(error) {
    response.error(formatError(error));
  }

  function dropPaymentItems(payment) {
    const q = new Parse.Query(PaymentOfBillsItem);
    q.equalTo('payment', payment);
    q.include(['bill']);
    return q.find().then(items => {
      return Parse.Promise.when(items.map(item => resetBillStatus(item)))
        .then(() => Parse.Object.destroyAll(items))
        .then(() => payment);
    });

    function resetBillStatus(paymentItem) {
      const bill = paymentItem.get('bill');
      const totalReceived = paymentItem.get('amount');

      const curBalanceDue = bill.has('balanceDue') ? bill.get('balanceDue') : 0.0;
      bill.set('balanceDue', curBalanceDue + totalReceived);
      return bill.save();
    }
  }

  dropPaymentItems(payment)
    .then(payment => Parse.Promise.when([
      dropJournalEntries(payment),
      payment.destroy(),
    ]))
    .then(function () {
      response.success({deletedPaymentId: payment.id});
    }, handleError);

  function dropJournalEntries(payment) {

    function dropTransaction(payment) {
      const qry = new Parse.Query(Transaction);
      qry.equalTo('paymentOfBills', payment);
      qry.limit(1);
      return qry.first().then(transaction => {
        if (transaction) {
          return dropOperations(transaction)
            .then(() => transaction.destroy())
            .then(() => payment)
        }

        return Promise.resolve(payment);
      });
    }

    function dropOperations(transaction) {
      const qry = new Parse.Query(Operation);
      qry.equalTo('transaction', transaction);
      qry.limit(100000);
      return qry.find().then(operations => Parse.Object.destroyAll(operations));
    }

    return dropTransaction(payment);
  }
}

module.exports.makePaymentOfBills = function makePaymentOfBills(request, response) {
  const Operation = OperationClass({id: request.params.companyId});

  const Transaction = TransactionClass({id: request.params.companyId});

  const PaymentOfBillsItem = PaymentOfBillsItemClass({id: request.params.companyId});

  const PaymentOfBills = PaymentOfBillsClass({id: request.params.companyId});

  const payment = new PaymentOfBills();
  const id = request.params.id;
  const _items = [];

  function handleError(error) {
    response.error(formatError(error));
  }

  function dropPaymentItems(payment) {
    const q = new Parse.Query(PaymentOfBillsItem);
    q.equalTo('payment', payment);
    q.select([]);
    return q.find().then(items => {
      return Parse.Object.destroyAll(items).then(() => payment);
    });
  }

  function updateBills(payment) {

    function getBillStatus(paymentItem) {
      const bill = paymentItem.get('bill');

      function calcTotalReceived(bill) {
        const q = new Parse.Query(PaymentOfBillsItem);
        q.equalTo('bill', bill);
        q.select(['amount']);
        return q.find().then(items => {
          return items.reduce((sum, next) => sum + next.get('amount'), 0.0);
        });
      }

      return calcTotalReceived(bill).then(totalReceived => {
        const total = bill.get('total');
        bill.set('balanceDue', total - totalReceived);
        bill.set('lastPaymentDate', payment.get('date'));
        return bill;
      });
    }

    const q = new Parse.Query(PaymentOfBillsItem);
    q.equalTo('payment', payment);
    q.include(['bill']);
    return q.find().then(items => {

      return Parse.Promise.when(
        items.map(item => getBillStatus(item)));
    }).then((bills) => Parse.Object.saveAll(bills))
      .then((bills) => {

        function getTotal(bills) {
          const total = bills.reduce((sum, bill) => sum + bill.get('total'), 0.0);
          const totalHT = bills.reduce((sum, bill) => sum + bill.get('totalHT'), 0.0);
          return { total, totalHT};
        }

        const {
          total,
          totalHT,
        } = getTotal(bills);

        payment.set('totalHT', totalHT);
        payment.set('VAT', total - totalHT);

        return payment.save(null);
      });
  }

  function setPaymentStatus(payment) {

    function calcAmountToApply(payment) {
      const q = new Parse.Query(PaymentOfBillsItem);
      q.equalTo('payment', payment);
      q.select(['amount']);
      return q.find().then(items => {
        return items.reduce((sum, next) => sum + next.get('amount'), 0.0);
      });
    }

    return calcAmountToApply(payment).then(amountToApply => {
      const amountReceived = payment.get('amountReceived');

      payment.set('total', amountToApply);
      payment.set('balanceDue', amountReceived - amountToApply);

      payment.set('amountToApply', amountToApply);
      payment.set('amountToCredit', amountReceived - amountToApply);

      return payment.save();
    });
  }

  if (typeof id !== 'undefined') {
    payment.id = id;
    payment.fetch().then(payment => {
      return dropPaymentItems(payment)
        .then(payment => doSave(payment, true))
        .then(payment => Parse.Promise.when([
          setPaymentStatus(payment),
          updateBills(payment),
          enterJournalEntries(payment, true)]).then(() => payment));
    }).then(function (object) {
      response.success({addedPaymentId: object.id, changedBillsIds: _items.map(item => item.billId)});
    }, handleError);
  } else {
    doSave(payment)
      .then(payment => Parse.Promise.when([
        setPaymentStatus(payment),
        updateBills(payment),
        enterJournalEntries(payment, false)]).then(() => payment))
      .then(function (object) {
        response.success({addedPaymentId: object.id, changedBillsIds: _items.map(item => item.billId)});
      }, handleError);
  }

  function enterJournalEntries(payment, existed) {

    function dropJournalEntries(payment) {

      function dropTransaction(payment) {
        const qry = new Parse.Query(Transaction);
        qry.equalTo('paymentOfBills', payment);
        qry.limit(1);
        return qry.first().then(transaction => {
          if (transaction) {
            return dropOperations(transaction)
              .then(() => transaction.destroy())
              .then(() => payment)
          }

          return Promise.resolve(payment);
        });
      }

      function dropOperations(transaction) {
        const qry = new Parse.Query(Operation);
        qry.equalTo('transaction', transaction);
        qry.limit(100000);
        return qry.find().then(operations => Parse.Object.destroyAll(operations));
      }

      return dropTransaction(payment);
    }

    function addJournalEntries(payment) {
      const q = new Parse.Query(PaymentOfBillsItem);
      q.equalTo('payment', payment);
      q.include(['bill']);
      return q.find().then(items => {

        const total = items.reduce((sum, next) => sum + next.get('amount'), 0.0);

        const payee = payment.get('payee');
        const refNo = payment.get('refNo');

        function getBankOp() {
          const op = new Operation();

          op.set('paymentOfBills', payment);
          op.set('refNo', refNo);
          op.set('date', payment.get('date'));
          op.set('transactionType', 'PaymentOfBills');
          op.set('payee', payee);
          op.set('memo', payment.get('memo'));
          op.set('company', { className: 'Company', id: request.params.companyId,});

          op.set('amount', total);

          const accountCode = payment.get('creditToAccountCode'); // '5.1.6.1.1'; // Caisse centrale;
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

        function getAccountsPayableOp() {
          const op = new Operation();

          op.set('paymentOfBills', payment);
          op.set('refNo', refNo);
          op.set('date', payment.get('date'));
          op.set('transactionType', 'PaymentOfBills');
          op.set('payee', payee);
          op.set('memo', payment.get('memo'));
          op.set('company', { className: 'Company', id: request.params.companyId,});

          op.set('amount', total);

          const accountCode = '4.4.1.1.1'; // Fournisseurs - catégorie A

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

        const operations = [
          getAccountsPayableOp(),
          getBankOp()
        ];

        // const operations = flatmap(items, item => {
        //   const operation = new Operation();
        //
        //   const bill = item.get('bill');
        //   const payee = bill.get('payee');
        //   const refNo = bill.get('refNo');
        //
        //   operation.set('paymentOfBills', payment);
        //   operation.set('refNo', refNo);
        //   operation.set('date', payment.get('date'));
        //   operation.set('transactionType', 'PaymentOfBills');
        //   operation.set('payee', payee);
        //   operation.set('memo', payment.get('memo'));
        //   operation.set('company', { className: 'Company', id: request.params.companyId, });
        //
        //   const amount = item.get('amount');
        //   operation.set('amount', amount);
        //
        //   function getBankOp(op){
        //     const accountCode = payment.get('creditToAccountCode'); // '5.1.6.1.1'; // Caisse centrale;
        //     // const accountCode = '5.1.4.3'; // Trésorerie Générale
        //
        //     op.set('accountCode', accountCode);
        //
        //     op.set('categoryCode',
        //       take(accountCode.split(/\./), 2).join('.'));
        //
        //     op.set('groupCode',
        //       take(accountCode.split(/\./), 3).join('.'));
        //
        //     op.set('classCode',
        //       take(accountCode.split(/\./), 1).join('.'));
        //
        //     op.set('type', 'CREDIT');
        //
        //     return op;
        //   }
        //
        //   function getAccountsPayableOp(op){
        //     const accountCode = '4.4.1.1.1'; // Fournisseurs - catégorie A
        //
        //     op.set('accountCode', accountCode);
        //
        //     op.set('categoryCode',
        //       take(accountCode.split(/\./), 2).join('.'));
        //
        //     op.set('groupCode',
        //       take(accountCode.split(/\./), 3).join('.'));
        //
        //     op.set('classCode',
        //       take(accountCode.split(/\./), 1).join('.'));
        //
        //     op.set('type', 'DEBIT');
        //
        //     return op;
        //   }
        //
        //   return [
        //     getBankOp(
        //       operation.clone()),
        //
        //     getAccountsPayableOp(
        //       operation.clone())
        //   ];
        // });

        // const payee = payment.get('payee');

        const transaction = new Transaction();
        transaction.set('paymentOfBills', payment);
        transaction.set('refNo', payment.get('refNo'));
        transaction.set('date', payment.get('date'));
        transaction.set('transactionType', 'PaymentOfBills');
        transaction.set('payee', payee);
        transaction.set('memo', payment.get('memo'));
        transaction.set('company', { className: 'Company', id: request.params.companyId,});

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
      return dropJournalEntries(payment)
        .then(payment => {
          // create journal entries
          return addJournalEntries(payment);
        });
    }

    // create journal entries
    return addJournalEntries(payment);
  }

  function doSave(payment, existed = false) {

    const props = request.params;

    Object.keys(props).forEach(function (fieldName) {
      const value = props[fieldName];

      if (fieldName === 'items') {
        value.forEach(function (item) {
          _items.push(item);
        });
        return;
      }

      if (fieldName === 'date') {
        payment.set(fieldName, new Date(value));
        return;
      }

      if (fieldName === 'companyId') {
        payment.set('company', { className: 'Company', id: value});
        return;
      }

      if (fieldName === 'payee' && value) {
        payment.set('payee',
          createParseObjectPointer(Parse, value.className, value.id));
        return;
      }

      payment.set(fieldName, value);
    });

    payment.set('words', makeWords([
      payment.get('memo'),
      payment.get('mailingAddress'),
      payment.get('paymentRef'),
    ]));

    if(!existed){
      payment.set('company', { className: 'Company', id: request.params.companyId, });
      payment.set('user', request.user ? { className: '_User', id: request.user.id, } : null);
    }

    // 1. save payment
    // 2. save all items
    // 3. save relation

    return payment.save(null).then(
      function (object) {

        return Parse.Object.saveAll(_items.map(function (item) {
          const p = new PaymentOfBillsItem();

          p.set('company', { className: 'Company', id: request.params.companyId});
          p.set('index', item.index);
          p.set('date', new Date(props['date']));
          p.set('payment', object);
          p.set('bill', createParseObjectPointer(Parse, 'Expense_' + request.params.companyId, item.billId));

          p.set('amount', item.amount);

          return p;
        })).then(function () {
          return object;
        });

      });
  }
}

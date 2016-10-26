const resetTransactionsSeq = require('./utils').resetTransactionsSeq;
const getTransactionSequence = require('./utils').getTransactionSequence;
const getPaymentOfBillsTransactionSequence = require('./utils').getPaymentOfBillsTransactionSequence;

const AccountClass = require('./types').Account;
const TransactionClass = require('./types').Transaction;
const OperationClass = require('./types').Operation;

const InvoiceClass = require('./types').Invoice;
const BillClass = require('./types').Bill;
const ExpenseClass = require('./types').Expense;
const PaymentOfInvoicesClass = require('./types').PaymentOfInvoices;
const SaleClass = require('./types').Sale;

const PaymentOfBillsClass = require('./types').PaymentOfBills;

module.exports = function setup(company){
  const Transaction = TransactionClass(company);
  const Operation = OperationClass(company);

  const Expense = ExpenseClass(company);
  const Sale = SaleClass(company);
  const PaymentOfInvoices = PaymentOfInvoicesClass(company);
  const Invoice = InvoiceClass(company);
  const Bill = BillClass(company);
  const PaymentOfBills = PaymentOfBillsClass(company);

  function setPaymentOfBillsRefNo(request, response) {

    if(!request.object.has('refNo')){

      if (request.object.isNew()) {
        getPaymentOfBillsTransactionSequence(request.object.get('company'), function (err, index) {
          if (err) {
            response.error('Could not get a transaction index.');
            return;
          }

          request.object.set('refNo', index);
          response.success();
        });
      } else {
        response.success();
      }

    }else{
      response.success();
    }

  }

  function setRefNo(request, response) {

    if(!request.object.has('refNo')){

      if (request.object.isNew()) {
        getTransactionSequence(request.object.get('company'), function (err, index) {
          if (err) {
            response.error('Could not get a transaction index.');
            return;
          }

          request.object.set('refNo', index);
          response.success();
        });
      } else {
        response.success();
      }

    }else{
      response.success();
    }

  }

  // Set seq number before save
  // Parse.Cloud.beforeSave(Transaction, setRefNo);

  // Set seq number before save
  Parse.Cloud.beforeSave(Sale, setRefNo);

  // Set seq number before save
  // Parse.Cloud.beforeSave(Expense, setRefNo);

  // Set seq number before save
  Parse.Cloud.beforeSave(Invoice, setRefNo);

  // Set seq number before save
  // Parse.Cloud.beforeSave(Bill, setRefNo);

  // Set seq number before save
  Parse.Cloud.beforeSave(PaymentOfBills, setPaymentOfBillsRefNo);

  // Set seq number before save
  // Parse.Cloud.beforeSave(PaymentOfInvoices, setRefNo);

  // Add Operation to its Account when one is created and mark dirty!
  // Parse.Cloud.afterSave(Operation, function (request) {
  //   const operation = request.object;
  //
  //   const company = operation.get('company');
  //   const date = operation.get('date');
  //   const code = operation.get('accountCode');
  //
  //   const Account = AccountClass(company);
  //   const query = new Parse.Query(Account);
  //
  //   query.equalTo('code', code);
  //
  //   function doWork(){
  //     const account = new Account();
  //     const _account = accounts[code];
  //
  //     if (!_account) {
  //       throw new Error('Invalid account code:' + code);
  //     }
  //
  //     const props = {
  //       code: code,
  //       name: _account.name,
  //       cache_classCode: _account._classCode,
  //       cache_categoryCode: _account._categoryCode,
  //       cache_groupCode: _account._groupCode,
  //       company: company,
  //     };
  //
  //     return account.save(props).then(function (object) {
  //       const relation = object.relation('operations');
  //       relation.add(operation);
  //       return object.save(null);
  //     });
  //   }
  //
  //   return query.first({
  //     success: function (object) {
  //       if (object) {
  //         const relation = object.relation('operations');
  //         relation.add(operation);
  //         return object.save(null);
  //       } else {
  //
  //         return doWork();
  //       }
  //     },
  //
  //     error: function(){
  //       // Operation table doesn't exist yet.
  //       return doWork();
  //     }
  //   }).then(function () {
  //     },
  //     function (error) {
  //     });
  //
  // });

  // Remove Operation relations from Account
  // Parse.Cloud.afterDelete(Operation, function (request) {
  //   const operation = request.object;
  //
  //   const company = operation.get('company');
  //   const date = operation.get('date');
  //   const accountCode = operation.get('accountCode');
  //
  //   const Account = AccountClass(company);
  //   const query = new Parse.Query(Account);
  //
  //   query.equalTo('code', accountCode);
  //   return query.first().then(function (account) {
  //     if (account) {
  //       const relation = account.relation('operations');
  //       relation.remove(operation);
  //       return account.save(null);
  //     }
  //   }).then(function () {
  //     },
  //     function (error) {
  //     });
  //
  // });


  // Delete all its operations when a Transaction is deleted!
  // Parse.Cloud.afterDelete(Transaction, function (request) {
  //   const transaction = request.object;
  //
  //   const query = new Parse.Query(Operation);
  //   query.equalTo('transaction', transaction);
  //
  //   return query.find().then(function (ops) {
  //     return Parse.Object.destroyAll(ops);
  //   }).then(function () {
  //   }, function (error) {
  //   });
  // });

  // Delete all its operations when a Sale is deleted!
  // Parse.Cloud.afterDelete(Sale, function (request) {
  //   const sale = request.object;
  //
  //   const query = new Parse.Query(Operation);
  //   query.equalTo('sale', sale);
  //
  //   return query.find().then(function (ops) {
  //     return Parse.Object.destroyAll(ops);
  //   }).then(function () {
  //   }, function (error) {
  //   });
  // });

  // Delete all its operations when a Expense is deleted!
  // Parse.Cloud.afterDelete(Expense, function (request) {
  //   const expense = request.object;
  //
  //   const query = new Parse.Query(Operation);
  //   query.equalTo('expense', expense);
  //
  //   return query.find().then(function (ops) {
  //     return Parse.Object.destroyAll(ops);
  //   }).then(function () {
  //   }, function (error) {
  //   });
  // });

  // Delete all its operations when a Invoice is deleted!
  // Parse.Cloud.afterDelete(Invoice, function (request) {
  //   const invoice = request.object;
  //
  //   const query = new Parse.Query(Operation);
  //   query.equalTo('invoice', invoice);
  //
  //   return query.find().then(function (ops) {
  //     return Parse.Object.destroyAll(ops);
  //   }).then(function () {
  //   }, function (error) {
  //   });
  // });

  // Delete all its operations when a Payment is deleted!
  // Parse.Cloud.afterDelete(PaymentOfInvoices, function (request) {
  //   const payment = request.object;
  //
  //   const query = new Parse.Query(Operation);
  //   query.equalTo('payment', payment);
  //
  //   return query.find().then(function (ops) {
  //     return Parse.Object.destroyAll(ops);
  //   }).then(function () {
  //   }, function (error) {
  //   });
  // });

  return resetTransactionsSeq(company);
};

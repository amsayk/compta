const queue = null;

Parse.Cloud.define('action', function __op(request, response) {

  const job = queue.createJob('action', {
    ...request,
    type: request.params.type,
    params: request.params.params,
  });

  job.priority('critical');

  job.on('complete', function (result) {
    response.success(result);
  });

  job.on('failed', function (err) {
    response.error(err);
  });

  job.save();

});

queue.process('action', function (job, done) {

  const {type, params, user, ...props,} = job.data;

  const request = {
    ...props,
    user,
    params,
  };

  const response = {
    success(result) {
      done(result);
    },

    error(err){
      done(err);
    },

  };

  switch (type) {
    case 'addInvoice':
      return addInvoice(request, response);
    case 'addSale':
      return addSale(request, response);
    case 'receivePaymentOfInvoices':
      return receivePaymentOfInvoices(request, response);

    case 'delInvoice':
      return delInvoice(request, response);
    case 'delSale':
      return delSale(request, response);
    case 'delPaymentOfInvoices':
      return delPaymentOfInvoices(request, response);

    case 'addExpense':
      return addExpense(request, response);
    case 'addBill':
      return addBill(request, response);
    case 'makePaymentOfBills':
      return makePaymentOfBills(request, response);

    case 'delExpense':
      return delExpense(request, response);
    case 'delBill':
      return delBill(request, response);
    case 'delPaymentOfBills':
      return delPaymentOfBills(request, response);

    case 'addPeople':
      return addPeople(request, response);

    case 'addProduct':
      return addProduct(request, response);

    default:
  }

});
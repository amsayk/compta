module.exports = {
  Product: Type('Product'),

  Invoice: Type('Sale'),
  Sale: Type('Sale'),
  PaymentOfInvoices: Type('Sale'),

  Bill: Type('Expense'),
  Expense: Type('Expense'),
  PaymentOfBills: Type('Expense'),

  Employee: Type('People'),

  Customer: Type('People'),

  Vendor: Type('People'),

  Operation: Type('Operation'),

  Transaction: Type('Transaction'),

  Company: Parse.Object.extend('Company'),

  VATDeclaration: Type('VATDeclaration'),

  Account: Type('Account'),

  BillItem: Type('BillItem'),
  BillProductItem: Type('BillProductItem'),

  InvoiceItem: Type('InvoiceItem'),
  SaleItem: Type('SaleItem'),

  ExpenseItem: Type('ExpenseItem'),
  ExpenseProductItem: Type('ExpenseProductItem'),

  PaymentOfInvoicesItem: Type('PaymentOfInvoicesItem'),
  PaymentOfBillsItem: Type('PaymentOfBillsItem'),

  Seq: Parse.Object.extend('Seq'),

  File: Type('File'),
};

function Type(name) {
  return function(company){
    return Parse.Object.extend(name + '_' + company.id);
  }
}

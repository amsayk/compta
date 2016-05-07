var COMPANY_ID = 'JrbOXuSBIa';

function delSales() {
  db.getCollection('SaleItem_' + COMPANY_ID).drop();
  db.getCollection('Sale_' + COMPANY_ID).drop();
  db.getCollection('_Join:items:Sale_' + COMPANY_ID).drop();
}
function delInvoices() {
  db.getCollection('InvoiceItem_' + COMPANY_ID).drop();
  db.getCollection('Invoice_' + COMPANY_ID).drop();
  db.getCollection('_Join:items:Invoice_' + COMPANY_ID).drop();
}
function delPaymentsOfInvoices() {
  db.getCollection('PaymentOfInvoicesItem_' + COMPANY_ID).drop();
  db.getCollection('PaymentOfInvoices_' + COMPANY_ID).drop();
}
function delExpenses() {
  db.getCollection('ExpenseItem_' + COMPANY_ID).drop();
  db.getCollection('Expense_' + COMPANY_ID).drop();
  db.getCollection('_Join:items:Expense_' + COMPANY_ID).drop();
}
function delBills() {
  db.getCollection('BillItem_' + COMPANY_ID).drop();
  db.getCollection('Bill_' + COMPANY_ID).drop();
  db.getCollection('_Join:items:Bill_' + COMPANY_ID).drop();
}
function delPaymentsOfBills() {
  db.getCollection('PaymentOfBillsItem_' + COMPANY_ID).drop();
  db.getCollection('PaymentOfBills_' + COMPANY_ID).drop();
}
function delOperations() {
  db.getCollection('Operation_' + COMPANY_ID).drop();
}
function delTransactions() {
  db.getCollection('Transaction_' + COMPANY_ID).drop();
}
function delCustomers() {
  db.getCollection('Customer_' + COMPANY_ID).drop();
}
function delVendors() {
  db.getCollection('Vendor_' + COMPANY_ID).drop();
}
function delAll(){
  delSales();
  delInvoices();
  delPaymentsOfInvoices();

  delExpenses();
  delBills();
  delPaymentsOfBills();

  delTransactions();
  delOperations();

}
function delPeople(){
  delVendors();
  delCustomers();
}
function showAll(){
print(db.getCollectionNames());
}

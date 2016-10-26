const {
  fromGlobalId,
  nodeDefinitions,
} = require('graphql-relay');

const isType = require('./isType');

const {

  getViewer,
  getUser,
  getTransaction,
  getOperation,
  getAccount,
  getCompany,

  getBank,
  getEmployee,
  getCustomer,
  getVendor,

  getSale,
  getSaleItem,

  getExpense,
  getExpenseItem,
  getBillItem,

  getInvoice,
  getPaymentOfBills,
  getBill,
  getInvoiceItem,
  getPaymentOfInvoicesItem,
  getPaymentOfBillsItem,

  getPaymentOfInvoices,

  getProduct,

  getFile,

} = require('../../database/v2');

const {
  getVATDeclaration
} = require('../../database/v2');

const { nodeInterface, nodeField, } = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);

    switch (type){
      case 'Company':                 return getCompany(id);
      case 'User':                    return getUser(id);
      case 'Transaction':             return getTransaction(id);
      case 'Operation':               return getOperation(id);
      case 'Account':                 return getAccount(id);
      case 'Bank':                    return getBank(id);
      case 'Product':                 return getProduct(id);
      case 'Employee':                return getEmployee(id);
      case 'Customer':                return getCustomer(id);
      case 'Vendor':                  return getVendor(id);
      case 'PaymentOfInvoices':       return getPaymentOfInvoices(id);
      case 'PaymentOfBills':          return getPaymentOfBills(id);
      case 'Sale':                    return getSale(id);
      case 'SaleItem':                return getSaleItem(id);
      case 'Invoice':                 return getInvoice(id);
      case 'Bill':                    return getBill(id);
      case 'BillItem':                return getBillItem(id);
      case 'InvoiceItem':             return getInvoiceItem(id);
      case 'PaymentOfInvoicesItem':   return getPaymentOfInvoicesItem(id);
      case 'PaymentOfBillsItemItem':  return getPaymentOfBillsItem(id);
      case 'Expense':                 return getExpense(id);
      case 'ExpenseItem':             return getExpenseItem(id);
      case 'File':                    return getFile(id);
      case 'VATDeclaration':          return getVATDeclaration(id);
    }

    console.warn(`Resolve: Returning null for`, type, ` with id`, id);
  },
 (obj) => {

    const {
      User,
    } = require('../../database/v2');

     const {
       userType,
       companyType,
       transactionType,
       operationType,
       accountType,
       bankType,
       productType,
       employeeType,
       customerType,
       vendorType,
       expenseType,
       expenseItemType,
       invoiceType,
       billType,
       billItemType,
       saleType,
       paymentOfInvoicesType,
       paymentOfBillsType,
       saleItemType,
       invoiceItemType,
       paymentOfInvoicesItemType,
       paymentOfBillsItemType,
       fileType,
       VATDeclarationType,
     } = require('./types');

     if (obj instanceof User) {
       return userType;
     }

     if(obj.__type){

       switch (obj.__type){
         case 'Company':                 return companyType;
         case 'Transaction':             return transactionType;
         case 'Operation':               return operationType;
         case 'Account':                 return accountType;
         case 'Bank':                    return bankType;
         case 'Product':                 return productType;
         case 'Employee':                return employeeType;
         case 'Customer':                return customerType;
         case 'Vendor':                  return vendorType;
         case 'Expense':                 return expenseType;
         case 'ExpenseItem':             return expenseItemType;
         case 'Invoice':                 return invoiceType;
         case 'Bill':                    return billType;
         case 'BillItem':                return billItemType;
         case 'Sale':                    return saleType;
         case 'PaymentOfInvoices':       return paymentOfInvoicesType;
         case 'PaymentOfBills':          return paymentOfBillsType;
         case 'SaleItem':                return saleItemType;
         case 'InvoiceItem':             return invoiceItemType;
         case 'PaymentOfInvoicesItem':   return paymentOfInvoicesItemType;
         case 'PaymentOfBillsItem':      return paymentOfBillsItemType;
         case 'File':                    return fileType;
         case 'VATDeclaration':          return VATDeclarationType;
       }
     }

     if(isType(obj, 'Company')){ return companyType; }
     if(isType(obj, 'Transaction')){ return transactionType; }
     if(isType(obj, 'Operation')){ return operationType; }
     if(isType(obj, 'Account')){ return accountType; }
     if(isType(obj, 'Bank')){ return bankType; }
     if(isType(obj, 'Product')){ return productType; }
     if(isType(obj, 'Employee')){ return employeeType; }
     if(isType(obj, 'Customer')){ return customerType; }
     if(isType(obj, 'Vendor')){ return vendorType; }
     if(isType(obj, 'Expense')){ return expenseType; }
     if(isType(obj, 'ExpenseItem')){ return expenseItemType; }
     if(isType(obj, 'Invoice')){ return invoiceType; }
     if(isType(obj, 'Bill')){ return billType; }
     if(isType(obj, 'Sale')){ return saleType; }
     if(isType(obj, 'PaymentOfInvoices')){ return paymentOfInvoicesType; }
     if(isType(obj, 'PaymentOfBills')){ return paymentOfBillsType; }
     if(isType(obj, 'SaleItem')){ return saleItemType; }
     if(isType(obj, 'InvoiceItem')){ return invoiceItemType; }
     if(isType(obj, 'PaymentOfInvoicesItem')){ return paymentOfInvoicesItemType; }
     if(isType(obj, 'PaymentOfBillsItem')){ return paymentOfBillsItemType; }
     if(isType(obj, 'File')){ return fileType; }
     if(isType(obj, 'VATDeclaration')){ return VATDeclarationType; }

     console.warn(`ResolveType: Returning null for`, obj);
   }
);

module.exports = { nodeInterface, nodeField, };

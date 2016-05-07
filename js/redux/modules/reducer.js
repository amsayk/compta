import { combineReducers } from 'redux';

import {reducer as form,} from 'redux-form';
import companies from './companies';
import account from './account';
import transactions from './transactions';
import invoices from './invoices';
import paymentsOfInvoices from './paymentsOfInvoices';
import sales from './sales';
import expenses from './expenses';
import employees from './employees';
import customers from './customers';
import vendors from './vendors';
import products from './products';
import selection from './selection';
import bills from './bills';
import paymentsOfBills from './paymentsOfBills';

export default combineReducers({
  form: form.normalize({
    normalizing: {
    },
  }),
  companies,
  account,
  transactions,
  invoices,
  sales,
  paymentsOfInvoices,
  expenses,
  employees,
  customers,
  vendors,
  products,
  selection,
  bills,
  paymentsOfBills,
});

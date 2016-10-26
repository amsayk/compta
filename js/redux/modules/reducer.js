import { combineReducers } from 'redux';

import {reducer as form,} from 'redux-form';

import companies from './companies';

import account from './account';

import transactions from './transactions';

import invoices from './v2/invoices';
import paymentsOfInvoices from './v2/paymentsOfInvoices';
import sales from './v2/sales';

import expenses from './v2/expenses';
import bills from './v2/bills';
import paymentsOfBills from './v2/paymentsOfBills';

import employees from './employees';
import customers from './customers';
import vendors from './vendors';
import products from './products';

import vat from './vat';

import selection from './selection';

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
  vat,
});

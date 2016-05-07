import messages from './messages';
import { changeWithKey as change, } from 'redux-form';
import moment from 'moment';

export const Types = (intl) => [
  { id: 'ALL', name: intl.formatMessage(messages['Type_All']), },

  { id: 'bills', name: intl.formatMessage(messages['Type_Bills']), },

  { id: 'open',    name: intl.formatMessage(messages['Type_Open_Bills']), },
  { id: 'overdue',    name: intl.formatMessage(messages['Type_Overdue_Bills']), },

  // { id: 'expenses',    name: intl.formatMessage(messages['Type_Expenses']), },
  { id: 'recent',    name: intl.formatMessage(messages['Type_Recent']), },
  { id: 'money',    name: intl.formatMessage(messages['Type_Money_Received']), },
];

// export const Statuses = (intl) => ({
//   ALL: [
//     { id: 'ALL', name: intl.formatMessage(messages['Status_All']), },
//
//     { id: 'open', name: intl.formatMessage(messages['Status_Open']), },
//     { id: 'overdue', name: intl.formatMessage(messages['Status_Overdue']), },
//     // { id: 'paid',    name: intl.formatMessage(messages['Status_Paid']), },
//     // { id: 'pending',    name: intl.formatMessage(messages['Status_Pending']), },
//     // { id: 'accepted',    name: intl.formatMessage(messages['Status_Accepted']), },
//     { id: 'closed',    name: intl.formatMessage(messages['Status_Closed']), },
//     // { id: 'rejected',    name: intl.formatMessage(messages['Status_Rejected']), },
//     // { id: 'expired',    name: intl.formatMessage(messages['Status_Expired']), },
//   ],
//
//   bills: [
//     { id: 'ALL', name: intl.formatMessage(messages['Status_All']), },
//
//     { id: 'open',    name: intl.formatMessage(messages['Status_Open']), },
//     { id: 'overdue', name: intl.formatMessage(messages['Status_Overdue']), },
//     { id: 'closed',  name: intl.formatMessage(messages['Status_Closed']), },
//   ],
//
//   expenses: [
//     { id: 'ALL', name: intl.formatMessage(messages['Status_All']), },
//   ],
//
//   payments: [
//     { id: 'ALL', name: intl.formatMessage(messages['Status_All']), },
//   ],
//
//   recent: [
//   ],
//
//   money: [
//     { id: 'ALL', name: intl.formatMessage(messages['Status_All']), },
//   ],
// });

export const Dates = (intl) => ([

  // {
  //   id: 1,
  //   name: intl.formatMessage(messages['Dates_Last_x_days'], {days: 365,}),
  //   getValue(formKey){
  //     return [
  //       change('vendorExpensesFilterForm', formKey, 'from', moment().subtract(365, 'days').toDate()),
  //       change('vendorExpensesFilterForm', formKey, 'to', undefined),
  //     ];
  //   }
  // },

  {
    id: 2,
    name: intl.formatMessage(messages['Dates_Today']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().toDate()),
      ];
    }
  },

  {
    id: 3,
    name: intl.formatMessage(messages['Dates_Yesterday']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().subtract(1, 'day').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().subtract(1, 'day').toDate()),
      ];
    }
  },

  {
    id: 4,
    name: intl.formatMessage(messages['Dates_This_week']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().startOf('isoWeek').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().endOf('isoWeek').toDate()),
      ];
    }
  },

  {
    id: 5,
    name: intl.formatMessage(messages['Dates_This_month']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().startOf('month').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().endOf('month').toDate()),
      ];
    }
  },

  {
    id: 6,
    name: intl.formatMessage(messages['Dates_This_quarter']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().startOf('quarter').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().endOf('quarter').toDate()),
      ];
    }
  },

  {
    id: 7,
    name: intl.formatMessage(messages['Dates_This_year']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().startOf('year').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().endOf('year').toDate()),
      ];
    }
  },

  {
    id: 8,
    name: intl.formatMessage(messages['Dates_Last_week']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().subtract(1, 'week').startOf('isoWeek').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().subtract(1, 'week').endOf('isoWeek').toDate()),
      ];
    }
  },

  {
    id: 9,
    name: intl.formatMessage(messages['Dates_Last_month']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().subtract(1, 'month').startOf('month').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().subtract(1, 'month').endOf('month').toDate()),
      ];
    }
  },

  {
    id: 10,
    name: intl.formatMessage(messages['Dates_Last_quarter']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().subtract(1, 'quarter').startOf('quarter').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().subtract(1, 'quarter').endOf('quarter').toDate()),
      ];
    }
  },

  {
    id: 11,
    name: intl.formatMessage(messages['Dates_Last_year']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().subtract(1, 'year').startOf('year').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', moment().subtract(1, 'year').endOf('year').toDate()),
      ];
    }
  },

  {
    id: 12,
    name: intl.formatMessage(messages['Dates_Last_x_days'], { days: 30, }),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', moment().subtract(30, 'days').toDate()),
        change('vendorExpensesFilterForm', formKey, 'to', undefined),
      ];
    }
  },

  {
    id: 13,
    name: intl.formatMessage(messages['Dates_All_dates']),
    getValue(formKey){
      return [
        change('vendorExpensesFilterForm', formKey, 'from', undefined),
        change('vendorExpensesFilterForm', formKey, 'to', undefined),
      ];
    }
  },

]);

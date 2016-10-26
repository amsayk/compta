
import {defineMessages,} from 'react-intl';

export default defineMessages({
  paid_last_x_days: {
    id: 'dashboard-page.message.paid_last_x_days',
    defaultMessage: `{invoices, plural, =0 {ENCAISSEMENTS} =1 {ENCAISSEMENT} other {ENCAISSEMENTS}} dans les derniers {days, number} jours`,
  },

  unpaid_last_x_days: {
    id: 'dashboard-page.message.unpaid_last_x_days',
    defaultMessage: 'Unpaid Last {days, number} Days',
  },

  x_overdue: {
    id: 'dashboard-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_invoices: {
    id: 'dashboard-page.message.x_open_invoices',
    defaultMessage: `{invoices, plural,
      =0 {ENCAISSEMENTS}
      =1 {ENCAISSEMENT}
      other {ENCAISSEMENTS}
    }  EN COURS`,
  },

  invoice_status_Paid: {
    id: 'dashboard-page.message.invoice-status-paid',
    defaultMessage: `Paid`,
  },

  Subtitle: {
    id: 'dashboard-page.title',
    defaultMessage: 'Home',
  },

  Logo: {
    id: 'dashboard-page.logo',
    defaultMessage: 'Logo',
  },

  ExpensesTitle: {
    id: 'dashboard-page.expenses-title',
    defaultMessage: 'Expenses',
  },

  IncomeTitle: {
    id: 'dashboard-page.income-title',
    defaultMessage: 'Chiffre d’affaires',
  },

  NetIncomeTitle: {
    id: 'dashboard-page.net-income-title',
    defaultMessage: 'Net Income',
  },

  ProfitLossTitle: {
    id: 'dashboard-page.profit-and-loss-title',
    defaultMessage: 'Profit  and Loss',
  },

  overdue: {
    id: 'dashboard-page.overdue',
    defaultMessage: 'overdue',
  },

  LastXDays: {
    id: 'dashboard-page.last-x-days',
    defaultMessage: 'Last {days} Days',
  },

  PaidLastXDays: {
    id: 'dashboard-page.paid-last-x-days',
    defaultMessage: 'Paid last {days} Days',
  },

  OpenInvoices: {
    id: 'dashboard-page.open-invoices',
    defaultMessage: 'Open invoices',
  },

  EnterExpense: {
    id: 'dashboard-page.enter-expense',
    defaultMessage: 'Enter an expense',
  },

  EnterInvoice: {
    id: 'dashboard-page.enter-invoice',
    defaultMessage: 'Create an invoice',
  },

  Dates_Last_x_days: {
    id: 'dashbord-page.filter.date-last-x-days',
    defaultMessage: 'Last {days} days',
  },
  Dates_Today: {
    id: 'dashbord-page.filter.date-today',
    defaultMessage: 'Today',
  },
  Dates_Yesterday: {
    id: 'dashbord-page.filter.date-yesterday',
    defaultMessage: 'Yesterday',
  },
  Dates_This_week: {
    id: 'dashbord-page.filter.date-this-week',
    defaultMessage: 'This week',
  },
  Dates_This_month: {
    id: 'dashbord-page.filter.date-this-month',
    defaultMessage: 'This month',
  },
  Dates_This_quarter: {
    id: 'dashbord-page.filter.date-this-quarter',
    defaultMessage: 'This quarter',
  },
  Dates_This_year: {
    id: 'dashbord-page.filter.date-this-year',
    defaultMessage: 'This year',
  },
  Dates_Last_week: {
    id: 'dashbord-page.filter.date-last-week',
    defaultMessage: 'Last week',
  },
  Dates_Last_month: {
    id: 'dashbord-page.filter.date-last-month',
    defaultMessage: 'Last month',
  },
  Dates_Last_quarter: {
    id: 'dashbord-page.filter.date-last-quarter',
    defaultMessage: 'Last quarter',
  },
  Dates_Last_year: {
    id: 'dashbord-page.filter.date-last-year',
    defaultMessage: 'Last year',
  },
  Dates_Custom: {
    id: 'dashbord-page.filter.date-custom',
    defaultMessage: 'Custom',
  },
  Dates_All_dates: {
    id: 'dashbord-page.filter.date-all-dates',
    defaultMessage: 'All dates',
  },

})

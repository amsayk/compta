
import {defineMessages,} from 'react-intl';

export default defineMessages({
  paid_last_x_days: {
    id: 'dashboard-page.message.paid_last_x_days',
    defaultMessage: `{invoices, plural, =0 {ENCAISSEMENTS} =1 {ENCAISSEMENT} other {ENCAISSEMENTS}} dans les derniers {days, number} jours`,
  },

  unpaid_last_x_days: {
    id: 'dashboard-page.message.unpaid_last_x_days',
    defaultMessage: 'Paiements effectués',
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
    // defaultMessage: `Paid`,
    defaultMessage: 'Paiements effectués',
  },

  Subtitle: {
    id: 'dashboard-page.title',
    defaultMessage: 'Accueil',
  },

  Logo: {
    id: 'dashboard-page.logo',
    defaultMessage: 'Logo',
  },

  ExpensesTitle: {
    id: 'dashboard-page.expenses-title',
    defaultMessage: 'Dépenses',
  },

  IncomeTitle: {
    id: 'dashboard-page.income-title',
    defaultMessage: 'Chiffre d’affaires',
  },

  NetIncomeTitle: {
    id: 'dashboard-page.net-income-title',
    defaultMessage: 'Résultat',
  },

  ProfitLossTitle: {
    id: 'dashboard-page.profit-and-loss-title',
    defaultMessage: 'Résultat',
  },

  overdue: {
    id: 'dashboard-page.overdue',
    defaultMessage: 'En retard',
  },

  LastXDays: {
    id: 'dashboard-page.last-x-days',
    defaultMessage: 'Derniers {days} jours',
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
    id: 'dashbord-page.date-last-x-days',
    defaultMessage: 'Derniers {days} jours',
  },

  Dates_Last_x_days: {
    id: 'dashbord-page.date-last-x-days',
    defaultMessage: 'Derniers {days} jours',
  },
  Dates_Today: {
    id: 'dashbord-page.date-today',
    defaultMessage: 'Aujourd\'hui',
  },
  Dates_Yesterday: {
    id: 'dashbord-page.date-yesterday',
    defaultMessage: 'Hier',
  },
  Dates_This_week: {
    id: 'dashbord-page.date-this-week',
    defaultMessage: 'Cette semaine',
  },
  Dates_This_month: {
    id: 'dashbord-page.date-this-month',
    defaultMessage: 'Mois en cours',
  },
  Dates_This_quarter: {
    id: 'dashbord-page.date-this-quarter',
    defaultMessage: 'Le trimestre en cours',
  },
  Dates_This_year: {
    id: 'dashbord-page.date-this-year',
    defaultMessage: 'L\'année en cours',
  },
  Dates_Last_week: {
    id: 'dashbord-page.date-last-week',
    defaultMessage: 'La semaine derniere',
  },
  Dates_Last_month: {
    id: 'dashbord-page.date-last-month',
    defaultMessage: 'Le mois dernier',
  },
  Dates_Last_quarter: {
    id: 'dashbord-page.date-last-quarter',
    defaultMessage: 'Le trimestre dernier',
  },
  Dates_Last_year: {
    id: 'dashbord-page.date-last-year',
    defaultMessage: 'L\'année derniere',
  },
  Dates_Custom: {
    id: 'dashbord-page.date-custom',
    defaultMessage: 'Personnalizer',
  },
  Dates_All_dates: {
    id: 'dashbord-page.date-all-dates',
    defaultMessage: 'Toutes les dates',
  },

})

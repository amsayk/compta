import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Open_Invoices: {
    id: 'employees-items-page.label-totals-open-invoices',
    defaultMessage: `{count, plural, =0 {No open invoices} =1 {1 open invoice} other {{count} open invoices}}`,
  },

  Table_Title_Open_Invoices: {
    id: 'employees-items-page.title-open-invoices',
    defaultMessage: 'FACTURES EN ATTENTE',
  },

  Action_receivepayment: {
    id: 'employees-items-page.action-receivepayment',
    defaultMessage: 'Receive Payment',
  },
  Action_send: {
    id: 'employees-items-page.action-send',
    defaultMessage: 'Send',
  },
  Action_print: {
    id: 'employees-items-page.action-print',
    defaultMessage: 'Print',
  },
  Action_invoice: {
    id: 'employees-items-page.action-invoice',
    defaultMessage: 'New invoice',
  },
  Action_sale: {
    id: 'employees-items-page.action-sale',
    defaultMessage: 'New sales receipt',
  },
  Action_payment: {
    id: 'employees-items-page.action-payment',
    defaultMessage: 'Receive payment',
  },

  Subtitle: {
    id: 'employees-items-page.subtitle',
    defaultMessage: 'Employees',
  },

  last_x_days: {
    id: 'employees-items-toolbar.last-x-days',
    defaultMessage: 'Last {days} Days',
  },
  label_batch_actions: {
    id: 'employees-items-toolbar.label-batch-actions',
    defaultMessage: 'Batch actions',
  },
  menuitem_Send: {
    id: 'employees-items-toolbar.batch-action-send',
    defaultMessage: 'Send',
  },
  menuitem_Print: {
    id: 'employees-items-toolbar.batch-action-print',
    defaultMessage: 'Print',
  },

  Table_Title_Action: {
    id: 'employees-items-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'employees-items-page.message.paid_last_x_days',
    defaultMessage: 'Paid Last {days, number} Days',
  },

  unpaid_last_x_days: {
    id: 'employees-items-page.message.unpaid_last_x_days',
    defaultMessage: 'Unpaid Last {days, number} Days',
  },

  x_overdue: {
    id: 'employees-items-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_invoices: {
    id: 'employees-items-page.message.x_open_invoices',
    defaultMessage: `Open {invoices, plural,
      =0 {Invoices}
      =1 {Invoice}
      other {Invoices}
    }`,
  },

  invoice_status_Paid: {
    id: 'employees-items-page.message.invoice-status-paid',
    defaultMessage: `Paid`,
  },

  noData: {
    id: 'employees-items-page.message.no-data',
    defaultMessage: 'No data to display.',
  },

  NewTransaction: {
    id: 'employees-items-page.message.NewTransaction',
    defaultMessage: 'New Transaction',
  },

  NewEmployee: {
    id: 'employees-items-page.message.NewEmployee',
    defaultMessage: 'New Employee',
  },

  Table_Title_CUSTOMER: {
    id: 'employees-items-page.message.table-title-employee',
    defaultMessage: 'Employee',
  },
  Table_Title_Tel: {
    id: 'employees-items-page.message.table-title-employee-tel',
    defaultMessage: 'Telephone',
  },
  Table_Title_Balance: {
    id: 'employees-items-page.message.table-title-employee-bal',
    defaultMessage: 'Open Balance',
  },
  Table_Title_Actions: {
    id: 'employees-items-page.message.table-title-employee-actions',
    defaultMessage: 'Actions',
  },

  Employee: {
    id: 'employees-items-page.message.Employee',
    defaultMessage: 'Employee',
  },
  Invoice: {
    id: 'employees-items-page.message.Invoice',
    defaultMessage: 'Invoice',
  },

  Sale: {
    id: 'employees-items-page.message.Sale',
    defaultMessage: 'Sale',
  },

  Payment: {
    id: 'employees-items-page.message.Payment',
    defaultMessage: 'Payment',
  },

});

import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Open_Invoices: {
    id: 'customers-items-page.label-totals-open-invoices',
    defaultMessage: `{count, plural, =0 {No open invoices} =1 {1 open invoice} other {{count} open invoices}}`,
  },

  Table_Title_Open_Invoices: {
    id: 'customers-items-page.title-open-invoices',
    defaultMessage: 'FACTURES EN ATTENTE',
  },

  Action_receivepayment: {
    id: 'customers-items-page.action-receivepayment',
    defaultMessage: 'Receive Payment',
  },
  Action_send: {
    id: 'customers-items-page.action-send',
    defaultMessage: 'Send',
  },
  Action_print: {
    id: 'customers-items-page.action-print',
    defaultMessage: 'Print',
  },
  Action_invoice: {
    id: 'customers-items-page.action-invoice',
    defaultMessage: 'New invoice',
  },
  Action_sale: {
    id: 'customers-items-page.action-sale',
    defaultMessage: 'New sales receipt',
  },
  Action_payment: {
    id: 'customers-items-page.action-payment',
    defaultMessage: 'Receive payment',
  },

  Subtitle: {
    id: 'customers-items-page.subtitle',
    defaultMessage: 'Customers',
  },

  last_x_days: {
    id: 'customers-items-toolbar.last-x-days',
    defaultMessage: 'Last {days} Days',
  },
  label_batch_actions: {
    id: 'customers-items-toolbar.label-batch-actions',
    defaultMessage: 'Batch actions',
  },
  menuitem_Send: {
    id: 'customers-items-toolbar.batch-action-send',
    defaultMessage: 'Send',
  },
  menuitem_Print: {
    id: 'customers-items-toolbar.batch-action-print',
    defaultMessage: 'Print',
  },

  Table_Title_Action: {
    id: 'customers-items-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'customers-items-page.message.paid_last_x_days',
    defaultMessage: 'Paid Last {days, number} Days',
  },

  unpaid_last_x_days: {
    id: 'customers-items-page.message.unpaid_last_x_days',
    defaultMessage: 'Unpaid Last {days, number} Days',
  },

  x_overdue: {
    id: 'customers-items-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_invoices: {
    id: 'customers-items-page.message.x_open_invoices',
    defaultMessage: `Open {invoices, plural,
      =0 {Invoices}
      =1 {Invoice}
      other {Invoices}
    }`,
  },

  invoice_status_Paid: {
    id: 'customers-items-page.message.invoice-status-paid',
    defaultMessage: `Paid`,
  },

  noData: {
    id: 'customers-items-page.message.no-data',
    defaultMessage: 'No data to display.',
  },

  NewTransaction: {
    id: 'customers-items-page.message.NewTransaction',
    defaultMessage: 'New Transaction',
  },

  NewCustomer: {
    id: 'customers-items-page.message.NewCustomer',
    defaultMessage: 'New Customer',
  },

  Table_Title_CUSTOMER: {
    id: 'customers-items-page.message.table-title-customer',
    defaultMessage: 'Customer / Company',
  },
  Table_Title_Tel: {
    id: 'customers-items-page.message.table-title-customer-tel',
    defaultMessage: 'Telephone',
  },
  Table_Title_Balance: {
    id: 'customers-items-page.message.table-title-customer-bal',
    defaultMessage: 'Open Balance',
  },
  Table_Title_Actions: {
    id: 'customers-items-page.message.table-title-customer-actions',
    defaultMessage: 'Actions',
  },

  Customer: {
    id: 'customers-items-page.message.Customer',
    defaultMessage: 'Customer',
  },
  Invoice: {
    id: 'customers-items-page.message.Invoice',
    defaultMessage: 'Invoice',
  },

  Sale: {
    id: 'customers-items-page.message.Sale',
    defaultMessage: 'Sale',
  },

  Payment: {
    id: 'customers-items-page.message.Payment',
    defaultMessage: 'Payment',
  },

});

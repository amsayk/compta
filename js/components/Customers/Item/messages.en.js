import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Action_receivepayment: {
    id: 'customer-sales-page.action-receivepayment',
    defaultMessage: 'Receive Payment',
  },
  Action_send: {
    id: 'customer-sales-page.action-send',
    defaultMessage: 'Send',
  },
  Action_print: {
    id: 'customer-sales-page.action-print',
    defaultMessage: 'Print',
  },

  Open_Invoices: {
    id: 'customer-item-page.label-totals-open-invoices',
    defaultMessage: `{count, plural, =0 {No open invoices} =1 {1 open invoice} other {{count} open invoices}}`,
  },

  Totals_All: {
    id: 'customer-sales-form.label-totals-all',
    defaultMessage: 'all',
  },
  Totals_Selected: {
    id: 'customer-sales-form.label-totals-selected',
    defaultMessage: 'selected',
  },
  Totals_Label: {
    id: 'customer-sales-form.label-totals',
    defaultMessage: 'Totals',
  },

  reset_all_lines: {
    id: 'customer-sales-form.reset_all_lines',
    defaultMessage: 'Reset',
  },

  Dates_Last_x_days: {
    id: 'customer-sales-filter-form.date-last-x-days',
    defaultMessage: 'Last {days} days',
  },
  Dates_Today: {
    id: 'customer-sales-filter-form.date-today',
    defaultMessage: 'Today',
  },
  Dates_Yesterday: {
    id: 'customer-sales-filter-form.date-yesterday',
    defaultMessage: 'Yesterday',
  },
  Dates_This_week: {
    id: 'customer-sales-filter-form.date-this-week',
    defaultMessage: 'This week',
  },
  Dates_This_month: {
    id: 'customer-sales-filter-form.date-this-month',
    defaultMessage: 'This month',
  },
  Dates_This_quarter: {
    id: 'customer-sales-filter-form.date-this-quarter',
    defaultMessage: 'This quarter',
  },
  Dates_This_year: {
    id: 'customer-sales-filter-form.date-this-year',
    defaultMessage: 'This year',
  },
  Dates_Last_week: {
    id: 'customer-sales-filter-form.date-last-week',
    defaultMessage: 'Last week',
  },
  Dates_Last_month: {
    id: 'customer-sales-filter-form.date-last-month',
    defaultMessage: 'Last month',
  },
  Dates_Last_quarter: {
    id: 'customer-sales-filter-form.date-last-quarter',
    defaultMessage: 'Last quarter',
  },
  Dates_Last_year: {
    id: 'customer-sales-filter-form.date-last-year',
    defaultMessage: 'Last year',
  },
  Dates_Custom: {
    id: 'customer-sales-filter-form.date-custom',
    defaultMessage: 'Custom',
  },
  Dates_All_dates: {
    id: 'customer-sales-filter-form.date-all-dates',
    defaultMessage: 'All dates',
  },

  clear_filter: {
    id: 'customer-sales-toolbar.clear-filter',
    defaultMessage: 'Clear filter / View all',
  },
  last_x_days: {
    id: 'customer-sales-toolbar.last-x-days',
    defaultMessage: 'Last {days} Days',
  },
  label_batch_actions: {
    id: 'customer-sales-toolbar.label-batch-actions',
    defaultMessage: 'Batch actions',
  },
  menuitem_Send: {
    id: 'customer-sales-toolbar.batch-action-send',
    defaultMessage: 'Send',
  },
  menuitem_Print: {
    id: 'customer-sales-toolbar.batch-action-print',
    defaultMessage: 'Print',
  },

  Customers_All: {
    id: 'customer-sales-filter-form.customer-any',
    defaultMessage: 'All',
  },
  Status_All: {
    id: 'customer-sales-filter-form.statuses-all',
    defaultMessage: 'All statuses',
  },
  Status_Open: {
    id: 'customer-sales-filter-form.statuses-open',
    defaultMessage: 'Open',
  },
  Status_Overdue: {
    id: 'customer-sales-filter-form.statuses-overdue',
    defaultMessage: 'Overdue',
  },
  Status_Paid: {
    id: 'customer-sales-filter-form.statuses-paid',
    defaultMessage: 'Paid',
  },
  Status_Pending: {
    id: 'customer-sales-filter-form.statuses-pending',
    defaultMessage: 'Pending',
  },
  Status_Accepted: {
    id: 'customer-sales-filter-form.statuses-accepted',
    defaultMessage: 'Accepted',
  },
  Status_Closed: {
    id: 'customer-sales-filter-form.statuses-closed',
    defaultMessage: 'Closed',
  },
  Status_Rejected: {
    id: 'customer-sales-filter-form.statuses-rejected',
    defaultMessage: 'Rejected',
  },
  Status_Expired: {
    id: 'customer-sales-filter-form.statuses-expire',
    defaultMessage: 'Expired',
  },

  Type_Invoices: {
    id: 'customer-sales-filter-form.types-invoices',
    defaultMessage: 'Invoices',
  },
  Type_Open_Invoices: {
    id: 'customer-sales-filter-form.types-open-invoices',
    defaultMessage: 'Open invoices',
  },
  Type_Overdue_Invoices: {
    id: 'customer-sales-filter-form.types-overdue-invoices',
    defaultMessage: 'Overdue invoices',
  },
  Type_All: {
    id: 'customer-sales-filter-form.types-all',
    defaultMessage: 'All transactions',
  },
  Type_Payments: {
    id: 'customer-sales-filter-form.types-payments',
    defaultMessage: 'Payments',
  },

  Type_Sales: {
    id: 'customer-sales-filter-form.types-sales',
    defaultMessage: 'Sales',
  },

  Type_Recent: {
    id: 'customer-sales-filter-form.types-recent',
    defaultMessage: 'Recently paid',
  },

  Type_Money_Received: {
    id: 'customer-sales-filter-form.types-money-received',
    defaultMessage: 'Money received',
  },

  clearButton: {
    id: 'customer-sales-filter-form.date.clearButton',
    defaultMessage: 'Select Date',
  },

  label_Type: {
    id: 'customer-sales-filter-form.label.type',
    defaultMessage: 'Type',
  },

  label_Status: {
    id: 'customer-sales-filter-form.label.status',
    defaultMessage: 'Status',
  },

  label_Date: {
    id: 'customer-sales-filter-form.label.date',
    defaultMessage: 'Date',
  },

  label_From: {
    id: 'customer-sales-filter-form.label.from',
    defaultMessage: 'From',
  },

  label_To: {
    id: 'customer-sales-filter-form.label.to',
    defaultMessage: 'To',
  },

  label_Customer: {
    id: 'customer-sales-filter-form.label.customer',
    defaultMessage: 'Customer',
  },

  save: {
    id: 'customer-sales-filter-form.action.save',
    defaultMessage: 'Save',
  },

  Reset: {
    id: 'customer-sales-filter-form.action.reset',
    defaultMessage: 'Reset',
  },

  Confirm: {
    id: 'customer-sales-page.confirm',
    defaultMessage: 'Are you sure?',
  },

  Subtitle: {
    id: 'customer-sales-page.subtitle',
    defaultMessage: 'Sales',
  },

  noData: {
    id: 'customer-sales-page.message.no-data',
    defaultMessage: 'No data to display.',
  },

  NewTransaction: {
    id: 'customer-sales-page.message.NewTransaction',
    defaultMessage: 'New Transaction',
  },

  Invoice: {
    id: 'customer-sales-page.message.Invoice',
    defaultMessage: 'Invoice',
  },

  Sale: {
    id: 'customer-sales-page.message.Sale',
    defaultMessage: 'Sale',
  },

  Payment: {
    id: 'customer-sales-page.message.Payment',
    defaultMessage: 'Payment',
  },

  InvoiceType: {
    id: 'customer-sales-page.message.invoice-type',
    defaultMessage: 'Invoice',
  },

  SaleType: {
    id: 'customer-sales-page.message.customer-sales-type',
    defaultMessage: 'Sale',
  },

  PaymentType: {
    id: 'customer-sales-page.message.payment-type',
    defaultMessage: 'Payment',
  },

  InvoiceStatusOpen: {
    id: 'customer-sales-page.message.invoice-status-open',
    defaultMessage: 'Open',
  },

  InvoiceStatusClosed: {
    id: 'customer-sales-page.message.invoice-status-closed',
    defaultMessage: 'Paid',
  },

  InvoiceStatusOverdue: {
    id: 'customer-sales-page.message.invoice-status-overdue',
    defaultMessage: 'Overdue',
  },

  InvoiceStatusPaid: {
    id: 'customer-sales-page.message.invoice-status-paid',
    defaultMessage: 'Paid',
  },

  InvoiceStatusPartial: {
    id: 'customer-sales-page.message.invoice-status-partial',
    defaultMessage: 'Partial',
  },

  InvoiceStatusExpired: {
    id: 'customer-sales-page.message.invoice-status-expired',
    defaultMessage: 'Expired',
  },

  SaleStatusClosed: {
    id: 'customer-sales-page.message.customer-sales-status-closed',
    defaultMessage: 'Paid',
  },

  PaymentStatusOpen: {
    id: 'customer-sales-page.message.payment-status-open',
    defaultMessage: 'Open',
  },

  PaymentStatusClosed: {
    id: 'customer-sales-page.message.payment-status-closed',
    defaultMessage: 'Closed',
  },

  PaymentStatusOverdue: {
    id: 'customer-sales-page.message.payment-status-overdue',
    defaultMessage: 'Overdue',
  },

  PaymentStatusPaid: {
    id: 'customer-sales-page.message.payment-status-paid',
    defaultMessage: 'Paid',
  },

  PaymentStatusPartial: {
    id: 'customer-sales-page.message.payment-status-partial',
    defaultMessage: 'Partial',
  },

  PaymentStatusExpired: {
    id: 'customer-sales-page.message.payment-status-expired',
    defaultMessage: 'Expired',
  },

  Table_Title_Date: {
    id: 'customer-sales-page.message.table-title-date',
    defaultMessage: 'Date',
  },

  Table_Title_Type: {
    id: 'customer-sales-page.message.table-title-type',
    defaultMessage: 'Type',
  },

  Table_Title_REF_NO: {
    id: 'customer-sales-page.message.table-title-ref-no',
    defaultMessage: 'Nº',
  },

  Table_Title_CUSTOMER_1: {
    id: 'customer-sales-page.message.table-title-customer-1',
    defaultMessage: 'Customer',
  },

  Table_Title_DueDate: {
    id: 'customer-sales-page.message.table-title-due-date',
    defaultMessage: 'Due Date',
  },

  Table_Title_Balance: {
    id: 'customer-sales-page.message.table-title-balance',
    defaultMessage: 'Balance',
  },

  Table_Title_Status: {
    id: 'customer-sales-page.message.table-title-status',
    defaultMessage: 'Status',
  },

  Table_Title_Lastest_Payment: {
    id: 'customer-sales-page.message.table-title-lastest-payment',
    defaultMessage: 'Latest payment',
  },

  Table_Title_Age: {
    id: 'customer-sales-page.message.table-title-age',
    defaultMessage: 'Age',
  },

  Table_Title_Total: {
    id: 'customer-sales-page.message.table-title-total',
    defaultMessage: 'Total',
  },

  Table_Title_Action: {
    id: 'customer-sales-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'customer-sales-page.message.paid_last_x_days',
    defaultMessage: 'Paid Last {days, number} Days',
  },

  unpaid_last_x_days: {
    id: 'customer-sales-page.message.unpaid_last_x_days',
    defaultMessage: 'Unpaid Last {days, number} Days',
  },

  x_overdue: {
    id: 'customer-sales-page.message.x_overdue',
    defaultMessage: 'Overdue',
  },

  x_open_invoices: {
    id: 'customer-sales-page.message.x_open_invoices',
    defaultMessage: `Open {invoices, plural,
      =0 {Invoices}
      =1 {Invoice}
      other {Invoices}
    }`,
  },

  invoice_status_Paid: {
    id: 'customer-sales-page.message.invoice-status-paid',
    defaultMessage: `Paid`,
  },

  Edit: {
    id: 'customer-item-page.edit',
    defaultMessage: 'Modifier',
  },

  Subtitle: {
    id: 'customer-item-page.subtitle',
    defaultMessage: 'Customers',
  },

  last_x_days: {
    id: 'customer-item-toolbar.last-x-days',
    defaultMessage: 'Last {days} Days',
  },
  label_batch_actions: {
    id: 'customer-item-toolbar.label-batch-actions',
    defaultMessage: 'Batch actions',
  },
  menuitem_Send: {
    id: 'customer-item-toolbar.batch-action-send',
    defaultMessage: 'Send',
  },
  menuitem_Print: {
    id: 'customer-item-toolbar.batch-action-print',
    defaultMessage: 'Print',
  },

  Table_Title_Action: {
    id: 'customer-item-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'customer-item-page.message.paid_last_x_days',
    defaultMessage: 'Paid Last {days, number} Days',
  },

  unpaid_last_x_days: {
    id: 'customer-item-page.message.unpaid_last_x_days',
    defaultMessage: 'Unpaid Last {days, number} Days',
  },

  x_overdue: {
    id: 'customer-item-page.message.x_overdue',
    defaultMessage: 'Overdue',
  },

  x_open_invoices: {
    id: 'customer-item-page.message.x_open_invoices',
    defaultMessage: `Open {invoices, plural,
      =0 {Invoices}
      =1 {Invoice}
      other {Invoices}
    }`,
  },

  invoice_status_Paid: {
    id: 'customer-item-page.message.invoice-status-paid',
    defaultMessage: `Paid`,
  },

  noData: {
    id: 'customer-item-page.message.no-data',
    defaultMessage: 'No data to display.',
  },

  NewTransaction: {
    id: 'customer-item-page.message.NewTransaction',
    defaultMessage: 'New Transaction',
  },

  NewCustomer: {
    id: 'customer-item-page.message.NewCustomer',
    defaultMessage: 'New Customer',
  },

  Table_Title_CUSTOMER: {
    id: 'customer-item-page.message.table-title-customer',
    defaultMessage: 'Customer / Company',
  },
  Table_Title_Tel: {
    id: 'customer-item-page.message.table-title-customer-tel',
    defaultMessage: 'Telephone',
  },
  Table_Title_Balance: {
    id: 'customer-item-page.message.table-title-customer-bal',
    defaultMessage: 'Open Balance',
  },
  Table_Title_Actions: {
    id: 'customer-item-page.message.table-title-customer-actions',
    defaultMessage: 'Actions',
  },

  Customer: {
    id: 'customer-item-page.message.Customer',
    defaultMessage: 'Customer',
  },
  Invoice: {
    id: 'customer-item-page.message.Invoice',
    defaultMessage: 'Invoice',
  },

  Sale: {
    id: 'customer-item-page.message.Sale',
    defaultMessage: 'Sale',
  },

  Payment: {
    id: 'customer-item-page.message.Payment',
    defaultMessage: 'Payment',
  },

});

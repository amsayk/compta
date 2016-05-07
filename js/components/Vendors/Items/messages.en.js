import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Open_Bills: {
    id: 'vendors-items-page.label-totals-open-bills',
    defaultMessage: `{count, plural, =0 {No open bills} =1 {1 open bill} other {{count} open bills}}`,
  },

  Table_Title_Open_Bills: {
    id: 'vendors-items-page.title-open-bills',
    defaultMessage: 'FACTURES EN ATTENTE',
  },

  Action_makepayment: {
    id: 'vendors-items-page.action-makepayment',
    defaultMessage: 'Make Payment',
  },
  Action_send: {
    id: 'vendors-items-page.action-send',
    defaultMessage: 'Send',
  },
  Action_print: {
    id: 'vendors-items-page.action-print',
    defaultMessage: 'Print',
  },
  Action_bill: {
    id: 'vendors-items-page.action-bill',
    defaultMessage: 'New bill',
  },
  Action_expense: {
    id: 'vendors-items-page.action-expense',
    defaultMessage: 'New expense',
  },
  Action_payment: {
    id: 'vendors-items-page.action-payment',
    defaultMessage: 'Receive payment',
  },

  Subtitle: {
    id: 'vendors-items-page.subtitle',
    defaultMessage: 'Vendors',
  },

  last_x_days: {
    id: 'vendors-items-toolbar.last-x-days',
    defaultMessage: 'Last {days} Days',
  },
  label_batch_actions: {
    id: 'vendors-items-toolbar.label-batch-actions',
    defaultMessage: 'Batch actions',
  },
  menuitem_Send: {
    id: 'vendors-items-toolbar.batch-action-send',
    defaultMessage: 'Send',
  },
  menuitem_Print: {
    id: 'vendors-items-toolbar.batch-action-print',
    defaultMessage: 'Print',
  },

  Table_Title_Action: {
    id: 'vendors-items-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'vendors-items-page.message.paid_last_x_days',
    defaultMessage: 'Paid Last {days, number} Days',
  },

  unpaid_last_x_days: {
    id: 'vendors-items-page.message.unpaid_last_x_days',
    defaultMessage: 'Unpaid Last {days, number} Days',
  },

  x_overdue: {
    id: 'vendors-items-page.message.x_overdue',
    defaultMessage: 'Overdue',
  },

  x_open_bills: {
    id: 'vendors-items-page.message.x_open_bills',
    defaultMessage: `Open {bills, plural,
      =0 {Bill}
      other {Bills}
    }`,
  },

  bill_status_Paid: {
    id: 'vendors-items-page.message.bill-status-paid',
    defaultMessage: `Paid`,
  },

  noData: {
    id: 'vendors-items-page.message.no-data',
    defaultMessage: 'No data to display.',
  },

  NewTransaction: {
    id: 'vendors-items-page.message.NewTransaction',
    defaultMessage: 'New Transaction',
  },

  NewVendor: {
    id: 'vendors-items-page.message.NewVendor',
    defaultMessage: 'New Vendor',
  },

  Table_Title_CUSTOMER: {
    id: 'vendors-items-page.message.table-title-vendor',
    defaultMessage: 'Vendor / Company',
  },
  Table_Title_Tel: {
    id: 'vendors-items-page.message.table-title-vendor-tel',
    defaultMessage: 'Telephone',
  },
  Table_Title_Balance: {
    id: 'vendors-items-page.message.table-title-vendor-bal',
    defaultMessage: 'Open Balance',
  },
  Table_Title_Actions: {
    id: 'vendors-items-page.message.table-title-vendor-actions',
    defaultMessage: 'Actions',
  },

  Vendor: {
    id: 'vendors-items-page.message.Vendor',
    defaultMessage: 'Vendor',
  },
  Bill: {
    id: 'vendors-items-page.message.Bill',
    defaultMessage: 'Bill',
  },

  Expense: {
    id: 'vendors-items-page.message.Expense',
    defaultMessage: 'Expense',
  },

  Payment: {
    id: 'vendors-items-page.message.Payment',
    defaultMessage: 'Payment',
  },

});

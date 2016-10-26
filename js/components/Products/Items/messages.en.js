import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Done: {
    id: 'products-items-page.label-done',
    defaultMessage: 'Done',
  },

  Open_Bills: {
    id: 'products-items-page.label-totals-open-bills',
    defaultMessage: `{count, plural, =0 {No open bills} =1 {1 open bill} other {{count} open bills}}`,
  },

  Table_Title_Price: {
    id: 'products-items-page.title-unit-price',
    defaultMessage: 'Prix unitaire/Taux',
  },

  Table_Title_Open_Bills: {
    id: 'products-items-page.title-open-bills',
    defaultMessage: 'FACTURES EN ATTENTE',
  },

  Action_product: {
    id: 'products-items-page.action-product',
    defaultMessage: 'Modifier',
  },
  Action_report: {
    id: 'products-items-page.action-report',
    defaultMessage: 'Executer le rapport',
  },
  Action_delete: {
    id: 'products-items-page.action-del',
    defaultMessage: 'Supprimer',
  },
  Action_bill: {
    id: 'products-items-page.action-bill',
    defaultMessage: 'New bill',
  },
  Action_expense: {
    id: 'products-items-page.action-expense',
    defaultMessage: 'New expense',
  },
  Action_payment: {
    id: 'products-items-page.action-payment',
    defaultMessage: 'Receive payment',
  },

  Subtitle: {
    id: 'products-items-page.subtitle',
    defaultMessage: 'Products',
  },

  last_x_days: {
    id: 'products-items-toolbar.last-x-days',
    defaultMessage: 'Last {days} Days',
  },
  label_batch_actions: {
    id: 'products-items-toolbar.label-batch-actions',
    defaultMessage: 'Batch actions',
  },
  menuitem_Send: {
    id: 'products-items-toolbar.batch-action-send',
    defaultMessage: 'Send',
  },
  menuitem_Print: {
    id: 'products-items-toolbar.batch-action-print',
    defaultMessage: 'Print',
  },

  Table_Title_Action: {
    id: 'products-items-page.message.table-title-action',
    defaultMessage: 'Action',
  },
  Table_Title_Name: {
    id: 'products-items-page.message.table-title-name',
    defaultMessage: 'Nom',
  },

  paid_last_x_days: {
    id: 'products-items-page.message.paid_last_x_days',
    defaultMessage: 'Paid Last {days, number} Days',
  },

  unpaid_last_x_days: {
    id: 'products-items-page.message.unpaid_last_x_days',
    defaultMessage: 'Unpaid Last {days, number} Days',
  },

  x_overdue: {
    id: 'products-items-page.message.x_overdue',
    defaultMessage: 'Overdue',
  },

  x_open_bills: {
    id: 'products-items-page.message.x_open_bills',
    defaultMessage: `Open {bills, plural,
      =0 {Bill}
      other {Bills}
    }`,
  },

  bill_status_Paid: {
    id: 'products-items-page.message.bill-status-paid',
    defaultMessage: `Paid`,
  },

  noData: {
    id: 'products-items-page.message.no-data',
    defaultMessage: 'No data to display.',
  },

  NewTransaction: {
    id: 'products-items-page.message.NewTransaction',
    defaultMessage: 'New Transaction',
  },

  NewProduct: {
    id: 'products-items-page.message.NewProduct',
    defaultMessage: 'New Product',
  },

  Table_Title_CUSTOMER: {
    id: 'products-items-page.message.table-title-product',
    defaultMessage: 'Product / Company',
  },
  Table_Title_Tel: {
    id: 'products-items-page.message.table-title-product-tel',
    defaultMessage: 'Telephone',
  },
  Table_Title_Balance: {
    id: 'products-items-page.message.table-title-product-bal',
    defaultMessage: 'Open Balance',
  },
  Table_Title_Actions: {
    id: 'products-items-page.message.table-title-product-actions',
    defaultMessage: 'Actions',
  },

  Product: {
    id: 'products-items-page.message.Product',
    defaultMessage: 'Product',
  },
  Bill: {
    id: 'products-items-page.message.Bill',
    defaultMessage: 'Bill',
  },

  Expense: {
    id: 'products-items-page.message.Expense',
    defaultMessage: 'Expense',
  },

  Payment: {
    id: 'products-items-page.message.Payment',
    defaultMessage: 'Payment',
  },

});

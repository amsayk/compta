import {
  defineMessages,
} from 'react-intl';

export default defineMessages({

  Popover_Date: {
    id: 'invoice-form.th-popover-date',
    defaultMessage: 'Date',
  },
  Popover_Amount_Applied: {
    id: 'invoice-form.th-popover-amount-applied',
    defaultMessage: 'Amount applied',
  },
  Popover_Date_Payment_RefNo: {
    id: 'invoice-form.th-popover-payment-ref-no',
    defaultMessage: 'Payment Nº',
  },

  TotalDiscount: {
    id: 'invoice-form.label-total-discount',
    defaultMessage: 'Total discount',
  },

  x_payments: {
    id: 'invoice-form.message-x-payments',
    defaultMessage: `{x} {x, plural,
      =1 {payment}
      other {payments}
    }`,
  },

  x_payments_made_since: {
    id: 'invoice-form.message-x-payments-made-since',
    defaultMessage: 'made since {lastPaymentDate}.',
  },

  x_payments_made_on: {
    id: 'invoice-form.message-x-payments-made-on',
    defaultMessage: 'made on {lastPaymentDate}.',
  },

  ErrorTitle: {
    id: 'invoice-form.error-title',
    defaultMessage: 'The following error has occurred',
  },

  amount_label: {
    id: 'invoice-form.amount_label',
    defaultMessage: 'Amount',
  },

  balance_due_label: {
    id: 'invoice-form.balance_due_label',
    defaultMessage: 'BALANCE DUE',
  },

  payment_status_label: {
    id: 'invoice-form.payment_status_label',
    defaultMessage: 'Payment status',
  },

  receive_payment_label: {
    id: 'invoice-form.receive_payment_label',
    defaultMessage: 'Receive payment',
  },

  at_least_one_entry_required: {
    id: 'invoice-form.at_least_one_entry_required',
    defaultMessage: 'At least one transaction is required.',
  },

  Terms_OnReception: {
    id: 'invoice-form.terms-on-reception',
    defaultMessage: 'On reception',
  },

  Terms_Net_15: {
    id: 'invoice-form.terms-net-15',
    defaultMessage: 'Net 15',
  },

  Terms_Net_30: {
    id: 'invoice-form.terms-net-30',
    defaultMessage: 'Net 30',
  },

  Terms_Net_60: {
    id: 'invoice-form.terms-net-60',
    defaultMessage: 'Net 60',
  },

  Terms_Custom: {
    id: 'invoice-form.terms-custom',
    defaultMessage: 'Custom',
  },

  DueDate: {
    id: 'invoice-form.due-date',
    defaultMessage: 'Due date',
  },

  InvoiceDate: {
    id: 'invoice-form.invoice-date',
    defaultMessage: 'Invoice date',
  },

  Terms: {
    id: 'invoice-form.terms',
    defaultMessage: 'Terms',
  },

  BillingAddress: {
    id: 'invoice-form.billing-address',
    defaultMessage: 'Billing Address',
  },

  STATUS_Open: {
    id: 'invoice-form.status-open',
    defaultMessage: 'Open',
  },

  STATUS_PaidLabel: {
    id: 'invoice-form.status-paid-label',
    defaultMessage: 'Paid',
  },

  STATUS_ExpiredLabel: {
    id: 'invoice-form.status-expired-label',
    defaultMessage: 'Expired',
  },

  STATUS_OverdueLabel: {
    id: 'invoice-form.status-overdue-label',
    defaultMessage: 'Overdue',
  },

  AMOUNT_PAID: {
    id: 'invoice-form.amount-paid',
    defaultMessage: 'Amount Paid',
  },

  DIFFERENCE: {
    id: 'invoice-form.deference',
    defaultMessage: 'Difference',
  },

  AMOUNT: {
    id: 'invoice-form.total-amount',
    defaultMessage: 'Amount',
  },

  PAYMENT_STATUS: {
    id: 'invoice-form.payment-status',
    defaultMessage: 'Payment Status',
  },

  BALANCE_DUE: {
    id: 'invoice-form.balance-due',
    defaultMessage: 'Balance Due',
  },

  Confirm: {
    id: 'invoice-form.confirm',
    defaultMessage: 'Are you sure?',
  },

  Title: {
    id: 'invoice-form.title',
    defaultMessage: 'Invoice',
  },

  taxRate: {
    id: 'invoice-form.tax-rate',
    defaultMessage: 'Tax Rate'
  },

  discountRate: {
    id: 'invoice-form.discount-rate',
    defaultMessage: 'Discount Rate'
  },

  Done: {
    id: 'invoice-form.message-done',
    defaultMessage: 'Done',
  },

  cancel: {
    id: 'invoice-form.cancel',
    defaultMessage: 'Cancel'
  },

  save: {
    id: 'invoice-form.action.save',
    defaultMessage: 'Save'
  },

  saveAndClose: {
    id: 'invoice-form.action.save-close',
    defaultMessage: 'Save and close'
  },

  Delete: {
    id: 'invoice-form.action.action-delete',
    defaultMessage: 'Delete'
  },

  JournalEntries: {
    id: 'invoice-form.action.action-journal-entries',
    defaultMessage: 'Journal Entries'
  },

  Actions: {
    id: 'invoice-form.action.invoice-actions',
    defaultMessage: 'Actions'
  },

  error: {
    id: 'invoice-form.error.unknown',
    description: '',
    defaultMessage: 'There was an unknown error. Please try again.',
  },

  searchPromptText: {
    id: 'invoice-form.message.searchPromptText',
    defaultMessage: 'Select Account…',
  },

  customerPlaceholder: {
    id: 'invoice-form.message.accountPlaceholder',
    defaultMessage: 'Select Customer…',
  },

  ServiceDatePlaceholder: {
    id: 'invoice-form.message.Service-Date-Placeholder',
    defaultMessage: 'Choose Date…',
  },

  searchingText: {
    id: 'invoice-form.message.searchingText',
    defaultMessage: 'Searching…',
  },

  emptyFilter: {
    id: 'invoice-form.account-combobox.emptyFilter',
    defaultMessage: 'The filter returned no results',
  },

  clearButton: {
    id: 'invoice-form.date.clearButton',
    defaultMessage: 'Select Date',
  },

  add_more_lines: {
    id: 'invoice-form.add_more_lines',
    defaultMessage: 'Add lines',
  },

  clear_all_lines: {
    id: 'invoice-form.clear_all_lines',
    defaultMessage: 'Clear all lines',
  },

  reset_all_lines: {
    id: 'invoice-form.reset_all_lines',
    defaultMessage: 'Reset',
  },

  Item: {
    id: 'invoice-form.item',
    defaultMessage: 'Product/Service'
  },

  Description: {
    id: 'invoice-form.description',
    defaultMessage: 'Description'
  },

  Qty: {
    id: 'invoice-form.qty',
    defaultMessage: 'qty',
  },

  Rate: {
    id: 'invoice-form.rate',
    defaultMessage: 'Rate'
  },

  Amount: {
    id: 'invoice-form.amount',
    defaultMessage: 'Amount'
  },

  Taxable: {
    id: 'invoice-form.taxable',
    defaultMessage: 'Tax'
  },

  Date: {
    id: 'invoice-form.date',
    defaultMessage: 'Date'
  },

  DiscountPart: {
    id: 'invoice-form.discount-part',
    defaultMessage: 'Discount'
  },

  itemPlaceholder: {
    id: 'invoice-form.action.item-placeholder',
    defaultMessage: 'Enter product…'
  },

  saveAndNew: {
    id: 'invoice-form.action.save-and-new',
    defaultMessage: 'Save and new'
  },

  memo: {
    id: 'invoice-form.memo',
    defaultMessage: 'Enter a note for this journal entry',
  },

  files: {
    id: 'invoice-form.files',
    defaultMessage: 'Add attachments',
  },

  welcome: {
    id: 'invoice-form.message-welcome',
    defaultMessage: 'Welcome to invoices',
  },
  welcome_intro: {
    id: 'invoice-form.message-welcome-intro',
    defaultMessage: 'For each line',
  },

  rule_1_1: {
    id: 'invoice-form.message-rule-1-1',
    defaultMessage: 'Specifie a product or a description',
  },
  rule_1_2: {
    id: 'invoice-form.message-rule-1-2',
    defaultMessage: 'A rate',
  },
  rule_2_1: {
    id: 'invoice-form.message-rule-2-1',
    defaultMessage: 'Specifie a description',
  },
  rule_2_2: {
    id: 'invoice-form.message-rule-2-2',
    defaultMessage: 'An amount',
  },

  got_it: {
    id: 'invoice-form.ok-got-it',
    defaultMessage: 'Got it',
  },

  Subtotal: {
    id: 'invoice-form.label-subtotal',
    defaultMessage: 'Subtotal',
  },

  TaxableSubtotal: {
    id: 'invoice-form.label-taxable-subtotal',
    defaultMessage: 'Taxable Subtotal',
  },

  BalanceDue: {
    id: 'invoice-form.label-balance-due',
    defaultMessage: 'Balance due',
  },
  Total: {
    id: 'invoice-form.label-total',
    defaultMessage: 'Total',
  },
  AmountReceived: {
    id: 'invoice-form.amount-received',
    defaultMessage: 'Amount received',
  },

  discountType_Value: {
    id: 'invoice-form.label-discount-type-value',
    defaultMessage: 'Discount value',
  },

  discountType_Percent: {
    id: 'invoice-form.label-discount-type-percent',
    defaultMessage: 'Percent',
  },

  discountType_1: {
    id: 'invoice-form.label-discount-type-value-num',
    defaultMessage: 'Discount value',
  },

  discountType_2: {
    id: 'invoice-form.label-discount-type-percent-num',
    defaultMessage: 'Percent',
  },

  discountValueError: {
    id: 'invoice-form.error-discount-value',
    defaultMessage: 'Discount value error',
  },

  taxPercentError: {
    id: 'invoice-form.error-tax-percent',
    defaultMessage: 'Tax percent error',
  },

});

import {
  defineMessages,
} from 'react-intl';

export default defineMessages({

  Popover_Date: {
    id: 'bill-form.th-popover-date',
    defaultMessage: 'Date',
  },
  Popover_Amount_Applied: {
    id: 'bill-form.th-popover-amount-applied',
    defaultMessage: 'Amount applied',
  },
  Popover_Date_Payment_RefNo: {
    id: 'bill-form.th-popover-payment-ref-no',
    defaultMessage: 'Payment Nº',
  },

  x_payments: {
    id: 'bill-form.message-x-payments',
    defaultMessage: `{x} {x, plural,
      =1 {payment}
      other {payments}
    }`,
  },

  x_payments_made_since: {
    id: 'bill-form.message-x-payments-made-since',
    defaultMessage: 'made since {lastPaymentDate, date, medium}.',
  },

  x_payments_made_on: {
    id: 'bill-form.message-x-payments-made-on',
    defaultMessage: 'made on {lastPaymentDate, date, medium}.',
  },

  ErrorTitle: {
    id: 'bill-form.error-title',
    defaultMessage: 'The following error has occurred',
  },

  amount_label: {
    id: 'bill-form.amount_label',
    defaultMessage: 'Amount',
  },

  balance_due_label: {
    id: 'bill-form.balance_due_label',
    defaultMessage: 'BALANCE DUE',
  },

  payment_status_label: {
    id: 'bill-form.payment_status_label',
    defaultMessage: 'Payment status',
  },

  receive_payment_label: {
    id: 'bill-form.receive_payment_label',
    defaultMessage: 'Receive payment',
  },

  at_least_one_entry_required: {
    id: 'bill-form.at_least_one_entry_required',
    defaultMessage: 'At least one transaction is required.',
  },

  Terms_OnReception: {
    id: 'bill-form.terms-on-reception',
    defaultMessage: 'On reception',
  },

  Terms_Net_15: {
    id: 'bill-form.terms-net-15',
    defaultMessage: 'Net 15',
  },

  Terms_Net_30: {
    id: 'bill-form.terms-net-30',
    defaultMessage: 'Net 30',
  },

  Terms_Net_60: {
    id: 'bill-form.terms-net-60',
    defaultMessage: 'Net 60',
  },

  Terms_Custom: {
    id: 'bill-form.terms-custom',
    defaultMessage: 'Custom',
  },

  DueDate: {
    id: 'bill-form.due-date',
    defaultMessage: 'Due date',
  },

  BillDate: {
    id: 'bill-form.bill-date',
    defaultMessage: 'Bill date',
  },

  Terms: {
    id: 'bill-form.terms',
    defaultMessage: 'Terms',
  },

  MailingAddress: {
    id: 'bill-form.billing-address',
    defaultMessage: 'Mailing Address',
  },

  STATUS_Open: {
    id: 'bill-form.status-open',
    defaultMessage: 'Open',
  },

  STATUS_PaidLabel: {
    id: 'bill-form.status-paid-label',
    defaultMessage: 'Paid',
  },

  STATUS_ExpiredLabel: {
    id: 'bill-form.status-expired-label',
    defaultMessage: 'Expired',
  },

  STATUS_OverdueLabel: {
    id: 'bill-form.status-overdue-label',
    defaultMessage: 'Overdue',
  },

  AMOUNT_PAID: {
    id: 'bill-form.amount-paid',
    defaultMessage: 'Amount Paid',
  },

  DIFFERENCE: {
    id: 'bill-form.deference',
    defaultMessage: 'Difference',
  },

  AMOUNT: {
    id: 'bill-form.total-amount',
    defaultMessage: 'Amount',
  },

  PAYMENT_STATUS: {
    id: 'bill-form.payment-status',
    defaultMessage: 'Payment Status',
  },

  BALANCE_DUE: {
    id: 'bill-form.balance-due',
    defaultMessage: 'Balance Due',
  },

  Confirm: {
    id: 'bill-form.confirm',
    defaultMessage: 'Are you sure?',
  },

  Title: {
    id: 'bill-form.title',
    defaultMessage: 'Bill',
  },

  taxRate: {
    id: 'bill-form.tax-rate',
    defaultMessage: 'Tax Rate'
  },

  discountRate: {
    id: 'bill-form.discount-rate',
    defaultMessage: 'Discount Rate'
  },

  Done: {
    id: 'bill-form.message-done',
    defaultMessage: 'Done',
  },

  cancel: {
    id: 'bill-form.cancel',
    defaultMessage: 'Cancel'
  },

  save: {
    id: 'bill-form.action.save',
    defaultMessage: 'Save'
  },

  saveAndClose: {
    id: 'bill-form.action.save-close',
    defaultMessage: 'Save and close'
  },

  Delete: {
    id: 'bill-form.action.action-delete',
    defaultMessage: 'Delete'
  },

  JournalEntries: {
    id: 'bill-form.action.action-journal-entries',
    defaultMessage: 'Journal Entries'
  },

  Actions: {
    id: 'bill-form.action.bill-actions',
    defaultMessage: 'Actions'
  },

  error: {
    id: 'bill-form.error.unknown',
    description: '',
    defaultMessage: 'There was an unknown error. Please try again.',
  },

  searchPromptText: {
    id: 'bill-form.message.searchPromptText',
    defaultMessage: 'Select Account…',
  },

  payeePlaceholder: {
    id: 'bill-form.message.payee-placeholder',
    defaultMessage: 'Select a vendor…',
  },

  accountPlaceholder: {
    id: 'bill-form.message.accountPlaceholder',
    defaultMessage: 'Select Account…',
  },

  searchingText: {
    id: 'bill-form.message.searchingText',
    defaultMessage: 'Searching…',
  },

  emptyFilter: {
    id: 'bill-form.account-combobox.emptyFilter',
    defaultMessage: 'The filter returned no results',
  },

  clearButton: {
    id: 'bill-form.date.clearButton',
    defaultMessage: 'Select Date',
  },

  add_more_lines: {
    id: 'bill-form.add_more_lines',
    defaultMessage: 'Add lines',
  },

  clear_all_lines: {
    id: 'bill-form.clear_all_lines',
    defaultMessage: 'Clear all lines',
  },

  reset_all_lines: {
    id: 'bill-form.reset_all_lines',
    defaultMessage: 'Reset',
  },

  Date: {
    id: 'bill-form.date',
    defaultMessage: 'Service Date'
  },

  Item: {
    id: 'bill-form.item',
    defaultMessage: 'Account'
  },

  Description: {
    id: 'bill-form.description',
    defaultMessage: 'Description'
  },

  Qty: {
    id: 'bill-form.qty',
    defaultMessage: 'qty',
  },

  Rate: {
    id: 'bill-form.rate',
    defaultMessage: 'Rate'
  },

  Amount: {
    id: 'bill-form.amount',
    defaultMessage: 'Amount'
  },

  Taxable: {
    id: 'bill-form.taxable',
    defaultMessage: 'Tax'
  },

  itemPlaceholder: {
    id: 'bill-form.action.item-placeholder',
    defaultMessage: 'Enter product…'
  },

  saveAndNew: {
    id: 'bill-form.action.save-and-new',
    defaultMessage: 'Save and new'
  },

  memo: {
    id: 'bill-form.memo',
    defaultMessage: 'Enter a note for this journal entry',
  },

  files: {
    id: 'bill-form.files',
    defaultMessage: 'Add attachments',
  },

  welcome: {
    id: 'bill-form.message-welcome',
    defaultMessage: 'Welcome to invoices',
  },
  welcome_intro: {
    id: 'bill-form.message-welcome-intro',
    defaultMessage: 'For each line',
  },

  rule_1_1: {
    id: 'bill-form.message-rule-1-1',
    defaultMessage: 'Specifie a product or a description',
  },
  rule_1_2: {
    id: 'bill-form.message-rule-1-2',
    defaultMessage: 'A rate',
  },
  rule_2_1: {
    id: 'bill-form.message-rule-2-1',
    defaultMessage: 'Specifie a description',
  },
  rule_2_2: {
    id: 'bill-form.message-rule-2-2',
    defaultMessage: 'An amount',
  },

  got_it: {
    id: 'bill-form.ok-got-it',
    defaultMessage: 'Got it',
  },

  Subtotal: {
    id: 'bill-form.label-subtotal',
    defaultMessage: 'Subtotal',
  },

  TaxableSubtotal: {
    id: 'bill-form.label-taxable-subtotal',
    defaultMessage: 'Taxable Subtotal',
  },

  BalanceDue: {
    id: 'bill-form.label-balance-due',
    defaultMessage: 'Balance due',
  },
  Total: {
    id: 'bill-form.label-total',
    defaultMessage: 'Total',
  },
  AmountReceived: {
    id: 'bill-form.amount-received',
    defaultMessage: 'Amount received',
  },

  discountType_Value: {
    id: 'bill-form.label-discount-type-value',
    defaultMessage: 'Discount value',
  },

  discountType_Percent: {
    id: 'bill-form.label-discount-type-percent',
    defaultMessage: 'Percent',
  },

  discountType_1: {
    id: 'bill-form.label-discount-type-value-num',
    defaultMessage: 'Discount value',
  },

  discountType_2: {
    id: 'bill-form.label-discount-type-percent-num',
    defaultMessage: 'Percent',
  },

  discountValueError: {
    id: 'bill-form.error-discount-value',
    defaultMessage: 'Discount value error',
  },

  taxPercentError: {
    id: 'bill-form.error-tax-percent',
    defaultMessage: 'Tax percent error',
  },

});

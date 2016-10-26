import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  PaymentMethod_Cash: {
    id: 'expense-form.paymment-method-cash',
    defaultMessage: 'Cash',
  },

  PaymentMethod_Check: {
    id: 'expense-form.paymment-method-check',
    defaultMessage: 'Check',
  },

  PaymentMethod_Creditcard: {
    id: 'expense-form.paymment-method-credit-card',
    defaultMessage: 'Credit card',
  },

  Popover_Date: {
    id: 'expense-form.th-popover-date',
    defaultMessage: 'Date',
  },
  Popover_Amount_Applied: {
    id: 'expense-form.th-popover-amount-applied',
    defaultMessage: 'Amount applied',
  },
  Popover_Date_Payment_RefNo: {
    id: 'expense-form.th-popover-payment-ref-no',
    defaultMessage: 'Payment Nº',
  },

  x_payments: {
    id: 'expense-form.message-x-payments',
    defaultMessage: `{x} {x, plural,
      =1 {payment}
      other {payments}
    }`,
  },

  x_payments_made_since: {
    id: 'expense-form.message-x-payments-made-since',
    defaultMessage: 'made since {lastPaymentDate}.',
  },

  x_payments_made_on: {
    id: 'expense-form.message-x-payments-made-on',
    defaultMessage: 'made on {lastPaymentDate}.',
  },

  ErrorTitle: {
    id: 'expense-form.error-title',
    defaultMessage: 'The following error has occurred',
  },

  amount_label: {
    id: 'expense-form.amount_label',
    defaultMessage: 'Amount',
  },

  balance_due_label: {
    id: 'expense-form.balance_due_label',
    defaultMessage: 'BALANCE DUE',
  },

  payment_status_label: {
    id: 'expense-form.payment_status_label',
    defaultMessage: 'Payment status',
  },

  receive_payment_label: {
    id: 'expense-form.receive_payment_label',
    defaultMessage: 'Receive payment',
  },

  at_least_one_entry_required: {
    id: 'expense-form.at_least_one_entry_required',
    defaultMessage: 'At least one transaction is required.',
  },

  Terms_OnReception: {
    id: 'expense-form.terms-on-reception',
    defaultMessage: 'On reception',
  },

  Terms_Net_15: {
    id: 'expense-form.terms-net-15',
    defaultMessage: 'Net 15',
  },

  Terms_Net_30: {
    id: 'expense-form.terms-net-30',
    defaultMessage: 'Net 30',
  },

  Terms_Net_60: {
    id: 'expense-form.terms-net-60',
    defaultMessage: 'Net 60',
  },

  Terms_Custom: {
    id: 'expense-form.terms-custom',
    defaultMessage: 'Custom',
  },

  DueDate: {
    id: 'expense-form.due-date',
    defaultMessage: 'Due date',
  },

  ExpenseDate: {
    id: 'expense-form.expense-date',
    defaultMessage: 'Date du paiement',
  },

  Terms: {
    id: 'expense-form.terms',
    defaultMessage: 'Terms',
  },

  MailingAddress: {
    id: 'expense-form.mailing-address',
    defaultMessage: 'Mailing Address',
  },

  STATUS_Open: {
    id: 'expense-form.status-open',
    defaultMessage: 'Open',
  },

  STATUS_PaidLabel: {
    id: 'expense-form.status-paid-label',
    defaultMessage: 'Paid',
  },

  STATUS_ExpiredLabel: {
    id: 'expense-form.status-expired-label',
    defaultMessage: 'Expired',
  },

  STATUS_OverdueLabel: {
    id: 'expense-form.status-overdue-label',
    defaultMessage: 'Overdue',
  },

  AMOUNT_PAID: {
    id: 'expense-form.amount-paid',
    defaultMessage: 'Amount Paid',
  },

  DIFFERENCE: {
    id: 'expense-form.deference',
    defaultMessage: 'Difference',
  },

  AMOUNT: {
    id: 'expense-form.total-amount',
    defaultMessage: 'Amount',
  },

  PAYMENT_STATUS: {
    id: 'expense-form.payment-status',
    defaultMessage: 'Payment Status',
  },

  BALANCE_DUE: {
    id: 'expense-form.balance-due',
    defaultMessage: 'Balance Due',
  },

  Confirm: {
    id: 'expense-form.confirm',
    defaultMessage: 'Are you sure?',
  },

  Title: {
    id: 'expense-form.title',
    defaultMessage: 'Expense',
  },

  taxRate: {
    id: 'expense-form.tax-rate',
    defaultMessage: 'Tax Rate'
  },

  discountRate: {
    id: 'expense-form.discount-rate',
    defaultMessage: 'Discount Rate'
  },

  Done: {
    id: 'expense-form.message-done',
    defaultMessage: 'Done',
  },

  cancel: {
    id: 'expense-form.cancel',
    defaultMessage: 'Cancel'
  },

  save: {
    id: 'expense-form.action.save',
    defaultMessage: 'Save'
  },

  saveAndClose: {
    id: 'expense-form.action.save-close',
    defaultMessage: 'Save and close'
  },

  Delete: {
    id: 'expense-form.action.action-delete',
    defaultMessage: 'Delete'
  },

  JournalEntries: {
    id: 'expense-form.action.action-journal-entries',
    defaultMessage: 'Journal Entries'
  },

  Actions: {
    id: 'expense-form.action.expense-actions',
    defaultMessage: 'Actions'
  },

  error: {
    id: 'expense-form.error.unknown',
    description: '',
    defaultMessage: 'There was an unknown error. Please try again.',
  },

  searchPromptText: {
    id: 'expense-form.message.searchPromptText',
    defaultMessage: 'Select Account…',
  },

  payeePlaceholder: {
    id: 'expense-form.message.payee-placeholder',
    defaultMessage: 'Select a vendor…',
  },

  accountPlaceholder: {
    id: 'expense-form.message.accountPlaceholder',
    defaultMessage: 'Select Account…',
  },

  searchingText: {
    id: 'expense-form.message.searchingText',
    defaultMessage: 'Searching…',
  },

  emptyFilter: {
    id: 'expense-form.account-combobox.emptyFilter',
    defaultMessage: 'The filter returned no results',
  },

  clearButton: {
    id: 'expense-form.date.clearButton',
    defaultMessage: 'Select Date',
  },

  add_more_lines: {
    id: 'expense-form.add_more_lines',
    defaultMessage: 'Add lines',
  },

  clear_all_lines: {
    id: 'expense-form.clear_all_lines',
    defaultMessage: 'Clear all lines',
  },

  reset_all_lines: {
    id: 'expense-form.reset_all_lines',
    defaultMessage: 'Reset',
  },

  Date: {
    id: 'expense-form.date',
    defaultMessage: 'Service Date'
  },

  Item: {
    id: 'expense-form.item',
    defaultMessage: 'Account'
  },

  Description: {
    id: 'expense-form.description',
    defaultMessage: 'Description'
  },

  Qty: {
    id: 'expense-form.qty',
    defaultMessage: 'qty',
  },

  Rate: {
    id: 'expense-form.rate',
    defaultMessage: 'Rate'
  },

  Amount: {
    id: 'expense-form.amount',
    defaultMessage: 'Amount'
  },

  Taxable: {
    id: 'expense-form.taxable',
    defaultMessage: 'Tax'
  },

  itemPlaceholder: {
    id: 'expense-form.action.item-placeholder',
    defaultMessage: 'Enter product…'
  },

  saveAndNew: {
    id: 'expense-form.action.save-and-new',
    defaultMessage: 'Save and new'
  },

  memo: {
    id: 'expense-form.memo',
    defaultMessage: 'Enter a note for this journal entry',
  },

  files: {
    id: 'expense-form.files',
    defaultMessage: 'Add attachments',
  },

  welcome: {
    id: 'expense-form.message-welcome',
    defaultMessage: 'Welcome to invoices',
  },
  welcome_intro: {
    id: 'expense-form.message-welcome-intro',
    defaultMessage: 'For each line',
  },

  rule_1_1: {
    id: 'expense-form.message-rule-1-1',
    defaultMessage: 'Specifie a product or a description',
  },
  rule_1_2: {
    id: 'expense-form.message-rule-1-2',
    defaultMessage: 'A rate',
  },
  rule_2_1: {
    id: 'expense-form.message-rule-2-1',
    defaultMessage: 'Specifie a description',
  },
  rule_2_2: {
    id: 'expense-form.message-rule-2-2',
    defaultMessage: 'An amount',
  },

  got_it: {
    id: 'expense-form.ok-got-it',
    defaultMessage: 'Got it',
  },

  Subtotal: {
    id: 'expense-form.label-subtotal',
    defaultMessage: 'Subtotal',
  },

  TaxableSubtotal: {
    id: 'expense-form.label-taxable-subtotal',
    defaultMessage: 'Taxable Subtotal',
  },

  BalanceDue: {
    id: 'expense-form.label-balance-due',
    defaultMessage: 'Balance due',
  },
  Total: {
    id: 'expense-form.label-total',
    defaultMessage: 'Total',
  },
  AmountReceived: {
    id: 'expense-form.amount-received',
    defaultMessage: 'Amount received',
  },

  discountType_Value: {
    id: 'expense-form.label-discount-type-value',
    defaultMessage: 'Discount value',
  },

  discountType_Percent: {
    id: 'expense-form.label-discount-type-percent',
    defaultMessage: 'Percent',
  },

  discountType_1: {
    id: 'expense-form.label-discount-type-value-num',
    defaultMessage: 'Discount value',
  },

  discountType_2: {
    id: 'expense-form.label-discount-type-percent-num',
    defaultMessage: 'Percent',
  },

  discountValueError: {
    id: 'expense-form.error-discount-value',
    defaultMessage: 'Discount value error',
  },

  taxPercentError: {
    id: 'expense-form.error-tax-percent',
    defaultMessage: 'Tax percent error',
  },

});

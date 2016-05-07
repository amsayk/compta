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
    defaultMessage: 'Montant appliqué',
  },
  Popover_Date_Payment_RefNo: {
    id: 'invoice-form.th-popover-payment-ref-no',
    defaultMessage: 'Nº de paiement',
  },

  TotalDiscount: {
    id: 'invoice-form.label-total-discount',
    defaultMessage: 'Remise totale',
  },

  x_payments: {
    id: 'invoice-form.message-x-payments',
    defaultMessage: `{x, plural,
      =0 {Aucun paiement}
      =1 {1 paiement}
      other {{x} paiements}
    }`,
  },

  x_payments_made_since: {
    id: 'invoice-form.message-x-payments-made-since',
    defaultMessage: 'effectué(s) depuis {lastPaymentDate, date, medium}.',
  },

  x_payments_made_on: {
    id: 'invoice-form.message-x-payments-made-on',
    defaultMessage: 'effectué(s) le {lastPaymentDate, date, medium}.',
  },

  ErrorTitle: {
    id: 'invoice-form.error-title',
    defaultMessage: 'L\'erreur suivante',
  },

  amount_label: {
    id: 'invoice-form.amount_label',
    defaultMessage: 'Montant',
  },

  balance_due_label: {
    id: 'invoice-form.balance_due_label',
    defaultMessage: 'Solde á payé',
  },

  payment_status_label: {
    id: 'invoice-form.payment_status_label',
    defaultMessage: 'L\'état de paiement',
  },

  receive_payment_label: {
    id: 'invoice-form.receive_payment_label',
    defaultMessage: 'Recevoir un paiement',
  },

  at_least_one_entry_required: {
    id: 'invoice-form.at_least_one_entry_required',
    defaultMessage: 'Au moins une opération est nécessaire.',
  },

  Terms_OnReception: {
    id: 'invoice-form.terms-on-reception',
    defaultMessage: 'Payable dès réception',
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
    defaultMessage: 'Personnalizer',
  },

  DueDate: {
    id: 'invoice-form.due-date',
    defaultMessage: 'Échéance',
  },

  InvoiceDate: {
    id: 'invoice-form.invoice-date',
    defaultMessage: 'Date de facturation',
  },

  Terms: {
    id: 'invoice-form.terms',
    defaultMessage: 'Conditions',
  },

  BillingAddress: {
    id: 'invoice-form.billing-address',
    defaultMessage: 'Adresse de facturation',
  },

  STATUS_Open: {
    id: 'invoice-form.status-open',
    defaultMessage: 'En cours',
  },

  STATUS_PaidLabel: {
    id: 'invoice-form.status-paid-label',
    defaultMessage: 'Payé',
  },

  STATUS_ExpiredLabel: {
    id: 'invoice-form.status-expired-label',
    defaultMessage: 'Expired',
  },

  STATUS_OverdueLabel: {
    id: 'invoice-form.status-overdue-label',
    defaultMessage: 'En retard',
  },

  AMOUNT_PAID: {
    id: 'invoice-form.amount-paid',
    defaultMessage: 'Montant payé',
  },

  DIFFERENCE: {
    id: 'invoice-form.deference',
    defaultMessage: 'Difference',
  },

  AMOUNT: {
    id: 'invoice-form.total-amount',
    defaultMessage: 'Montant',
  },

  PAYMENT_STATUS: {
    id: 'invoice-form.payment-status',
    defaultMessage: 'État de paiement',
  },

  BALANCE_DUE: {
    id: 'invoice-form.balance-due',
    defaultMessage: 'Solde à payé',
  },

  error_has_payments: {
    id: 'invoice-form.error-has-payments',
    defaultMessage: 'Cette facture contient des paiements. Supprimer d\'abord ces paiements avant de continuer.',
  },

  ConfirmDelete: {
    id: 'invoice-form.confirm-delete',
    defaultMessage: 'Êtes-vous sur de vouloir supprimer cette facture ??',
  },

  Confirm: {
    id: 'invoice-form.confirm',
    defaultMessage: 'Voulez-vous quitter sans enregistrer les modifications ??',
  },

  Title: {
    id: 'invoice-form.title',
    defaultMessage: 'Facture',
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
    defaultMessage: 'Terminer',
  },

  cancel: {
    id: 'invoice-form.cancel',
    defaultMessage: 'Annuler'
  },

  save: {
    id: 'invoice-form.action.save',
    defaultMessage: 'Enregistrer'
  },

  saveAndClose: {
    id: 'invoice-form.action.save-close',
    defaultMessage: 'Enregistrer et ferme'
  },

  Delete: {
    id: 'invoice-form.action.action-delete',
    defaultMessage: 'Supprimer'
  },

  JournalEntries: {
    id: 'invoice-form.action.action-journal-entries',
    defaultMessage: 'Ecriture de journal'
  },

  Actions: {
    id: 'invoice-form.action.invoice-actions',
    defaultMessage: 'Actions'
  },

  error: {
    id: 'invoice-form.error.unknown',
    description: '',
    defaultMessage: 'Il y avait une erreur. Veuillez réessayer.',
  },

  searchPromptText: {
    id: 'invoice-form.message.searchPromptText',
    defaultMessage: 'Sélectionner le compte…',
  },

  customerPlaceholder: {
    id: 'invoice-form.message.accountPlaceholder',
    defaultMessage: 'Choisir le client…',
  },

  ServiceDatePlaceholder: {
    id: 'invoice-form.message.Service-Date-Placeholder',
    defaultMessage: 'Sélectionner la date',
  },

  searchingText: {
    id: 'invoice-form.message.searchingText',
    defaultMessage: 'En cours…',
  },

  emptyFilter: {
    id: 'invoice-form.account-combobox.emptyFilter',
    defaultMessage: 'Le filtre n\'a donné aucun résultat',
  },

  clearButton: {
    id: 'invoice-form.date.clearButton',
    defaultMessage: 'Sélectionner la date',
  },

  add_more_lines: {
    id: 'invoice-form.add_more_lines',
    defaultMessage: 'Ajouter des lignes',
  },

  clear_all_lines: {
    id: 'invoice-form.clear_all_lines',
    defaultMessage: 'Supprimer tout',
  },

  reset_all_lines: {
    id: 'invoice-form.reset_all_lines',
    defaultMessage: 'Réinitialiser',
  },

  Item: {
    id: 'invoice-form.item',
    defaultMessage: 'Produit/Service'
  },

  Description: {
    id: 'invoice-form.description',
    defaultMessage: 'Description'
  },

  Qty: {
    id: 'invoice-form.qty',
    defaultMessage: 'qté',
  },

  Rate: {
    id: 'invoice-form.rate',
    defaultMessage: 'Prix unit.'
  },

  Amount: {
    id: 'invoice-form.amount',
    defaultMessage: 'Montant'
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
    defaultMessage: 'Remise'
  },

  itemPlaceholder: {
    id: 'invoice-form.action.item-placeholder',
    defaultMessage: 'Choisir le produit ou service…'
  },

  saveAndNew: {
    id: 'invoice-form.action.save-and-new',
    defaultMessage: 'Enregistrer et nouveau'
  },

  memo: {
    id: 'invoice-form.memo',
    defaultMessage: 'Mémo',
  },

  files: {
    id: 'invoice-form.files',
    defaultMessage: 'Ajouter des pièces jointes',
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
    defaultMessage: 'Total HT',
  },

  TaxableSubtotal: {
    id: 'invoice-form.label-taxable-subtotal',
    defaultMessage: 'Taxable Subtotal',
  },

  BalanceDue: {
    id: 'invoice-form.label-balance-due',
    defaultMessage: 'Solde à payé',
  },
  Total: {
    id: 'invoice-form.label-total',
    defaultMessage: 'Total',
  },
  AmountReceived: {
    id: 'invoice-form.amount-received',
    defaultMessage: 'Montant reçu',
  },

  discountType_Value: {
    id: 'invoice-form.label-discount-type-value',
    defaultMessage: 'Remise (valeur)',
  },

  discountType_Percent: {
    id: 'invoice-form.label-discount-type-percent',
    defaultMessage: 'Remise (%)',
  },

  discountType_1: {
    id: 'invoice-form.label-discount-type-value-num',
    defaultMessage: 'Remise (valeur)',
  },

  discountType_2: {
    id: 'invoice-form.label-discount-type-percent-num',
    defaultMessage: 'Remise (%)',
  },

  discountValueError: {
    id: 'invoice-form.error-discount-value',
    defaultMessage: 'Erreur pour le remise',
  },

  taxPercentError: {
    id: 'invoice-form.error-tax-percent',
    defaultMessage: 'Tax percent error',
  },

});

import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  close: {
    id: 'bill-form.close',
    defaultMessage: 'Fermer'
  },

  AmountHT: {
    id: 'bill-form.amount-ht',
    defaultMessage: 'Montant HT'
  },
  AmountTTC: {
    id: 'bill-form.amount-ttc',
    defaultMessage: 'Montant TTC'
  },

  VATPart: {
    id: 'bill-form.vat-part',
    defaultMessage: 'TVA'
  },

  VATPartPlaceholder: {
    id: 'bill-form.action.vat-part-placeholder',
    defaultMessage: 'TVA…'
  },

  Popover_Date: {
    id: 'bill-form.th-popover-date',
    defaultMessage: 'Date',
  },
  Popover_Amount_Applied: {
    id: 'bill-form.th-popover-amount-applied',
    defaultMessage: 'Montant appliqué',
  },
  Popover_Date_Payment_RefNo: {
    id: 'bill-form.th-popover-payment-ref-no',
    defaultMessage: 'N° de réf.',
  },

  x_payments: {
    id: 'bill-form.message-x-payments',
    defaultMessage: `{x, plural,
      =0 {Aucuns paiements}
      =1 {1 paiement}
      other {{x, number} paiements}
    }`,
  },

  x_payments_made_since: {
    id: 'bill-form.message-x-payments-made-since',
    defaultMessage: 'effectué(s) depuis {lastPaymentDate}.',
  },

  x_payments_made_on: {
    id: 'bill-form.message-x-payments-made-on',
    defaultMessage: 'effectué(s) le {lastPaymentDate}.',
  },

  ErrorTitle: {
    id: 'bill-form.error-title',
    defaultMessage: 'L\'erreur suivante',
  },

  amount_label: {
    id: 'bill-form.amount_label',
    defaultMessage: 'Montant',
  },

  balance_due_label: {
    id: 'bill-form.balance_due_label',
    defaultMessage: 'Solde à payé',
  },

  payment_status_label: {
    id: 'bill-form.payment_status_label',
    defaultMessage: 'État de Paiement',
  },

  receive_payment_label: {
    id: 'bill-form.receive_payment_label',
    defaultMessage: 'Effectuer un paiement',
  },

  at_least_one_entry_required: {
    id: 'bill-form.at_least_one_entry_required',
    defaultMessage: 'Au moins une opération est nécessaire.',
  },

  Terms_OnReception: {
    id: 'bill-form.terms-on-reception',
    defaultMessage: 'Payable dès réception',
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
    defaultMessage: 'Personnalizer',
  },

  DueDate: {
    id: 'bill-form.due-date',
    defaultMessage: 'Échéance',
  },

  BillDate: {
    id: 'bill-form.bill-date',
    defaultMessage: 'Date de la facture fournisseur',
  },

  Terms: {
    id: 'bill-form.terms',
    defaultMessage: 'Conditions',
  },

  MailingAddress: {
    id: 'bill-form.billing-address',
    defaultMessage: 'Adresse postale',
  },

  STATUS_Open: {
    id: 'bill-form.status-open',
    defaultMessage: 'En cours',
  },

  STATUS_PaidLabel: {
    id: 'bill-form.status-paid-label',
    defaultMessage: 'Payé',
  },

  STATUS_ExpiredLabel: {
    id: 'bill-form.status-expired-label',
    defaultMessage: 'Expired',
  },

  STATUS_OverdueLabel: {
    id: 'bill-form.status-overdue-label',
    defaultMessage: 'En retard',
  },

  AMOUNT_PAID: {
    id: 'bill-form.amount-paid',
    defaultMessage: 'Montant Payé',
  },

  DIFFERENCE: {
    id: 'bill-form.deference',
    defaultMessage: 'Difference',
  },

  AMOUNT: {
    id: 'bill-form.total-amount',
    defaultMessage: 'Montant',
  },

  PAYMENT_STATUS: {
    id: 'bill-form.payment-status',
    defaultMessage: 'État de Paiement',
  },

  BALANCE_DUE: {
    id: 'bill-form.balance-due',
    defaultMessage: 'Solde courant',
  },

  error_has_payments: {
    id: 'bill-form.error-has-payments',
    defaultMessage: 'Cette facture fournisseur contient des paiements. Supprimer d\'abord ces paiements avant de continuer.',
  },

  ConfirmDelete: {
    id: 'bill-form.confirm-delete',
    defaultMessage: 'Êtes-vous sur de vouloir supprimer cette facture fournisseur ??',
  },

  Confirm: {
    id: 'bill-form.confirm',
    defaultMessage: 'Voulez-vous quitter sans enregistrer les modifications ??',
  },

  Title: {
    id: 'bill-form.title',
    defaultMessage: 'Facture fournisseur',
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
    defaultMessage: 'Terminer',
  },

  cancel: {
    id: 'bill-form.cancel',
    defaultMessage: 'Annuler'
  },

  save: {
    id: 'bill-form.action.save',
    defaultMessage: 'Enregistrer'
  },

  saveAndClose: {
    id: 'bill-form.action.save-close',
    defaultMessage: 'Enregistrer et fermer'
  },

  Delete: {
    id: 'bill-form.action.action-delete',
    defaultMessage: 'Supprimer'
  },

  JournalEntries: {
    id: 'bill-form.action.action-journal-entries',
    defaultMessage: 'Êcriture de journal'
  },

  Actions: {
    id: 'bill-form.action.bill-actions',
    defaultMessage: 'Actions'
  },

  error: {
    id: 'bill-form.error.unknown',
    description: '',
    defaultMessage: 'Il y avait une erreur. Veuillez réessayer.',
  },

  searchPromptText: {
    id: 'bill-form.message.searchPromptText',
    defaultMessage: 'Sélectionner le compte…',
  },

  payeePlaceholder: {
    id: 'bill-form.message.payee-placeholder',
    defaultMessage: 'Choisir un fournisseur…',
  },

  accountPlaceholder: {
    id: 'bill-form.message.accountPlaceholder',
    defaultMessage: 'Sélectionner le compte…',
  },

  searchingText: {
    id: 'bill-form.message.searchingText',
    defaultMessage: 'En cours…',
  },

  emptyFilter: {
    id: 'bill-form.account-combobox.emptyFilter',
    defaultMessage: 'Le filtre n\'a donné aucun résultat',
  },

  clearButton: {
    id: 'bill-form.date.clearButton',
    defaultMessage: 'Sélectionner la date',
  },

  add_more_lines: {
    id: 'bill-form.add_more_lines',
    defaultMessage: 'Ajouter des lignes',
  },

  clear_all_lines: {
    id: 'bill-form.clear_all_lines',
    defaultMessage: 'Supprimer tout',
  },

  reset_all_lines: {
    id: 'bill-form.reset_all_lines',
    defaultMessage: 'Réinitialiser',
  },

  Date: {
    id: 'bill-form.date',
    defaultMessage: 'Date'
  },

  Item: {
    id: 'bill-form.item',
    defaultMessage: 'Catégorie'
  },

  Description: {
    id: 'bill-form.description',
    defaultMessage: 'Description'
  },

  Qty: {
    id: 'bill-form.qty',
    defaultMessage: 'qté',
  },

  Rate: {
    id: 'bill-form.rate',
    defaultMessage: 'Prix unit.'
  },

  Amount: {
    id: 'bill-form.amount',
    defaultMessage: 'Montant'
  },

  Taxable: {
    id: 'bill-form.taxable',
    defaultMessage: 'Tax'
  },

  itemPlaceholder: {
    id: 'bill-form.action.item-placeholder',
    defaultMessage: 'Choisir la catégorie…'
  },

  saveAndNew: {
    id: 'bill-form.action.save-and-new',
    defaultMessage: 'Enregistrer et nouveau'
  },

  memo: {
    id: 'bill-form.memo',
    defaultMessage: 'Mémo',
  },

  files: {
    id: 'bill-form.files',
    defaultMessage: 'Ajouter des pièces jointes',
  },

  welcome: {
    id: 'bill-form.message-welcome',
    defaultMessage: 'Bienvenue aux factures',
  },
  welcome_intro: {
    id: 'bill-form.message-welcome-intro',
    defaultMessage: 'Pour chaque ligne',
  },

  rule_1_1: {
    id: 'bill-form.message-rule-1-1',
    defaultMessage: 'Spécifier un produit/service ou une description',
  },
  rule_1_2: {
    id: 'bill-form.message-rule-1-2',
    defaultMessage: 'Un taux',
  },
  rule_2_1: {
    id: 'bill-form.message-rule-2-1',
    defaultMessage: 'Spécifier une description',
  },
  rule_2_2: {
    id: 'bill-form.message-rule-2-2',
    defaultMessage: 'Une montant',
  },

  got_it: {
    id: 'bill-form.ok-got-it',
    defaultMessage: 'Ok',
  },

  Subtotal: {
    id: 'bill-form.label-subtotal',
    defaultMessage: 'Sous-Total',
  },

  TaxableSubtotal: {
    id: 'bill-form.label-taxable-subtotal',
    defaultMessage: 'Taxable Subtotal',
  },

  BalanceDue: {
    id: 'bill-form.label-balance-due',
    defaultMessage: 'Solde à payé',
  },
  Total: {
    id: 'bill-form.label-total',
    defaultMessage: 'Total',
  },
  AmountReceived: {
    id: 'bill-form.amount-received',
    defaultMessage: 'Montant reçu',
  },

  discountType_Value: {
    id: 'bill-form.label-discount-type-value',
    defaultMessage: 'Remise (valeur)',
  },

  discountType_Percent: {
    id: 'bill-form.label-discount-type-percent',
    defaultMessage: 'Remise (%)',
  },

  discountType_1: {
    id: 'bill-form.label-discount-type-value-num',
    defaultMessage: 'Remise (valeur)',
  },

  discountType_2: {
    id: 'bill-form.label-discount-type-percent-num',
    defaultMessage: 'Remise (%)',
  },

  discountValueError: {
    id: 'bill-form.error-discount-value',
    defaultMessage: 'Erreur pour le remise',
  },

  taxPercentError: {
    id: 'bill-form.error-tax-percent',
    defaultMessage: 'Tax percent error',
  },

});

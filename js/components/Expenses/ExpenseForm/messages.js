import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  PaymentMethod_Cash: {
    id: 'expense-form.paymment-method-cash',
    defaultMessage: 'En espèces',
  },

  PaymentMethod_Check: {
    id: 'expense-form.paymment-method-check',
    defaultMessage: 'Chèque',
  },

  PaymentMethod_Creditcard: {
    id: 'expense-form.paymment-method-credit-card',
    defaultMessage: 'Carte de crédit',
  },

  Popover_Date: {
    id: 'expense-form.th-popover-date',
    defaultMessage: 'Date',
  },
  Popover_Amount_Applied: {
    id: 'expense-form.th-popover-amount-applied',
    defaultMessage: 'Montant appliqué',
  },
  Popover_Date_Payment_RefNo: {
    id: 'expense-form.th-popover-payment-ref-no',
    defaultMessage: 'Nº de paiement',
  },

  x_payments: {
    id: 'expense-form.message-x-payments',
    defaultMessage: `{x, plural,
      =0 {Aucun paiement}
      =1 {1 paiement}
      other {{x} paiements}
    }`,
  },

  x_payments_made_since: {
    id: 'expense-form.message-x-payments-made-since',
    defaultMessage: 'Crée depuis {lastPaymentDate, date, medium}.',
  },

  x_payments_made_on: {
    id: 'expense-form.message-x-payments-made-on',
    defaultMessage: 'Crée le {lastPaymentDate, date, medium}.',
  },

  ErrorTitle: {
    id: 'expense-form.error-title',
    defaultMessage: 'L\'erreur suivante',
  },

  amount_label: {
    id: 'expense-form.amount_label',
    defaultMessage: 'Montant',
  },

  balance_due_label: {
    id: 'expense-form.balance_due_label',
    defaultMessage: 'Solde á payé',
  },

  payment_status_label: {
    id: 'expense-form.payment_status_label',
    defaultMessage: 'L\'état de paiement',
  },

  receive_payment_label: {
    id: 'expense-form.receive_payment_label',
    defaultMessage: 'Effectuer un paiement',
  },

  at_least_one_entry_required: {
    id: 'expense-form.at_least_one_entry_required',
    defaultMessage: 'Au moins une opération est nécessaire.',
  },

  Terms_OnReception: {
    id: 'expense-form.terms-on-reception',
    defaultMessage: 'Payable dès réception',
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
    defaultMessage: 'Personnalizer',
  },

  DueDate: {
    id: 'expense-form.due-date',
    defaultMessage: 'Échéance',
  },

  ExpenseDate: {
    id: 'expense-form.expense-date',
    defaultMessage: 'Date du paiement',
  },

  Terms: {
    id: 'expense-form.terms',
    defaultMessage: 'Conditions',
  },

  MailingAddress: {
    id: 'expense-form.mailing-address',
    defaultMessage: 'Adresse postale',
  },

  STATUS_Open: {
    id: 'expense-form.status-open',
    defaultMessage: 'En cours',
  },

  STATUS_PaidLabel: {
    id: 'expense-form.status-paid-label',
    defaultMessage: 'Payé',
  },

  STATUS_ExpiredLabel: {
    id: 'expense-form.status-expired-label',
    defaultMessage: 'Expired',
  },

  STATUS_OverdueLabel: {
    id: 'expense-form.status-overdue-label',
    defaultMessage: 'En retard',
  },

  AMOUNT_PAID: {
    id: 'expense-form.amount-paid',
    defaultMessage: 'Montant payé',
  },

  DIFFERENCE: {
    id: 'expense-form.deference',
    defaultMessage: 'Difference',
  },

  AMOUNT: {
    id: 'expense-form.total-amount',
    defaultMessage: 'Montant',
  },

  PAYMENT_STATUS: {
    id: 'expense-form.payment-status',
    defaultMessage: 'État de paiement',
  },

  BALANCE_DUE: {
    id: 'expense-form.balance-due',
    defaultMessage: 'Solde à payé',
  },

  ConfirmDelete: {
    id: 'expense-form.confirm-delete',
    defaultMessage: 'Êtes-vous sur de vouloir supprimer cette opération ??',
  },

  Confirm: {
    id: 'expense-form.confirm',
    defaultMessage: 'Voulez-vous quitter sans enregistrer les modifications ??',
  },

  Title: {
    id: 'expense-form.title',
    defaultMessage: 'Achat comptant',
  },

  taxRate: {
    id: 'expense-form.tax-rate',
    defaultMessage: 'Tax Rate'
  },

  discountRate: {
    id: 'expense-form.discount-rate',
    defaultMessage: 'Remise'
  },

  Done: {
    id: 'expense-form.message-done',
    defaultMessage: 'Terminer',
  },

  cancel: {
    id: 'expense-form.cancel',
    defaultMessage: 'Annuler'
  },

  save: {
    id: 'expense-form.action.save',
    defaultMessage: 'Enregistrer'
  },

  saveAndClose: {
    id: 'expense-form.action.save-close',
    defaultMessage: 'Enregistrer et fermer'
  },

  Delete: {
    id: 'expense-form.action.action-delete',
    defaultMessage: 'Supprimer'
  },

  JournalEntries: {
    id: 'expense-form.action.action-journal-entries',
    defaultMessage: 'Ecriture de journal'
  },

  Actions: {
    id: 'expense-form.action.expense-actions',
    defaultMessage: 'Actions'
  },

  error: {
    id: 'expense-form.error.unknown',
    description: '',
    defaultMessage: 'Il y avait une erreur. Veuillez réessayer.',
  },

  searchPromptText: {
    id: 'expense-form.message.searchPromptText',
    defaultMessage: 'Sélectionner le compte…',
  },

  payeePlaceholder: {
    id: 'expense-form.message.payee-placeholder',
    defaultMessage: 'Choisir un bénéficeur…',
  },

  accountPlaceholder: {
    id: 'expense-form.message.accountPlaceholder',
    defaultMessage: 'Sélectionner le compte…',
  },

  searchingText: {
    id: 'expense-form.message.searchingText',
    defaultMessage: 'En cours…',
  },

  emptyFilter: {
    id: 'expense-form.account-combobox.emptyFilter',
    defaultMessage: 'Le filtre n\'a donné aucun résultat',
  },

  clearButton: {
    id: 'expense-form.date.clearButton',
    defaultMessage: 'Sélectionner la date',
  },

  add_more_lines: {
    id: 'expense-form.add_more_lines',
    defaultMessage: 'Ajouter des lignes',
  },

  clear_all_lines: {
    id: 'expense-form.clear_all_lines',
    defaultMessage: 'Supprimer tout',
  },

  reset_all_lines: {
    id: 'expense-form.reset_all_lines',
    defaultMessage: 'Réinitialiser',
  },

  Date: {
    id: 'expense-form.date',
    defaultMessage: 'Date'
  },

  Item: {
    id: 'expense-form.item',
    defaultMessage: 'Catégorie'
  },

  Description: {
    id: 'expense-form.description',
    defaultMessage: 'Description'
  },

  Qty: {
    id: 'expense-form.qty',
    defaultMessage: 'qté',
  },

  Rate: {
    id: 'expense-form.rate',
    defaultMessage: 'Prix unit.'
  },

  Amount: {
    id: 'expense-form.amount',
    defaultMessage: 'Montant'
  },

  Taxable: {
    id: 'expense-form.taxable',
    defaultMessage: 'Tax'
  },

  itemPlaceholder: {
    id: 'expense-form.action.item-placeholder',
    defaultMessage: 'Choisir la catégorie…'
  },

  saveAndNew: {
    id: 'expense-form.action.save-and-new',
    defaultMessage: 'Enregistrer et nouveau'
  },

  memo: {
    id: 'expense-form.memo',
    defaultMessage: 'Mémo',
  },

  files: {
    id: 'expense-form.files',
    defaultMessage: 'Ajouter des pièces jointes',
  },

  welcome: {
    id: 'expense-form.message-welcome',
    defaultMessage: 'Bienvenue aux factures',
  },
  welcome_intro: {
    id: 'expense-form.message-welcome-intro',
    defaultMessage: 'Pour chaque ligne',
  },

  rule_1_1: {
    id: 'expense-form.message-rule-1-1',
    defaultMessage: 'Spécifier un produit/service ou une description',
  },
  rule_1_2: {
    id: 'expense-form.message-rule-1-2',
    defaultMessage: 'Un taux',
  },
  rule_2_1: {
    id: 'expense-form.message-rule-2-1',
    defaultMessage: 'Spécifier une description',
  },
  rule_2_2: {
    id: 'expense-form.message-rule-2-2',
    defaultMessage: 'Une montant',
  },

  got_it: {
    id: 'expense-form.ok-got-it',
    defaultMessage: 'Ok',
  },

  Subtotal: {
    id: 'expense-form.label-subtotal',
    defaultMessage: 'Sous-Total',
  },

  TaxableSubtotal: {
    id: 'expense-form.label-taxable-subtotal',
    defaultMessage: 'Taxable Subtotal',
  },

  BalanceDue: {
    id: 'expense-form.label-balance-due',
    defaultMessage: 'Solde à payé',
  },
  Total: {
    id: 'expense-form.label-total',
    defaultMessage: 'Total',
  },
  AmountReceived: {
    id: 'expense-form.amount-received',
    defaultMessage: 'Montant reçu',
  },

  discountType_Value: {
    id: 'expense-form.label-discount-type-value',
    defaultMessage: 'Remise (valeur)',
  },

  discountType_Percent: {
    id: 'expense-form.label-discount-type-percent',
    defaultMessage: 'Remise (%)',
  },

  discountType_1: {
    id: 'expense-form.label-discount-type-value-num',
    defaultMessage: 'Remise (valeur)',
  },

  discountType_2: {
    id: 'expense-form.label-discount-type-percent-num',
    defaultMessage: 'Remise (%)',
  },

  discountValueError: {
    id: 'expense-form.error-discount-value',
    defaultMessage: 'Erreur pour le remise',
  },

  taxPercentError: {
    id: 'expense-form.error-tax-percent',
    defaultMessage: 'Tax percent error',
  },

});

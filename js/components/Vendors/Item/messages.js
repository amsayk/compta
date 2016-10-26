import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Table_Title_VAT: {
    id: 'vendor-expenses-page.message.table-title-vat',
    defaultMessage: 'TVA',
  },

  Table_Title_Total_HT: {
    id: 'vendor-expenses-page.message.table-title-total-ht',
    defaultMessage: 'Total HT',
  },

  Action_makepayment: {
    id: 'vendor-expenses-page.action-makepayment',
    defaultMessage: 'Effectuer un paiement',
  },
  Action_send: {
    id: 'vendor-expenses-page.action-send',
    defaultMessage: 'E-mail',
  },
  Action_print: {
    id: 'vendor-expenses-page.action-print',
    defaultMessage: 'Imprimer',
  },

  Open_Bills: {
    id: 'vendor-item-page.label-totals-open-bills',
    defaultMessage: `{count, plural, =0 {No open bills} =1 {1 open bill} other {{count} open bills}}`,
  },

  Totals_All: {
    id: 'vendor-expenses-form.label-totals-all',
    defaultMessage: 'all',
  },
  Totals_Selected: {
    id: 'vendor-expenses-form.label-totals-selected',
    defaultMessage: 'selected',
  },
  Totals_Label: {
    id: 'vendor-expenses-form.label-totals',
    defaultMessage: 'Totals',
  },

  reset_all_lines: {
    id: 'vendor-expenses-form.reset_all_lines',
    defaultMessage: 'Terminer',
  },

  Dates_Last_x_days: {
    id: 'vendor-expenses-filter-form.date-last-x-days',
    defaultMessage: '{days} dernièrs jours',
  },
  Dates_Today: {
    id: 'vendor-expenses-filter-form.date-today',
    defaultMessage: 'Aujourd\'hui',
  },
  Dates_Yesterday: {
    id: 'vendor-expenses-filter-form.date-yesterday',
    defaultMessage: 'Hier',
  },
  Dates_This_week: {
    id: 'vendor-expenses-filter-form.date-this-week',
    defaultMessage: 'Cette semaine',
  },
  Dates_This_month: {
    id: 'vendor-expenses-filter-form.date-this-month',
    defaultMessage: 'Mois en cours',
  },
  Dates_This_quarter: {
    id: 'vendor-expenses-filter-form.date-this-quarter',
    defaultMessage: 'Le trimestre en cours',
  },
  Dates_This_year: {
    id: 'vendor-expenses-filter-form.date-this-year',
    defaultMessage: 'L\'année en cours',
  },
  Dates_Last_week: {
    id: 'vendor-expenses-filter-form.date-last-week',
    defaultMessage: 'La semaine dernière',
  },
  Dates_Last_month: {
    id: 'vendor-expenses-filter-form.date-last-month',
    defaultMessage: 'Mois dernière',
  },
  Dates_Last_quarter: {
    id: 'vendor-expenses-filter-form.date-last-quarter',
    defaultMessage: 'Le trimestre dernièr',
  },
  Dates_Last_year: {
    id: 'vendor-expenses-filter-form.date-last-year',
    defaultMessage: 'L\'année dernière',
  },
  Dates_Custom: {
    id: 'vendor-expenses-filter-form.date-custom',
    defaultMessage: 'Personnalizer',
  },
  Dates_All_dates: {
    id: 'vendor-expenses-filter-form.date-all-dates',
    defaultMessage: 'Toutes les dates',
  },

  clear_filter: {
    id: 'vendor-expenses-toolbar.clear-filter',
    defaultMessage: 'Annuler filtrage/Tout afficher',
  },
  last_x_days: {
    id: 'vendor-expenses-toolbar.last-x-days',
    defaultMessage: '{days} dernièrs jours',
  },
  label_batch_actions: {
    id: 'vendor-expenses-toolbar.label-batch-actions',
    defaultMessage: 'Actions groupées',
  },
  menuitem_Send: {
    id: 'vendor-expenses-toolbar.batch-action-send',
    defaultMessage: 'E-mail',
  },
  menuitem_Print: {
    id: 'vendor-expenses-toolbar.batch-action-print',
    defaultMessage: 'Imprimer',
  },

  Vendors_All: {
    id: 'vendor-expenses-filter-form.vendor-any',
    defaultMessage: 'Tous',
  },
  Status_All: {
    id: 'vendor-expenses-filter-form.statuses-all',
    defaultMessage: 'Toutes les états',
  },
  Status_Open: {
    id: 'vendor-expenses-filter-form.statuses-open',
    defaultMessage: 'En cours',
  },
  Status_Overdue: {
    id: 'vendor-expenses-filter-form.statuses-overdue',
    defaultMessage: 'En retard',
  },
  Status_Paid: {
    id: 'vendor-expenses-filter-form.statuses-paid',
    defaultMessage: 'Payé',
  },
  Status_Pending: {
    id: 'vendor-expenses-filter-form.statuses-pending',
    defaultMessage: 'Pending',
  },
  Status_Accepted: {
    id: 'vendor-expenses-filter-form.statuses-accepted',
    defaultMessage: 'Accepted',
  },
  Status_Closed: {
    id: 'vendor-expenses-filter-form.statuses-closed',
    defaultMessage: 'Fermé',
  },
  Status_Rejected: {
    id: 'vendor-expenses-filter-form.statuses-rejected',
    defaultMessage: 'Rejected',
  },
  Status_Expired: {
    id: 'vendor-expenses-filter-form.statuses-expire',
    defaultMessage: 'Expired',
  },

  Type_Bills: {
    id: 'vendor-expenses-filter-form.types-bills',
    defaultMessage: 'Factures fournisseurs',
  },
  Type_Open_Bills: {
    id: 'vendor-expenses-filter-form.types-open-bills',
    defaultMessage: 'Factures fournisseurs en cours',
  },
  Type_Overdue_Bills: {
    id: 'vendor-expenses-filter-form.types-overdue-bills',
    defaultMessage: 'Factures en retard',
  },
  Type_All: {
    id: 'vendor-expenses-filter-form.types-all',
    defaultMessage: 'Toutes les opérations',
  },
  Type_Payments: {
    id: 'vendor-expenses-filter-form.types-payments',
    defaultMessage: 'Paiement de facture',
  },

  Type_Expenses: {
    id: 'vendor-expenses-filter-form.types-expenses',
    defaultMessage: 'Achats comptant',
  },

  Type_Recent: {
    id: 'vendor-expenses-filter-form.types-recent',
    defaultMessage: 'Payé(es) récemment',
  },

  Type_Money_Received: {
    id: 'vendor-expenses-filter-form.types-money-received',
    defaultMessage: 'Argent reçu',
  },

  clearButton: {
    id: 'vendor-expenses-filter-form.date.clearButton',
    defaultMessage: 'Sélectionner la date',
  },

  label_Type: {
    id: 'vendor-expenses-filter-form.label.type',
    defaultMessage: 'Type',
  },

  label_Status: {
    id: 'vendor-expenses-filter-form.label.status',
    defaultMessage: 'État',
  },

  label_Date: {
    id: 'vendor-expenses-filter-form.label.date',
    defaultMessage: 'Date',
  },

  label_From: {
    id: 'vendor-expenses-filter-form.label.from',
    defaultMessage: 'De',
  },

  label_To: {
    id: 'vendor-expenses-filter-form.label.to',
    defaultMessage: 'À',
  },

  label_Vendor: {
    id: 'vendor-expenses-filter-form.label.vendor',
    defaultMessage: 'Fournisseur',
  },

  save: {
    id: 'vendor-expenses-filter-form.action.save',
    defaultMessage: 'Enregistrer',
  },

  Reset: {
    id: 'vendor-expenses-filter-form.action.reset',
    defaultMessage: 'Terminer',
  },

  Confirm: {
    id: 'vendor-expenses-page.confirm',
    defaultMessage: 'Voulez-vous quitter sans enregistrer les modifications ??',
  },

  Subtitle: {
    id: 'vendor-expenses-page.subtitle',
    defaultMessage: 'Dépenses',
  },

  noData: {
    id: 'vendor-expenses-page.message.no-data',
    defaultMessage: 'Rien à afficher.',
  },

  NewTransaction: {
    id: 'vendor-expenses-page.message.NewTransaction',
    defaultMessage: 'Nouvelle opération',
  },

  Bill: {
    id: 'vendor-expenses-page.message.Bill',
    defaultMessage: 'Facture fournisseur',
  },

  Expense: {
    id: 'vendor-expenses-page.message.Expense',
    defaultMessage: 'Achat comptant',
  },

  Payment: {
    id: 'vendor-expenses-page.message.Payment',
    defaultMessage: 'Infos sur le paiement des factures',
  },

  BillType: {
    id: 'vendor-expenses-page.message.bill-type',
    defaultMessage: 'Facture fournisseur',
  },

  ExpenseType: {
    id: 'vendor-expenses-page.message.vendor-expenses-type',
    defaultMessage: 'Dépense',
  },

  PaymentType: {
    id: 'vendor-expenses-page.message.payment-type',
    defaultMessage: 'Infos sur le paiement des factures',
  },

  BillStatusOpen: {
    id: 'vendor-expenses-page.message.bill-status-open',
    defaultMessage: 'En cours',
  },

  BillStatusClosed: {
    id: 'vendor-expenses-page.message.bill-status-closed',
    defaultMessage: 'Payé',
  },

  BillStatusOverdue: {
    id: 'vendor-expenses-page.message.bill-status-overdue',
    defaultMessage: 'En retard',
  },

  BillStatusPaid: {
    id: 'vendor-expenses-page.message.bill-status-paid',
    defaultMessage: 'Payé',
  },

  BillStatusPartial: {
    id: 'vendor-expenses-page.message.bill-status-partial',
    defaultMessage: 'Partiel',
  },

  BillStatusExpired: {
    id: 'vendor-expenses-page.message.bill-status-expired',
    defaultMessage: 'Expired',
  },

  ExpenseStatusClosed: {
    id: 'vendor-expenses-page.message.vendor-expenses-status-closed',
    defaultMessage: 'Payé',
  },

  PaymentStatusOpen: {
    id: 'vendor-expenses-page.message.payment-status-open',
    defaultMessage: 'En cours',
  },

  PaymentStatusClosed: {
    id: 'vendor-expenses-page.message.payment-status-closed',
    defaultMessage: 'Fermé',
  },

  PaymentStatusOverdue: {
    id: 'vendor-expenses-page.message.payment-status-overdue',
    defaultMessage: 'En retard',
  },

  PaymentStatusPaid: {
    id: 'vendor-expenses-page.message.payment-status-paid',
    defaultMessage: 'Payé',
  },

  PaymentStatusPartial: {
    id: 'vendor-expenses-page.message.payment-status-partial',
    defaultMessage: 'Partiel',
  },

  PaymentStatusExpired: {
    id: 'vendor-expenses-page.message.payment-status-expired',
    defaultMessage: 'Expired',
  },

  Table_Title_Date: {
    id: 'vendor-expenses-page.message.table-title-date',
    defaultMessage: 'Date',
  },

  Table_Title_Type: {
    id: 'vendor-expenses-page.message.table-title-type',
    defaultMessage: 'Type',
  },

  Table_Title_REF_NO: {
    id: 'vendor-expenses-page.message.table-title-ref-no',
    defaultMessage: 'Nº',
  },

  Table_Title_PAYEE_1: {
    id: 'vendor-expenses-page.message.table-title-vendor-1',
    defaultMessage: 'Fournisseur',
  },

  Table_Title_DueDate: {
    id: 'vendor-expenses-page.message.table-title-due-date',
    defaultMessage: 'Échéance',
  },

  Table_Title_Balance: {
    id: 'vendor-expenses-page.message.table-title-balance',
    defaultMessage: 'Solde',
  },

  Table_Title_Status: {
    id: 'vendor-expenses-page.message.table-title-status',
    defaultMessage: 'État',
  },

  Table_Title_Lastest_Payment: {
    id: 'vendor-expenses-page.message.table-title-lastest-payment',
    defaultMessage: 'Latest payment',
  },

  Table_Title_Age: {
    id: 'vendor-expenses-page.message.table-title-age',
    defaultMessage: 'Age',
  },

  Table_Title_Total: {
    id: 'vendor-expenses-page.message.table-title-total',
    defaultMessage: 'Total TTC',
  },

  Table_Title_Action: {
    id: 'vendor-expenses-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'vendor-expenses-page.message.paid_last_x_days',
    // defaultMessage: 'Paid Last {days, number} Days',
    defaultMessage: 'Paiements au cours des {days, number} dernièrs jours',
  },

  unpaid_last_x_days: {
    id: 'vendor-expenses-page.message.unpaid_last_x_days',
    // defaultMessage: 'Unpaid Last {days, number} Days',
    defaultMessage: 'Paiements effectués',
  },

  x_overdue: {
    id: 'vendor-expenses-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_bills: {
    id: 'vendor-expenses-page.message.x_open_bills',
    // defaultMessage: `Open {bills, plural,
    //   =0 {Bill}
    //   other {Bills}
    // }`,
    defaultMessage: 'En cours'
  },

  bill_status_Paid: {
    id: 'vendor-expenses-page.message.bill-status-paid',
    defaultMessage: `Payé`,
  },

  Edit: {
    id: 'vendor-item-page.edit',
    defaultMessage: 'Modifier',
  },

  Subtitle: {
    id: 'vendor-item-page.subtitle',
    defaultMessage: 'Fournisseurs',
  },

  last_x_days: {
    id: 'vendor-item-toolbar.last-x-days',
    defaultMessage: '{days} dernièrs jours',
  },
  label_batch_actions: {
    id: 'vendor-item-toolbar.label-batch-actions',
    defaultMessage: 'Actions groupées',
  },
  menuitem_Send: {
    id: 'vendor-item-toolbar.batch-action-send',
    defaultMessage: 'E-mail',
  },
  menuitem_Print: {
    id: 'vendor-item-toolbar.batch-action-print',
    defaultMessage: 'Imprimer',
  },

  Table_Title_Action: {
    id: 'vendor-item-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'vendor-item-page.message.paid_last_x_days',
    // defaultMessage: 'Paid Last {days, number} Days',
    defaultMessage: 'Paiements au cours des {days, number} dernièrs jours',
  },

  unpaid_last_x_days: {
    id: 'vendor-item-page.message.unpaid_last_x_days',
    // defaultMessage: 'Unpaid Last {days, number} Days',
    defaultMessage: 'Paiements effectués',
  },

  x_overdue: {
    id: 'vendor-item-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_bills: {
    id: 'vendor-item-page.message.x_open_bills',
    // defaultMessage: `Open {bills, plural,
    //   =0 {Bill}
    //   other {Bills}
    // }`,
    defaultMessage: 'Encaissements en cours'
  },

  bill_status_Paid: {
    id: 'vendor-item-page.message.bill-status-paid',
    defaultMessage: `Payé`,
  },

  noData: {
    id: 'vendor-item-page.message.no-data',
    defaultMessage: 'Rien à afficher.',
  },

  NewTransaction: {
    id: 'vendor-item-page.message.NewTransaction',
    defaultMessage: 'Nouvelle opération',
  },

  NewVendor: {
    id: 'vendor-item-page.message.NewVendor',
    defaultMessage: 'Nouveau fournisseur',
  },

  Table_Title_PAYEE: {
    id: 'vendor-item-page.message.table-title-vendor',
    defaultMessage: 'Bénéficiaire',
  },
  Table_Title_Tel: {
    id: 'vendor-item-page.message.table-title-vendor-tel',
    defaultMessage: 'Téléphone',
  },
  Table_Title_Balance: {
    id: 'vendor-item-page.message.table-title-vendor-bal',
    defaultMessage: 'Solde courant',
  },
  Table_Title_Actions: {
    id: 'vendor-item-page.message.table-title-vendor-actions',
    defaultMessage: 'Actions',
  },

  Vendor: {
    id: 'vendor-item-page.message.Vendor',
    defaultMessage: 'Fournisseur',
  },
  Bill: {
    id: 'vendor-item-page.message.Bill',
    defaultMessage: 'Facture fournisseur',
  },

  Expense: {
    id: 'vendor-item-page.message.Expense',
    defaultMessage: 'Achat comptant',
  },

  Payment: {
    id: 'vendor-item-page.message.Payment',
    defaultMessage: 'Infos sur le paiement des factures',
  },

});

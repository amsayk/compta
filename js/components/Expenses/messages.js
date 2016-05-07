import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Action_makepayment: {
    id: 'expenses-page.action-makepayment',
    defaultMessage: 'Effectuer un paiement',
  },
  Action_send: {
    id: 'expenses-page.action-send',
    defaultMessage: 'E-mail',
  },
  Action_print: {
    id: 'expenses-page.action-print',
    defaultMessage: 'Imprimer',
  },

  clearButton: {
    id: 'expense-filter-form.date.clearButton',
    defaultMessage: 'Sélectionner le date',
  },

  clear_filter: {
    id: 'expenses-toolbar.clear-filter',
    defaultMessage: 'Annuler filtrage/Tout afficher',
  },
  last_x_days: {
    id: 'expenses-toolbar.last-x-days',
    defaultMessage: 'Derniers {days} jours',
  },
  label_batch_actions: {
    id: 'expenses-toolbar.label-batch-actions',
    defaultMessage: 'Actions groupées',
  },
  menuitem_Send: {
    id: 'expenses-toolbar.batch-action-send',
    defaultMessage: 'E-mail',
  },
  menuitem_Print: {
    id: 'expenses-toolbar.batch-action-print',
    defaultMessage: 'Imprimer',
  },

  Totals_All: {
    id: 'expense-form.label-totals-all',
    defaultMessage: 'tous',
  },
  Totals_Selected: {
    id: 'expense-form.label-totals-selected',
    defaultMessage: 'sélectionné',
  },
  Totals_Label: {
    id: 'expense-form.label-totals',
    defaultMessage: 'Totaux',
  },

  label_Type: {
    id: 'expense-filter-form.label.type',
    defaultMessage: 'Type',
  },

  label_Status: {
    id: 'expense-filter-form.label.status',
    defaultMessage: 'État',
  },

  label_Date: {
    id: 'expense-filter-form.label.date',
    defaultMessage: 'Date',
  },

  label_From: {
    id: 'expense-filter-form.label.from',
    defaultMessage: 'De',
  },

  label_To: {
    id: 'expense-filter-form.label.to',
    defaultMessage: 'À',
  },

  save: {
    id: 'expense-filter-form.action.save',
    defaultMessage: 'Enregistrer',
  },

  Reset: {
    id: 'expense-filter-form.action.reset',
    defaultMessage: 'Annuler',
  },

  Confirm: {
    id: 'expenses-page.confirm',
    defaultMessage: 'Voulez-vous quitter sans enregistrer les modifications ??',
  },

  label_Payee: {
    id: 'expense-filter-form.label.customer',
    defaultMessage: 'Bénéficiaire',
  },

  Dates_Last_x_days: {
    id: 'expenses-filter-form.date-last-x-days',
    defaultMessage: 'Derniers {days} jours',
  },

  Dates_Last_x_days: {
    id: 'expenses-filter-form.date-last-x-days',
    defaultMessage: 'Derniers {days} jours',
  },
  Dates_Today: {
    id: 'expenses-filter-form.date-today',
    defaultMessage: 'Aujourd\'hui',
  },
  Dates_Yesterday: {
    id: 'expenses-filter-form.date-yesterday',
    defaultMessage: 'Hier',
  },
  Dates_This_week: {
    id: 'expenses-filter-form.date-this-week',
    defaultMessage: 'Cette semaine',
  },
  Dates_This_month: {
    id: 'expenses-filter-form.date-this-month',
    defaultMessage: 'Mois en cours',
  },
  Dates_This_quarter: {
    id: 'expenses-filter-form.date-this-quarter',
    defaultMessage: 'Le trimestre en cours',
  },
  Dates_This_year: {
    id: 'expenses-filter-form.date-this-year',
    defaultMessage: 'L\'année en cours',
  },
  Dates_Last_week: {
    id: 'expenses-filter-form.date-last-week',
    defaultMessage: 'La semaine derniere',
  },
  Dates_Last_month: {
    id: 'expenses-filter-form.date-last-month',
    defaultMessage: 'Le mois dernier',
  },
  Dates_Last_quarter: {
    id: 'expenses-filter-form.date-last-quarter',
    defaultMessage: 'Le trimestre dernier',
  },
  Dates_Last_year: {
    id: 'expenses-filter-form.date-last-year',
    defaultMessage: 'L\'année derniere',
  },
  Dates_Custom: {
    id: 'expenses-filter-form.date-custom',
    defaultMessage: 'Personnalizer',
  },
  Dates_All_dates: {
    id: 'expenses-filter-form.date-all-dates',
    defaultMessage: 'Toutes les dates',
  },

  Payees_All: {
    id: 'expense-filter-form.customer-any',
    defaultMessage: 'Tous',
  },
  Status_All: {
    id: 'expense-filter-form.statuses-all',
    defaultMessage: 'Toutes les états',
  },
  Status_Open: {
    id: 'expense-filter-form.statuses-open',
    defaultMessage: 'En cours',
  },
  Status_Overdue: {
    id: 'expense-filter-form.statuses-overdue',
    defaultMessage: 'En retard',
  },
  Status_Paid: {
    id: 'expense-filter-form.statuses-paid',
    defaultMessage: 'Payé',
  },
  Status_Pending: {
    id: 'expense-filter-form.statuses-pending',
    defaultMessage: 'Pending',
  },
  Status_Accepted: {
    id: 'expense-filter-form.statuses-accepted',
    defaultMessage: 'Accepted',
  },
  Status_Closed: {
    id: 'expense-filter-form.statuses-closed',
    defaultMessage: 'Fermé',
  },
  Status_Rejected: {
    id: 'expense-filter-form.statuses-rejected',
    defaultMessage: 'Rejected',
  },
  Status_Expired: {
    id: 'expense-filter-form.statuses-expire',
    defaultMessage: 'Expired',
  },

  Type_Bills: {
    id: 'expense-filter-form.types-bills',
    defaultMessage: 'Facture fournisseur',
  },
  Type_All: {
    id: 'expense-filter-form.types-all',
    defaultMessage: 'Toutes les opérations',
  },
  Type_Payments: {
    id: 'expense-filter-form.types-payments',
    defaultMessage: 'Paiements de factures',
  },

  Type_Expenses: {
    id: 'expense-filter-form.types-expenses',
    defaultMessage: 'Achat comptant',
  },

  Type_Recent: {
    id: 'expense-filter-form.types-recent',
    defaultMessage: 'Payé(es) récemment(s)',
  },

  Type_Money_Received: {
    id: 'expense-filter-form.types-money-received',
    defaultMessage: 'Argent reçu',
  },

  Subtitle: {
    id: 'expenses-page.subtitle',
    defaultMessage: 'Dépenses',
  },

  noData: {
    id: 'expenses-page.message.no-data',
    defaultMessage: 'Rien à afficher.',
  },

  ExpenseTitle: {
    id: 'expenses-page.expense-title',
    defaultMessage: 'Achat comptant',
  },
  BillTitle: {
    id: 'expenses-page.bill-title',
    defaultMessage: 'Facture fournisseur',
  },

  BillType: {
    id: 'expenses-page.message.bill-type',
    defaultMessage: 'Facture fournisseur',
  },

  ExpenseType: {
    id: 'expenses-page.message.expense-type',
    defaultMessage: 'Dépense',
  },

  PaymentType: {
    id: 'expenses-page.message.payment-type',
    defaultMessage: 'Infos sur le paiement des factures',
  },

  StatusOpen: {
    id: 'expenses-page.message.status-open',
    defaultMessage: 'En cours',
  },

  StatusClosed: {
    id: 'expenses-page.message.status-closed',
    defaultMessage: 'Fermé',
  },

  StatusPaid: {
    id: 'expenses-page.message.status-paid',
    defaultMessage: 'Payé',
  },

  StatusPartial: {
    id: 'expenses-page.message.status-partial',
    defaultMessage: 'Partiel',
  },

  StatusExpired: {
    id: 'expenses-page.message.status-expired',
    defaultMessage: 'Expired',
  },

  NewTransaction: {
    id: 'expenses-page.message.NewTransaction',
    defaultMessage: 'Nouvelle opération',
  },

  Bill: {
    id: 'expenses-page.message.Bill',
    defaultMessage: 'Facture fournisseur',
  },

  Payment: {
    id: 'expenses-page.message.Payment',
    defaultMessage: 'Paiement',
  },

  BillType: {
    id: 'expenses-page.message.bill-type',
    defaultMessage: 'Facture fournisseur',
  },

  PaymentType: {
    id: 'expenses-page.message.payment-type',
    defaultMessage: 'Infos sur le paiement des factures',
  },

  BillStatusOpen: {
    id: 'expenses-page.message.bill-status-open',
    defaultMessage: 'En cours',
  },

  BillStatusClosed: {
    id: 'expenses-page.message.bill-status-closed',
    defaultMessage: 'Payé',
  },

  BillStatusOverdue: {
    id: 'expenses-page.message.bill-status-overdue',
    defaultMessage: 'En retard',
  },

  BillStatusPaid: {
    id: 'expenses-page.bill-status-paid',
    defaultMessage: 'Payé',
  },

  BillStatusPartial: {
    id: 'expenses-page.message.bill-status-partial',
    defaultMessage: 'Partiel',
  },

  BillStatusExpired: {
    id: 'expenses-page.message.bill-status-expired',
    defaultMessage: 'Expired',
  },

  SaleStatusClosed: {
    id: 'expenses-page.message.expense-status-closed',
    defaultMessage: 'Payé',
  },

  PaymentStatusOpen: {
    id: 'expenses-page.message.payment-status-open',
    defaultMessage: 'En cours',
  },

  PaymentStatusClosed: {
    id: 'expenses-page.message.payment-status-closed',
    defaultMessage: 'Fermé',
  },

  PaymentStatusOverdue: {
    id: 'expenses-page.message.payment-status-overdue',
    defaultMessage: 'En retard',
  },

  PaymentStatusPaid: {
    id: 'expenses-page.message.payment-status-paid',
    defaultMessage: 'Payé',
  },

  PaymentStatusPartial: {
    id: 'expenses-page.message.payment-status-partial',
    defaultMessage: 'Partiel',
  },

  PaymentStatusExpired: {
    id: 'expenses-page.message.payment-status-expired',
    defaultMessage: 'Expired',
  },

  Table_Title_Category: {
    id: 'expenses-page.message.table-title-category',
    defaultMessage: 'Catégorie',
  },
  Table_Title_Date: {
    id: 'expenses-page.message.table-title-date',
    defaultMessage: 'Date',
  },

  Table_Title_Type: {
    id: 'expenses-page.message.table-title-type',
    defaultMessage: 'Type',
  },

  Table_Title_REF_NO: {
    id: 'expenses-page.message.table-title-ref-no',
    defaultMessage: 'Nº',
  },

  Table_Title_PAYEE: {
    id: 'expenses-page.message.table-title-customer',
    defaultMessage: 'Bénéficiaire',
  },

  Table_Title_DueDate: {
    id: 'expenses-page.message.table-title-due-date',
    defaultMessage: 'Échéance',
  },

  Table_Title_Balance: {
    id: 'expenses-page.message.table-title-balance',
    defaultMessage: 'Solde',
  },

  Table_Title_Status: {
    id: 'expenses-page.message.table-title-status',
    defaultMessage: 'État',
  },

  Table_Title_Lastest_Payment: {
    id: 'expenses-page.message.table-title-lastest-payment',
    // defaultMessage: 'Latest payment',
    defaultMessage: 'Dernier paiement',
  },

  Table_Title_Age: {
    id: 'expenses-page.message.table-title-age',
    defaultMessage: 'Balance âgée',
  },

  Table_Title_Total: {
    id: 'expenses-page.message.table-title-total',
    defaultMessage: 'Total TTC',
  },

  Table_Title_Action: {
    id: 'expenses-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'expenses-page.message.paid_last_x_days',
    // defaultMessage: 'Paid Last {days, number} Days',
    defaultMessage: 'Paiements au cours des {days, number} derniers jours',
  },

  unpaid_last_x_days: {
    id: 'expenses-page.message.unpaid_last_x_days',
    // defaultMessage: 'Unpaid Last {days, number} Days',
    defaultMessage: 'Paiements au cours des {days, number} derniers jours',
  },

  x_overdue: {
    id: 'expenses-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_bills: {
    id: 'expenses-page.message.x_open_bills',
    // defaultMessage: `Open {bills, plural,
    //   =0 {Bill}
    //   other {Bills}
    // }`,
    defaultMessage: 'En cours'
  },

  bill_status_Paid: {
    id: 'expenses-page.message.bill-status-paid',
    // defaultMessage: `Paid`,
    defaultMessage: 'En cours',
  },

});

import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Table_Title_VAT: {
    id: 'customer-sales-page.message.table-title-vat',
    defaultMessage: 'TVA',
  },

  Table_Title_Total_HT: {
    id: 'customer-sales-page.message.table-title-total-ht',
    defaultMessage: 'Total HT',
  },

  Action_receivepayment: {
    id: 'customer-sales-page.action-receivepayment',
    defaultMessage: 'Recevoir un paiement',
  },
  Action_send: {
    id: 'customer-sales-page.action-send',
    defaultMessage: 'E-mail',
  },
  Action_print: {
    id: 'customer-sales-page.action-print',
    defaultMessage: 'Imprimer',
  },

  Open_Invoices: {
    id: 'customer-item-page.label-totals-open-invoices',
    defaultMessage: `{count, plural, =0 {Aucun encaissements en cours} =1 {1 encaissement en cours} other {{count} encaissements en cours}}`,
  },

  Totals_All: {
    id: 'customer-sales-form.label-totals-all',
    defaultMessage: 'tous',
  },
  Totals_Selected: {
    id: 'customer-sales-form.label-totals-selected',
    defaultMessage: 'sélectionné',
  },
  Totals_Label: {
    id: 'customer-sales-form.label-totals',
    defaultMessage: 'Totaux',
  },

  reset_all_lines: {
    id: 'customer-sales-form.reset_all_lines',
    defaultMessage: 'Supprimer tous',
  },

  Dates_Last_x_days: {
    id: 'customer-sales-filter-form.date-last-x-days',
    defaultMessage: '{days} dernièrs jours',
  },
  Dates_Today: {
    id: 'customer-sales-filter-form.date-today',
    defaultMessage: 'Aujourd\'hui',
  },
  Dates_Yesterday: {
    id: 'customer-sales-filter-form.date-yesterday',
    defaultMessage: 'Hier',
  },
  Dates_This_week: {
    id: 'customer-sales-filter-form.date-this-week',
    defaultMessage: 'Cette semaine',
  },
  Dates_This_month: {
    id: 'customer-sales-filter-form.date-this-month',
    defaultMessage: 'Mois en cours',
  },
  Dates_This_quarter: {
    id: 'customer-sales-filter-form.date-this-quarter',
    defaultMessage: 'Le trimestre en cours',
  },
  Dates_This_year: {
    id: 'customer-sales-filter-form.date-this-year',
    defaultMessage: 'L\'année en cours',
  },
  Dates_Last_week: {
    id: 'customer-sales-filter-form.date-last-week',
    defaultMessage: 'La semaine dernière',
  },
  Dates_Last_month: {
    id: 'customer-sales-filter-form.date-last-month',
    defaultMessage: 'Le mois dernièr',
  },
  Dates_Last_quarter: {
    id: 'customer-sales-filter-form.date-last-quarter',
    defaultMessage: 'Le trimestre dernière',
  },
  Dates_Last_year: {
    id: 'customer-sales-filter-form.date-last-year',
    defaultMessage: 'L\'année dernière',
  },
  Dates_Custom: {
    id: 'customer-sales-filter-form.date-custom',
    defaultMessage: 'Personnalizer',
  },
  Dates_All_dates: {
    id: 'customer-sales-filter-form.date-all-dates',
    defaultMessage: 'Toutes les dates',
  },

  clear_filter: {
    id: 'customer-sales-toolbar.clear-filter',
    defaultMessage: 'Annuler filtrage/Tout afficher',
  },
  last_x_days: {
    id: 'customer-sales-toolbar.last-x-days',
    defaultMessage: '{days} dernièrs jours',
  },
  label_batch_actions: {
    id: 'customer-sales-toolbar.label-batch-actions',
    defaultMessage: 'Actions groupées',
  },
  menuitem_Send: {
    id: 'customer-sales-toolbar.batch-action-send',
    defaultMessage: 'E-mail',
  },
  menuitem_Print: {
    id: 'customer-sales-toolbar.batch-action-print',
    defaultMessage: 'import',
  },

  Customers_All: {
    id: 'customer-sales-filter-form.customer-any',
    defaultMessage: 'Tous',
  },
  Status_All: {
    id: 'customer-sales-filter-form.statuses-all',
    defaultMessage: 'Toutes les états',
  },
  Status_Open: {
    id: 'customer-sales-filter-form.statuses-open',
    defaultMessage: 'En cours',
  },
  Status_Overdue: {
    id: 'customer-sales-filter-form.statuses-overdue',
    defaultMessage: 'En retard',
  },
  Status_Paid: {
    id: 'customer-sales-filter-form.statuses-paid',
    defaultMessage: 'Payé',
  },
  Status_Pending: {
    id: 'customer-sales-filter-form.statuses-pending',
    defaultMessage: 'Pending',
  },
  Status_Accepted: {
    id: 'customer-sales-filter-form.statuses-accepted',
    defaultMessage: 'Accepted',
  },
  Status_Closed: {
    id: 'customer-sales-filter-form.statuses-closed',
    defaultMessage: 'Fermé',
  },
  Status_Rejected: {
    id: 'customer-sales-filter-form.statuses-rejected',
    defaultMessage: 'Rejected',
  },
  Status_Expired: {
    id: 'customer-sales-filter-form.statuses-expire',
    defaultMessage: 'Expired',
  },

  Type_Invoices: {
    id: 'customer-sales-filter-form.types-invoices',
    defaultMessage: 'Factures',
  },
  Type_Open_Invoices: {
    id: 'customer-sales-filter-form.types-open-invoices',
    defaultMessage: 'Factures en cours',
  },
  Type_Overdue_Invoices: {
    id: 'customer-sales-filter-form.types-overdue-invoices',
    defaultMessage: 'Factures en retard',
  },
  Type_All: {
    id: 'customer-sales-filter-form.types-all',
    defaultMessage: 'Toutes les opérations',
  },
  Type_Payments: {
    id: 'customer-sales-filter-form.types-payments',
    defaultMessage: 'Paiements',
  },

  Type_Sales: {
    id: 'customer-sales-filter-form.types-sales',
    defaultMessage: 'Ventes',
  },

  Type_Recent: {
    id: 'customer-sales-filter-form.types-recent',
    defaultMessage: 'Payé(es) récemment',
  },

  Type_Money_Received: {
    id: 'customer-sales-filter-form.types-money-received',
    defaultMessage: 'Argent reçu',
  },

  clearButton: {
    id: 'customer-sales-filter-form.date.clearButton',
    defaultMessage: 'Sélectionner la date',
  },

  label_Type: {
    id: 'customer-sales-filter-form.label.type',
    defaultMessage: 'Type',
  },

  label_Status: {
    id: 'customer-sales-filter-form.label.status',
    defaultMessage: 'État',
  },

  label_Date: {
    id: 'customer-sales-filter-form.label.date',
    defaultMessage: 'Date',
  },

  label_From: {
    id: 'customer-sales-filter-form.label.from',
    defaultMessage: 'De',
  },

  label_To: {
    id: 'customer-sales-filter-form.label.to',
    defaultMessage: 'À',
  },

  label_Customer: {
    id: 'customer-sales-filter-form.label.customer',
    defaultMessage: 'Clients',
  },

  save: {
    id: 'customer-sales-filter-form.action.save',
    defaultMessage: 'Enregistrer',
  },

  Reset: {
    id: 'customer-sales-filter-form.action.reset',
    defaultMessage: 'Annuler',
  },

  Confirm: {
    id: 'customer-sales-page.confirm',
    defaultMessage: 'Voulez-vous quitter sans enregistrer les modifications ??',
  },

  Subtitle: {
    id: 'customer-sales-page.subtitle',
    defaultMessage: 'Ventes',
  },

  noData: {
    id: 'customer-sales-page.message.no-data',
    defaultMessage: 'Rien à afficher.',
  },

  NewTransaction: {
    id: 'customer-sales-page.message.NewTransaction',
    defaultMessage: 'Nouvelle opération',
  },

  Invoice: {
    id: 'customer-sales-page.message.Invoice',
    defaultMessage: 'Facture',
  },

  Sale: {
    id: 'customer-sales-page.message.Sale',
    defaultMessage: 'Reçu de vente',
  },

  Payment: {
    id: 'customer-sales-page.message.Payment',
    defaultMessage: 'Paiement',
  },

  InvoiceType: {
    id: 'customer-sales-page.message.invoice-type',
    defaultMessage: 'Facture',
  },

  SaleType: {
    id: 'customer-sales-page.message.customer-sales-type',
    defaultMessage: 'Reçu de vente',
  },

  PaymentType: {
    id: 'customer-sales-page.message.payment-type',
    defaultMessage: 'Paiement',
  },

  InvoiceStatusOpen: {
    id: 'customer-sales-page.message.invoice-status-open',
    defaultMessage: 'En cours',
  },

  InvoiceStatusClosed: {
    id: 'customer-sales-page.message.invoice-status-closed',
    defaultMessage: 'Payé',
  },

  InvoiceStatusOverdue: {
    id: 'customer-sales-page.message.invoice-status-overdue',
    defaultMessage: 'En retard',
  },

  InvoiceStatusPaid: {
    id: 'customer-sales-page.message.invoice-status-paid',
    defaultMessage: 'Payé',
  },

  InvoiceStatusPartial: {
    id: 'customer-sales-page.message.invoice-status-partial',
    defaultMessage: 'Partiel',
  },

  InvoiceStatusExpired: {
    id: 'customer-sales-page.message.invoice-status-expired',
    defaultMessage: 'Expired',
  },

  SaleStatusClosed: {
    id: 'customer-sales-page.message.customer-sales-status-closed',
    defaultMessage: 'Payé',
  },

  PaymentStatusOpen: {
    id: 'customer-sales-page.message.payment-status-open',
    defaultMessage: 'En cours',
  },

  PaymentStatusClosed: {
    id: 'customer-sales-page.message.payment-status-closed',
    defaultMessage: 'Closed',
  },

  PaymentStatusOverdue: {
    id: 'customer-sales-page.message.payment-status-overdue',
    defaultMessage: 'En retard',
  },

  PaymentStatusPaid: {
    id: 'customer-sales-page.message.payment-status-paid',
    defaultMessage: 'Payé',
  },

  PaymentStatusPartial: {
    id: 'customer-sales-page.message.payment-status-partial',
    defaultMessage: 'Partiel',
  },

  PaymentStatusExpired: {
    id: 'customer-sales-page.message.payment-status-expired',
    defaultMessage: 'Expired',
  },

  Table_Title_Date: {
    id: 'customer-sales-page.message.table-title-date',
    defaultMessage: 'Date',
  },

  Table_Title_Type: {
    id: 'customer-sales-page.message.table-title-type',
    defaultMessage: 'Type',
  },

  Table_Title_REF_NO: {
    id: 'customer-sales-page.message.table-title-ref-no',
    defaultMessage: 'Nº',
  },

  Table_Title_CUSTOMER_1: {
    id: 'customer-sales-page.message.table-title-customer-1',
    defaultMessage: 'Client',
  },

  Table_Title_DueDate: {
    id: 'customer-sales-page.message.table-title-due-date',
    defaultMessage: 'ÉCHÉANCE ',
  },

  Table_Title_Balance: {
    id: 'customer-sales-page.message.table-title-balance',
    defaultMessage: 'Solde',
  },

  Table_Title_Status: {
    id: 'customer-sales-page.message.table-title-status',
    defaultMessage: 'État',
  },

  Table_Title_Lastest_Payment: {
    id: 'customer-sales-page.message.table-title-lastest-payment',
    defaultMessage: 'Dernier paiement',
  },

  Table_Title_Age: {
    id: 'customer-sales-page.message.table-title-age',
    defaultMessage: 'Balance âgée',
  },

  Table_Title_Total: {
    id: 'customer-sales-page.message.table-title-total',
    defaultMessage: 'Total TTC',
  },

  Table_Title_Action: {
    id: 'customer-sales-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'customer-sales-page.message.paid_last_x_days',
    // defaultMessage: 'Paid Last {days, number} Days',
    defaultMessage: 'Paiements au cours des {days, number} dernièrs jours',
  },

  unpaid_last_x_days: {
    id: 'customer-sales-page.message.unpaid_last_x_days',
    defaultMessage: 'Paiements effectués',
  },

  x_overdue: {
    id: 'customer-sales-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_invoices: {
    id: 'customer-sales-page.message.x_open_invoices',
    // defaultMessage: `Open {invoices, plural,
    //   =0 {Invoices}
    //   =1 {Invoice}
    //   other {Invoices}
    // }`,
    defaultMessage: 'Encaissements en cours',
  },

  invoice_status_Paid: {
    id: 'customer-sales-page.message.invoice-status-paid',
    defaultMessage: `Payé`,
  },

  Edit: {
    id: 'customer-item-page.edit',
    defaultMessage: 'Modifier',
  },

  Subtitle: {
    id: 'customer-item-page.subtitle',
    defaultMessage: 'Clients',
  },

  last_x_days: {
    id: 'customer-item-toolbar.last-x-days',
    defaultMessage: '{days} dernièrs jours',
  },
  label_batch_actions: {
    id: 'customer-item-toolbar.label-batch-actions',
    defaultMessage: 'Actions groupées',
  },
  menuitem_Send: {
    id: 'customer-item-toolbar.batch-action-send',
    defaultMessage: 'E-mail',
  },
  menuitem_Print: {
    id: 'customer-item-toolbar.batch-action-print',
    defaultMessage: 'Imprimer',
  },

  Table_Title_Action: {
    id: 'customer-item-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'customer-item-page.message.paid_last_x_days',
    // defaultMessage: 'Paid Last {days, number} Days',
    defaultMessage: 'Paiements au cours des {days, number} dernièrs jours',
  },

  unpaid_last_x_days: {
    id: 'customer-item-page.message.unpaid_last_x_days',
    // defaultMessage: 'Unpaid Last {days, number} Days',
    defaultMessage: 'Paiements effectués',
  },

  x_overdue: {
    id: 'customer-item-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_invoices: {
    id: 'customer-item-page.message.x_open_invoices',
    // defaultMessage: `Open {invoices, plural,
    //   =0 {Invoices}
    //   =1 {Invoice}
    //   other {Invoices}
    // }`,
    defaultMessage: 'Encaissements en cours',
  },

  invoice_status_Paid: {
    id: 'customer-item-page.message.invoice-status-paid',
    defaultMessage: `Payé`,
  },

  noData: {
    id: 'customer-item-page.message.no-data',
    defaultMessage: 'Rien à afficher.',
  },

  NewTransaction: {
    id: 'customer-item-page.message.NewTransaction',
    defaultMessage: 'Nouvelle opération',
  },

  NewCustomer: {
    id: 'customer-item-page.message.NewCustomer',
    defaultMessage: 'Nouvelle client',
  },

  Table_Title_CUSTOMER: {
    id: 'customer-item-page.message.table-title-customer',
    defaultMessage: 'Client / Entreprise',
  },
  Table_Title_Tel: {
    id: 'customer-item-page.message.table-title-customer-tel',
    defaultMessage: 'Téléphone',
  },
  Table_Title_Balance: {
    id: 'customer-item-page.message.table-title-customer-bal',
    defaultMessage: 'Solde',
  },
  Table_Title_Actions: {
    id: 'customer-item-page.message.table-title-customer-actions',
    defaultMessage: 'Actions',
  },

  Customer: {
    id: 'customer-item-page.message.Customer',
    defaultMessage: 'Client',
  },
  Invoice: {
    id: 'customer-item-page.message.Invoice',
    defaultMessage: 'Facture',
  },

  Sale: {
    id: 'customer-item-page.message.Sale',
    defaultMessage: 'Reçu de vente',
  },

  Payment: {
    id: 'customer-item-page.message.Payment',
    defaultMessage: 'Paiement',
  },

});

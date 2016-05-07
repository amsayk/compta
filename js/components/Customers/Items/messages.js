import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Open_Invoices: {
    id: 'customers-items-page.label-totals-open-invoices',
    // defaultMessage: `{count, plural, =0 {No open invoices} =1 {1 open invoice} other {{count} open invoices}}`,
    defaultMessage: `{count, plural, =0 {Aucun encaissements en cours} =1 {1 encaissement en cours} other {{count} encaissements en cours}}`,
  },

  Table_Title_Open_Invoices: {
    id: 'customers-items-page.title-open-invoices',
    defaultMessage: 'FACTURES EN ATTENTE',
  },

  Action_receivepayment: {
    id: 'customers-items-page.action-receivepayment',
    defaultMessage: 'Effectuer un paiement',
  },
  Action_send: {
    id: 'customers-items-page.action-send',
    defaultMessage: 'E-mail',
  },
  Action_print: {
    id: 'customers-items-page.action-print',
    defaultMessage: 'Imprimer',
  },
  Action_invoice: {
    id: 'customers-items-page.action-invoice',
    defaultMessage: 'Nouvelle facture',
  },
  Action_sale: {
    id: 'customers-items-page.action-sale',
    defaultMessage: 'Nouveau reçu de vente',
  },
  Action_payment: {
    id: 'customers-items-page.action-payment',
    defaultMessage: 'Recevoir un paiement',
  },

  Subtitle: {
    id: 'customers-items-page.subtitle',
    defaultMessage: 'Clients',
  },

  last_x_days: {
    id: 'customers-items-toolbar.last-x-days',
    defaultMessage: '{days} derniers jours',
  },
  label_batch_actions: {
    id: 'customers-items-toolbar.label-batch-actions',
    defaultMessage: 'Actions groupées',
  },
  menuitem_Send: {
    id: 'customers-items-toolbar.batch-action-send',
    defaultMessage: 'E-mail',
  },
  menuitem_Print: {
    id: 'customers-items-toolbar.batch-action-print',
    defaultMessage: 'Imprimer',
  },

  Table_Title_Action: {
    id: 'customers-items-page.message.table-title-action',
    defaultMessage: 'Action',
  },

  paid_last_x_days: {
    id: 'customers-items-page.message.paid_last_x_days',
    defaultMessage: 'Paiements au cours des {days, number} derniers jours',
  },

  unpaid_last_x_days: {
    id: 'customers-items-page.message.unpaid_last_x_days',
    // defaultMessage: 'Paiements effectueés',
    defaultMessage: 'Paiements au cours des {days, number} derniers jours',
  },

  x_overdue: {
    id: 'customers-items-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_invoices: {
    id: 'customers-items-page.message.x_open_invoices',
    // defaultMessage: `Open {invoices, plural,
    //   =0 {Invoices}
    //   =1 {Invoice}
    //   other {Invoices}
    // }`,
    defaultMessage: 'Encaissements en cours'
  },

  invoice_status_Paid: {
    id: 'customers-items-page.message.invoice-status-paid',
    defaultMessage: `Paiements effectueés`,
  },

  noData: {
    id: 'customers-items-page.message.no-data',
    defaultMessage: 'Rien à afficher.',
  },

  NewTransaction: {
    id: 'customers-items-page.message.NewTransaction',
    defaultMessage: 'Nouvelle opération',
  },

  NewCustomer: {
    id: 'customers-items-page.message.NewCustomer',
    defaultMessage: 'Nouveau client',
  },

  Table_Title_CUSTOMER: {
    id: 'customers-items-page.message.table-title-customer',
    defaultMessage: 'Client / Entreprise',
  },
  Table_Title_Tel: {
    id: 'customers-items-page.message.table-title-customer-tel',
    defaultMessage: 'Téléphone',
  },
  Table_Title_Balance: {
    id: 'customers-items-page.message.table-title-customer-bal',
    defaultMessage: 'Solde courant',
  },
  Table_Title_Actions: {
    id: 'customers-items-page.message.table-title-customer-actions',
    defaultMessage: 'Actions',
  },

  Customer: {
    id: 'customers-items-page.message.Customer',
    defaultMessage: 'Client',
  },
  Invoice: {
    id: 'customers-items-page.message.Invoice',
    defaultMessage: 'Facture',
  },

  Sale: {
    id: 'customers-items-page.message.Sale',
    defaultMessage: 'Reçu de vente',
  },

  Payment: {
    id: 'customers-items-page.message.Payment',
    defaultMessage: 'Paiement',
  },

});

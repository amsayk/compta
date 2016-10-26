import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Open_Invoices: {
    id: 'employees-items-page.label-totals-open-invoices',
    // defaultMessage: `{count, plural, =0 {No open invoices} =1 {1 open invoice} other {{count} open invoices}}`,
    defaultMessage: `{count, plural, =0 {Aucun encaissements en cours} =1 {1 encaissement en cours} other {{count} encaissements en cours}}`,
  },

  Table_Title_Open_Invoices: {
    id: 'employees-items-page.title-open-invoices',
    defaultMessage: 'FACTURES EN ATTENTE',
  },

  Action_employee: {
    id: 'employees-items-page.action-employee',
    defaultMessage: 'Modifier',
  },

  Action_receivepayment: {
    id: 'employees-items-page.action-receivepayment',
    defaultMessage: 'Effectuer un paiement',
  },
  Action_send: {
    id: 'employees-items-page.action-send',
    defaultMessage: 'E-mail',
  },
  Action_print: {
    id: 'employees-items-page.action-print',
    defaultMessage: 'Imprimer',
  },
  Action_invoice: {
    id: 'employees-items-page.action-invoice',
    defaultMessage: 'Nouvelle facture',
  },
  Action_sale: {
    id: 'employees-items-page.action-sale',
    defaultMessage: 'Nouveau reçu de vente',
  },
  Action_payment: {
    id: 'employees-items-page.action-payment',
    defaultMessage: 'Recevoir un paiement',
  },

  Subtitle: {
    id: 'employees-items-page.subtitle',
    defaultMessage: 'Employés',
  },

  last_x_days: {
    id: 'employees-items-toolbar.last-x-days',
    defaultMessage: '{days} derniers jours',
  },
  label_batch_actions: {
    id: 'employees-items-toolbar.label-batch-actions',
    defaultMessage: 'Actions groupées',
  },
  menuitem_Send: {
    id: 'employees-items-toolbar.batch-action-send',
    defaultMessage: 'E-mail',
  },
  menuitem_Print: {
    id: 'employees-items-toolbar.batch-action-print',
    defaultMessage: 'Imprimer',
  },

  Table_Title_Action: {
    id: 'employees-items-page.message.table-title-action',
    defaultMessage: 'Action',
  },
  Table_Title_Email: {
    id: 'employees-items-page.message.table-title-email',
    defaultMessage: 'E-mail',
  },

  paid_last_x_days: {
    id: 'employees-items-page.message.paid_last_x_days',
    defaultMessage: 'Paiements au cours des {days, number} derniers jours',
  },

  unpaid_last_x_days: {
    id: 'employees-items-page.message.unpaid_last_x_days',
    // defaultMessage: 'Paiements effectueés',
    defaultMessage: 'Paiements au cours des {days, number} derniers jours',
  },

  x_overdue: {
    id: 'employees-items-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_invoices: {
    id: 'employees-items-page.message.x_open_invoices',
    // defaultMessage: `Open {invoices, plural,
    //   =0 {Invoices}
    //   =1 {Invoice}
    //   other {Invoices}
    // }`,
    defaultMessage: 'Encaissements en cours'
  },

  invoice_status_Paid: {
    id: 'employees-items-page.message.invoice-status-paid',
    defaultMessage: `Paiements effectueés`,
  },

  noData: {
    id: 'employees-items-page.message.no-data',
    defaultMessage: 'Rien à afficher.',
  },

  NewTransaction: {
    id: 'employees-items-page.message.NewTransaction',
    defaultMessage: 'Nouvelle opération',
  },

  NewEmployee: {
    id: 'employees-items-page.message.NewEmployee',
    defaultMessage: 'Nouvel employé',
  },

  Table_Title_CUSTOMER: {
    id: 'employees-items-page.message.table-title-employee',
    defaultMessage: 'Nom',
  },
  Table_Title_Tel: {
    id: 'employees-items-page.message.table-title-employee-tel',
    defaultMessage: 'Téléphone',
  },
  Table_Title_Balance: {
    id: 'employees-items-page.message.table-title-employee-bal',
    defaultMessage: 'Solde courant',
  },
  Table_Title_Actions: {
    id: 'employees-items-page.message.table-title-employee-actions',
    defaultMessage: 'Actions',
  },

  Employee: {
    id: 'employees-items-page.message.Employee',
    defaultMessage: 'Client',
  },
  Invoice: {
    id: 'employees-items-page.message.Invoice',
    defaultMessage: 'Facture',
  },

  Sale: {
    id: 'employees-items-page.message.Sale',
    defaultMessage: 'Reçu de vente',
  },

  Payment: {
    id: 'employees-items-page.message.Payment',
    defaultMessage: 'Paiement',
  },

});

import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Action_active: {
    id: 'vendors-items-page.action-active',
    defaultMessage: 'Rendre actif',
  },
  Action_inactive: {
    id: 'vendors-items-page.action-inactive',
    defaultMessage: 'Rendre inactif',
  },

  ConfirmDeactivate: {
    id: 'vendors-items-page.message.confirm-deactive',
    defaultMessage: 'Etes-vous sûr de vouloir rendre {displayName} inactif?'
  },
  ConfirmActivate: {
    id: 'vendors-items-page.message.confirm-active',
    defaultMessage: 'Etes-vous sûr de vouloir rendre {displayName} actif?'
  },

  Open_Bills: {
    id: 'vendors-items-page.label-totals-open-bills',
    // defaultMessage: `{count, plural, =0 {No open bills} =1 {1 open bill} other {{count} open bills}}`,
    defaultMessage: `{count, plural, =0 {Aucunes factures en cours} =1 {1 facture en cours} other {{count} facture en cours}}`,
  },
  Overdue_Bills: {
    id: 'vendors-items-page.label-totals-overdue-bills',
    // defaultMessage: `{count, plural, =0 {No open bills} =1 {1 open bill} other {{count} open bills}}`,
    defaultMessage: `{count, plural, =0 {Aucunes factures en retard} =1 {1 facture en retard} other {{count} factures en retard}}`,
  },

  Table_Title_Open_Bills: {
    id: 'vendors-items-page.title-open-bills',
    defaultMessage: 'FACTURES EN ATTENTE',
  },

  Action_makepayment: {
    id: 'vendors-items-page.action-makepayment',
    defaultMessage: 'Effectuer un paiement',
  },
  Action_send: {
    id: 'vendors-items-page.action-send',
    defaultMessage: 'E-mail',
  },
  Action_print: {
    id: 'vendors-items-page.action-print',
    defaultMessage: 'Imprimer',
  },
  Action_bill: {
    id: 'vendors-items-page.action-bill',
    defaultMessage: 'Nouvelle facture fournisseur',
  },
  Action_expense: {
    id: 'vendors-items-page.action-expense',
    defaultMessage: 'Nouveau achat comptant',
  },
  Action_payment: {
    id: 'vendors-items-page.action-payment',
    defaultMessage: 'Recevoir un paiement',
  },

  Subtitle: {
    id: 'vendors-items-page.subtitle',
    defaultMessage: 'Fournisseurs',
  },

  last_x_days: {
    id: 'vendors-items-toolbar.last-x-days',
    defaultMessage: '{days} derniers jours',
  },
  label_batch_actions: {
    id: 'vendors-items-toolbar.label-batch-actions',
    defaultMessage: 'Actions groupées',
  },
  menuitem_Send: {
    id: 'vendors-items-toolbar.batch-action-send',
    defaultMessage: 'E-mail',
  },
  menuitem_Print: {
    id: 'vendors-items-toolbar.batch-action-print',
    defaultMessage: 'Imprimer',
  },

  Table_Title_Action: {
    id: 'vendors-items-page.message.table-title-action',
    defaultMessage: 'Action',
  },
  Table_Title_Email: {
    id: 'vendors-items-page.message.table-title-email',
    defaultMessage: 'E-mail',
  },

  paid_last_x_days: {
    id: 'vendors-items-page.message.paid_last_x_days',
    // defaultMessage: 'Paid Last {days, number} Days',
    // defaultMessage: 'Paiements effectués',
    defaultMessage: 'Paiements au cours des {days, number} derniers jours',
  },

  unpaid_last_x_days: {
    id: 'vendors-items-page.message.unpaid_last_x_days',
    // defaultMessage: 'Unpaid Last {days, number} Days',
    defaultMessage: 'Paiements au cours des {days, number} derniers jours',
    // defaultMessage: 'Paiements effectués',
  },

  x_overdue: {
    id: 'vendors-items-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_bills: {
    id: 'vendors-items-page.message.x_open_bills',
    // defaultMessage: `Open {bills, plural,
    //   =0 {Bill}
    //   other {Bills}
    // }`,
    defaultMessage: 'En cours',
  },

  bill_status_Paid: {
    id: 'vendors-items-page.message.bill-status-paid',
    defaultMessage: `Paiements effectués`,
  },

  noData: {
    id: 'vendors-items-page.message.no-data',
    defaultMessage: 'Rien à afficher.',
  },

  NewTransaction: {
    id: 'vendors-items-page.message.NewTransaction',
    defaultMessage: 'Nouvelle opération',
  },

  NewVendor: {
    id: 'vendors-items-page.message.NewVendor',
    defaultMessage: 'Nouveau fournisseur',
  },

  Table_Title_CUSTOMER: {
    id: 'vendors-items-page.message.table-title-vendor',
    defaultMessage: 'Fournisseur / Entreprise',
  },
  Table_Title_Tel: {
    id: 'vendors-items-page.message.table-title-vendor-tel',
    defaultMessage: 'Téléphone',
  },
  Table_Title_Balance: {
    id: 'vendors-items-page.message.table-title-vendor-bal',
    defaultMessage: 'Solde courant',
  },
  Table_Title_Actions: {
    id: 'vendors-items-page.message.table-title-vendor-actions',
    defaultMessage: 'Actions',
  },

  Vendor: {
    id: 'vendors-items-page.message.Vendor',
    defaultMessage: 'Fournisseur',
  },
  Bill: {
    id: 'vendors-items-page.message.Bill',
    defaultMessage: 'Facture fournisseur',
  },

  Expense: {
    id: 'vendors-items-page.message.Expense',
    defaultMessage: 'Achat comptant',
  },

  Payment: {
    id: 'vendors-items-page.message.Payment',
    defaultMessage: 'Paiement',
  },

});

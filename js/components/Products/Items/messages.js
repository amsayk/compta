import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Action_active: {
    id: 'products-items-page.action-active',
    defaultMessage: 'Rendre actif',
  },
  Action_inactive: {
    id: 'products-items-page.action-inactive',
    defaultMessage: 'Rendre inactif',
  },

  ConfirmDeactivate: {
    id: 'products-items-page.message.confirm-deactive',
    defaultMessage: 'Etes-vous sûr de vouloir rendre {displayName} inactif?'
  },
  ConfirmActivate: {
    id: 'products-items-page.message.confirm-active',
    defaultMessage: 'Etes-vous sûr de vouloir rendre {displayName} actif?'
  },

  Done: {
    id: 'products-items-page.label-done',
    defaultMessage: 'Terminer',
  },

  Open_Bills: {
    id: 'products-items-page.label-totals-open-bills',
    defaultMessage: `{count, plural, =0 {Aucun factures en cours} =1 {1 facture en cours} other {{count} factures en cours}}`,
  },

  Table_Title_Price: {
    id: 'products-items-page.title-unit-price',
    defaultMessage: 'Prix unitaire/Taux',
  },

  Table_Title_Open_Bills: {
    id: 'products-items-page.title-open-bills',
    defaultMessage: 'FACTURES EN ATTENTE',
  },

  Action_product: {
    id: 'products-items-page.action-product',
    defaultMessage: 'Modifier',
  },
  Action_report: {
    id: 'products-items-page.action-report',
    defaultMessage: 'Executer le rapport',
  },
  Action_delete: {
    id: 'products-items-page.action-del',
    defaultMessage: 'Supprimer',
  },
  Action_bill: {
    id: 'products-items-page.action-bill',
    defaultMessage: 'Nouveau facture fournisseur',
  },
  Action_expense: {
    id: 'products-items-page.action-expense',
    defaultMessage: 'Nouveau achat comptant',
  },
  Action_payment: {
    id: 'products-items-page.action-payment',
    defaultMessage: 'Effectuer un paiement',
  },

  Subtitle: {
    id: 'products-items-page.subtitle',
    defaultMessage: 'Produits',
  },

  last_x_days: {
    id: 'products-items-toolbar.last-x-days',
    defaultMessage: '{days} derniers jours',
  },
  label_batch_actions: {
    id: 'products-items-toolbar.label-batch-actions',
    defaultMessage: 'Actions groupées',
  },
  menuitem_Send: {
    id: 'products-items-toolbar.batch-action-send',
    defaultMessage: 'E-mail',
  },
  menuitem_Print: {
    id: 'products-items-toolbar.batch-action-print',
    defaultMessage: 'Imprimer',
  },

  Table_Title_Action: {
    id: 'products-items-page.message.table-title-action',
    defaultMessage: 'Action',
  },
  Table_Title_Name: {
    id: 'products-items-page.message.table-title-name',
    defaultMessage: 'Nom',
  },

  paid_last_x_days: {
    id: 'products-items-page.message.paid_last_x_days',
    // defaultMessage: 'Paid Last {days, number} Days',
    defaultMessage: 'Paiements au cours des {days, number} derniers jours',
  },

  unpaid_last_x_days: {
    id: 'products-items-page.message.unpaid_last_x_days',
    // defaultMessage: 'Unpaid Last {days, number} Days',
    defaultMessage: 'Paiements effectués',
  },

  x_overdue: {
    id: 'products-items-page.message.x_overdue',
    defaultMessage: 'En retard',
  },

  x_open_bills: {
    id: 'products-items-page.message.x_open_bills',
    // defaultMessage: `Open {bills, plural,
    //   =0 {Bill}
    //   other {Bills}
    // }`,
    defaultMessage: 'En cours'
  },

  bill_status_Paid: {
    id: 'products-items-page.message.bill-status-paid',
    defaultMessage: `Payé`,
  },

  noData: {
    id: 'products-items-page.message.no-data',
    defaultMessage: 'Rien à afficher.',
  },

  NewTransaction: {
    id: 'products-items-page.message.NewTransaction',
    defaultMessage: 'Nouvelle opération',
  },

  NewProduct: {
    id: 'products-items-page.message.NewProduct',
    defaultMessage: 'Nouveau produit',
  },

  Table_Title_CUSTOMER: {
    id: 'products-items-page.message.table-title-product',
    defaultMessage: 'Produit / Entreprise',
  },
  Table_Title_Tel: {
    id: 'products-items-page.message.table-title-product-tel',
    defaultMessage: 'Téléphone',
  },
  Table_Title_Balance: {
    id: 'products-items-page.message.table-title-product-bal',
    defaultMessage: 'Solde courant',
  },
  Table_Title_Actions: {
    id: 'products-items-page.message.table-title-product-actions',
    defaultMessage: 'Actions',
  },

  Product: {
    id: 'products-items-page.message.Product',
    defaultMessage: 'Produit',
  },
  Bill: {
    id: 'products-items-page.message.Bill',
    defaultMessage: 'Facture fournisseur',
  },

  Expense: {
    id: 'products-items-page.message.Expense',
    defaultMessage: 'Achat comptant',
  },

  Payment: {
    id: 'products-items-page.message.Payment',
    defaultMessage: 'Paiement',
  },

});

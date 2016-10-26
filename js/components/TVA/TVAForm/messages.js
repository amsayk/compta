import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  Done: {
    id: 'vat-form-page.label-done',
    defaultMessage: 'Configuration',
  },

  ErrorTitle: {
    id: 'vat-form.error-title',
    defaultMessage: 'L\'erreur suivante',
  },


  Title: {
    id: 'vat-form.title',
    defaultMessage: 'Configurer la TVA',
  },


  label_Agency: {
    id: 'vat-form.label-VAT-agency',
    defaultMessage: 'Organisme',
  },

  label_IF: {
    id: 'vat-form.title',
    defaultMessage: 'Votre numéro de TVA',
  },

  label_startDate: {
    id: 'vat-form.label-VAT-startDate',
    defaultMessage: 'Début de la période de TVA courante',
  },
  label_frequency: {
    id: 'vat-form.label-VAT-frequency',
    defaultMessage: 'Votre fréquence de déclaration de la TVA',
  },
  label_regime: {
    id: 'vat-form.label-VAT-regime',
    defaultMessage: 'Votre régime de TVA',
  },

  MONTHLY: {
    id: 'vat-form.frequency-MONTHLY',
    defaultMessage: 'Mensuelle',
  },

  QUARTERLY: {
    id: 'vat-form.frequency-MONTHLY',
    defaultMessage: 'Trimestrielle',
  },


  Regime_1: {
    id: 'vat-form.regime-Standard',
    defaultMessage: 'Encaissement',
  },
  Regime_2: {
    id: 'vat-form.regime-Debit',
    defaultMessage: 'Débit',
  },


});

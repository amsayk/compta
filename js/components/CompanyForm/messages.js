import {
  defineMessages,
} from 'react-intl';

export default defineMessages({

  error: {
    id: 'error.unknown',
    description: '',
    defaultMessage: 'Il y avait une erreur. Veuillez réessayer.',
  },

  displayNameError: {
    id: 'error.displayName',
    description: '',
    defaultMessage: 'Ce nom de la société a déjà été utilisée',
  },

  formTitle: {
    id: 'message.add-company-title',
    description: '',
    defaultMessage: 'Créer une nouvelle société',
  },

  formSubtitle: {
    id: 'message.add-company-subtitle',
    description: '',
    defaultMessage: 'Premièrement, juste lui donner un nom…',
  },

  displayNameLabel: {
    id: 'label.displayName',
    description: '',
    defaultMessage: 'Comment voulez-vous l\'appeler?'
  },

  displayNameDesc: {
    id: 'description.displayName',
    description: '',
    defaultMessage: `Voici comment nous allons l\'appeler. Éviter d\'utiliser les caractères spéciaux, et commencez le nom par une lettre de l\'alphabet.`
  },

  displayNamePlaceholder: {
    id: 'placeholder.displayName',
    description: '',
    defaultMessage: 'Choisir un bon nom…'
  },

  periodTypeLabel: {
    id: 'label.periodType',
    description: '',
    defaultMessage: 'Votre fréquence de déclaration de la TVA?'
  },

  MONTHLY: {
    id: 'MONTHLY',
    description: '',
    defaultMessage: 'Mensuelle'
  },

  TRIMESTERLY: {
    id: 'TRIMESTERLY',
    description: '',
    defaultMessage: 'Trimestrielle'
  },

  cancel: {
    id: 'cancel',
    description: '',
    defaultMessage: 'Annuler'
  },

  save: {
    id: 'action.save-company',
    description: '',
    defaultMessage: 'Créer!'
  },

  saving: {
    id: 'action.saving-company',
    description: '',
    defaultMessage: 'En cours…'
  },

});

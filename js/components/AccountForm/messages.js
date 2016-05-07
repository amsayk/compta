import {
  defineMessages,
} from 'react-intl';

export default defineMessages({

  error: {
    id: 'account-form.error.unknown',
    description: '',
    defaultMessage: 'Il y avait une erreur. Veuillez réessayer.',
  },

  emailError: {
    id: 'account-form.error.displayName',
    description: '',
    defaultMessage: 'Ce nom de la société a déjà été utilisée',
  },

  formTitle: {
    id: 'account-form.message.add-account-title',
    description: '',
    defaultMessage: 'Modifiez vos informations de connexion',
  },

  displayNameLabel: {
    id: 'account-form.label.displayName',
    description: '',
    defaultMessage: 'Quel est votre nom?'
  },

  emailLabel: {
    id: 'account-form.label.email',
    description: '',
    defaultMessage: 'Quelle est votre adresse e-mail?'
  },

  emailDesc: {
    id: 'account-form.description.email',
    description: '',
    defaultMessage: `Voilà où nous envoyons les instructions de réinitialisation de votre mot de passe.`
  },

  cancel: {
    id: 'account-form.cancel',
    description: '',
    defaultMessage: 'Annuler'
  },

  save: {
    id: 'account-form.action.save-account',
    description: '',
    defaultMessage: 'Modifier'
  },

  saving: {
    id: 'account-form.action.saving-account',
    description: '',
    defaultMessage: 'En cours…'
  },

});

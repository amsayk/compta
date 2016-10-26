import {
  defineMessages,
} from 'react-intl';

export default defineMessages({

  error: {
    id: 'account-form.error.unknown',
    description: '',
    defaultMessage: 'There was an unknown error. Please try again.',
  },

  emailError: {
    id: 'account-form.error.displayName',
    description: '',
    defaultMessage: 'This Company Name was already used',
  },

  formTitle: {
    id: 'account-form.message.add-account-title',
    description: '',
    defaultMessage: 'Change your login information',
  },

  displayNameLabel: {
    id: 'account-form.label.displayName',
    description: '',
    defaultMessage: 'What’s your name?'
  },

  emailLabel: {
    id: 'account-form.label.email',
    description: '',
    defaultMessage: 'What’s your email address?'
  },

  emailDesc: {
    id: 'account-form.description.email',
    description: '',
    defaultMessage: `This is where we send your password reset instructions.`
  },

  cancel: {
    id: 'account-form.cancel',
    description: '',
    defaultMessage: 'Cancel'
  },

  save: {
    id: 'account-form.action.save-account',
    description: '',
    defaultMessage: 'Change'
  },

  saving: {
    id: 'account-form.action.saving-account',
    description: '',
    defaultMessage: 'Saving…'
  },

});

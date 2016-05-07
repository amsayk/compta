import {
  defineMessages,
} from 'react-intl';

export default defineMessages({

  Subtitle: {
    id: 'banking-page.subtitle',
    defaultMessage: 'Banking',
  },

  newApp: {
    id: 'banking-page.action.create-new-app',
    defaultMessage: 'Create a new Bank Account',
  },

  created: {
    id: 'banking-page.message.created',
    defaultMessage: 'Created',
  },

  filter: {
    id: 'banking-page.message.filter-accounts',
    defaultMessage: 'Start typing to filter…',
  },

  noData: {
    id: 'banking-page.message.no-data',
    defaultMessage: 'No data to display.',
  },

  //

  error: {
    id: 'banking-page.error.unknown',
    defaultMessage: 'There was an unknown error. Please try again.',
  },

  displayNameError: {
    id: 'banking-page.error.displayName',
    defaultMessage: 'This Company Name was already used',
  },

  formTitle: {
    id: 'banking-page.message.add-company-title',
    defaultMessage: 'Create a new company',
  },

  formSubtitle: {
    id: 'banking-page.message.add-company-subtitle',
    defaultMessage: 'Just give it a name first…',
  },

  displayNameLabel: {
    id: 'banking-page.label.displayName',
    defaultMessage: 'What should we call it?'
  },

  displayNameDesc: {
    id: 'banking-page.description.displayName',
    defaultMessage: `This is how we’ll reference it. Don’t use any special characters, and start your name with a letter.`
  },

  displayNamePlaceholder: {
    id: 'banking-page.placeholder.displayName',
    defaultMessage: 'Pick a good name…'
  },

  periodTypeLabel: {
    id: 'banking-page.label.periodType',
    defaultMessage: 'What type of Period do you need?'
  },

  MONTHLY: {
    id: 'banking-page.MONTHLY',
    defaultMessage: 'MONTHLY'
  },

  TRIMESTERLY: {
    id: 'banking-page.TRIMESTERLY',
    defaultMessage: 'TRIMESTERLY'
  },

  cancel: {
    id: 'banking-page.cancel',
    defaultMessage: 'Cancel'
  },

  save: {
    id: 'banking-page.action.save-company',
    defaultMessage: 'Create it!'
  },

  saving: {
    id: 'banking-page.action.saving-company',
    defaultMessage: 'Saving…'
  },

  currentBal: {
    id: 'banking-page.action.current-bal',
    defaultMessage: 'Current balance'
  },

});

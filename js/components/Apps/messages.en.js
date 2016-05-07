import {
  defineMessages,
} from 'react-intl';

export default defineMessages({

  newApp: {
    id: 'action.create-new-app',
    description: 'Label to create new company',
    defaultMessage: 'Create a new app',
  },

  created: {
    id: 'message.created',
    description: 'The word for created at.',
    defaultMessage: 'Created',
  },

  filter: {
    id: 'message.filter-companies',
    description: 'The message to filter the list of companies.',
    defaultMessage: 'Start typing to filter…',
  },

  noData: {
    id: 'message.no-data',
    description: '',
    defaultMessage: 'No data to display.',
  },

});

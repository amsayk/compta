import {
  defineMessages,
} from 'react-intl';

export default defineMessages({

  newApp: {
    id: 'action.create-new-app',
    description: 'Label to create new company',
    defaultMessage: 'Ajouter une nouvelle société',
  },

  created: {
    id: 'message.created',
    description: 'The word for created at.',
    defaultMessage: 'Créé',
  },

  filter: {
    id: 'message.filter-companies',
    description: 'The message to filter the list of companies.',
    defaultMessage: 'Commencez à taper pour filtrer…',
  },

  noData: {
    id: 'message.no-data',
    description: '',
    defaultMessage: 'Rien à afficher.',
  },

});

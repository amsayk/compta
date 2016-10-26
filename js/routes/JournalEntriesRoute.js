import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    viewer: () => Relay.QL`
      query {
        viewer
      }
    `,
  };
  static paramDefinitions = {
    companyId: { required: true, },
    id: { required: true, },
    type: { required: true, },
  };
  static routeName = 'JournalEntriesRoute';
}

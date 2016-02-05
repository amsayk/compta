import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    root: () => Relay.QL`
      query {
        root
      }
    `,
  };
  static paramDefinitions = {
    companyId: {required: true},
    period: {required: true},
  };
  static routeName = 'TransactionsRoute';
}

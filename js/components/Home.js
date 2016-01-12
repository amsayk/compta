import React, {Component} from 'react';
import Relay from 'react-relay';

import CSSModules from 'react-css-modules';

import styles from './Home.scss';

import AppHomeRoute from '../routes/AppHomeRoute';

@CSSModules(styles, {})
class Home extends Component {

  render() {
    return (
      <div styleName="">
        <h1>User</h1>
        <h1>Id : {this.props.viewer.id}</h1>
        <h1>Name : {this.props.viewer.displayName}</h1>
      </div>
    );
  }
}

Home = Relay.createContainer(Home, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
          id,
          displayName,
      }
    `,
  },
});

module.exports = () => {
  return (
    <Relay.RootContainer
      Component={Home}
      route={new AppHomeRoute()}
    />
  );
};

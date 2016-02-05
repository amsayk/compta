import React, {Component} from 'react';
import Relay from 'react-relay';

import Loading from '../Loading/Loading';

import config from '../../config';

import HomeRoute from '../../routes/HomeRoute';

import {
  intlShape,
} from 'react-intl';

class Home extends Component {
  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { formatMessage, } = this.context.intl;
    return (
      <div>
        {React.cloneElement(this.props.children, { ...this.props, })}
      </div>
    );
  }
}

Home = Relay.createContainer(Home, {
  initialVariables: {},

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
          id,
          displayName,
          username,
          email,
          createdAt,
          updatedAt,
          sessionToken,
      }
    `,
  },
});

module.exports = (props) => (
  <Relay.RootContainer
    Component={Home}
    route={new HomeRoute()}
    renderLoading={function() {
      return (
        <div className="home loading">

          <div className="content">

              <Loading/>

          </div>

        </div>
      );
    }}
    renderFetched={function(data) {
       return <Home {...props} {...data}/>;
    }}
  />
);

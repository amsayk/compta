import React, {Component, PropTypes,} from 'react';
import Relay from 'react-relay';

import stopEvent from '../../../utils/stopEvent';

import LazyCache from 'react-lazy-cache';

import classnames from 'classnames';

import RelayRoute from '../../../routes/AppIncomeRoute'

import {
  intlShape,
} from 'react-intl';

import messages from '../messages';

import CSSModules from 'react-css-modules';

import styles from './Income.scss';

@CSSModules(styles, { allowMultiple: true, })
class Income extends React.Component{
  static contextTypes = {
    intl: intlShape.isRequired
  };
  static displayName = 'AppsList.Income';
  render(){
    const { privateModeOn, loading, viewer, } = this.props;
    const { intl, } = this.context;
    const {
      open : {
        totalCount: openCount,
        // amount: openAmount,
      },
      overdue : {
        totalCount: overdueCount,
        // amount: overdueAmount,
      },
      closed : {
        // totalCount: closedCount,
        amount: closedAmount,
      },
    } = loading ? {
      open : {
        totalCount: 0,
        // amount: 0.0,
      },
      overdue : {
        totalCount: 0,
        // amount: 0.0,
      },
      closed : {
        // totalCount: 0,
        amount: 0.0,
      },
    } : viewer.company.salesStatus;
    return (
      <div styleName={'plan'} style={ privateModeOn ? {width: 300,} : {}}>

        <div styleName={'section'}>Chiffre d’affaires{/* • <span styleName='edit'>Derniers 365 jours</span>*/}</div>

        <div styleName={'count'} style={{ maxWidth: (privateModeOn ? 300 : 450 - 259.531) / 2, }}>
          <div styleName={classnames('number word', { /*shimmer: loading,*/ })} style={{ maxWidth: (privateModeOn ? 300 : 450 - 259.531) / 2, }}>{intl.formatNumber(openCount)}</div>
          <div styleName={'label word'} style={{ textTransform: 'uppercase', }}>En cours</div>
        </div>

        <div styleName={'count'} style={{ maxWidth: (privateModeOn ? 300 : 450 - 259.531) / 2, }}>
          <div styleName={classnames('number word', { /*shimmer: loading,*/ })} style={{ maxWidth: (privateModeOn ? 300 : 450 - 259.531) / 2, }}>{intl.formatNumber(overdueCount)}</div>
          <div styleName={'label word'} style={{ textTransform: 'uppercase', }}>En retard</div>
        </div>

        {privateModeOn ? null : <div styleName={'count'} style={{ maxWidth: 259.531, }}>
          <div styleName={classnames('number word money', { /*shimmer: loading,*/ })} style={{ maxWidth: 259.531, }}>{intl.formatNumber(closedAmount, { format: 'MONEY', })}</div>
          <div title={'Encaissement dans les derniers 30 jours'} styleName={'label word'} style={{ textTransform: 'uppercase', }}>ENCAISSEMENTS DANS LES DERNIERS 30 JOURS</div>
        </div>}

        {/*<span styleName='edit'>Derniers 365 jours</span>*/}

      </div>
    );
  }
}

function wrapWithC(Component, props) {
  class CWrapper extends React.Component {
    static defaultProps = { readyState: { done: false, stale: true, }, };
    render() {
      const { readyState, viewer, } = this.props;
      return React.createElement(
        Component,
        {
          ...props,
          viewer: viewer,
          loading: readyState.done === false || readyState.stale === true,
        },
        this.props.children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {
      companyId: props.companyId,
    },

    fragments: {
      viewer: () => Relay.QL`

      fragment on User {
        id,
        objectId,
        displayName,
        username,
        email,
        createdAt,
        updatedAt,
        sessionToken,

        company(id: $companyId) {

          id,

          VATSettings{
            enabled,
            agency,
            startDate,
            IF,
            frequency,
            regime,
            percentages{ value, },
          },

          salesStatus{

            open{
              totalCount,
              amount,
            },

            overdue{
              totalCount,
              amount,
            },

            closed{
              totalCount,
              amount,
            },

          },

        }
      }

    `,
    },
  });
}

function createContainer({ ...props, }){
  const Route = new RelayRoute({ companyId: props.company.id, });
  const MyComponent = wrapWithC(Income, { companyId: props.company.id, });

  class Container extends React.Component{
    shouldComponentUpdate(){
      return false;
    }
    render(){
      return (
        <Relay.RootContainer
          Component={MyComponent}
          forceFetch={true}
          route={Route}
          renderFetched={function(data, readyState){
            return (
              <MyComponent
                {...data}
                stale={readyState.stale}
                readyState={readyState}
              />
            );
          }}
        />
      );

    }
  }

  return () => Container;
}

class S extends React.Component{
  constructor(props) {
    super(props);
    this.cache = new LazyCache(this, {
      Component: {
        params: [
          // props that effect how redux-form connects to the redux store
        ],
        fn: createContainer(props),
      }
    });
  }
  shouldComponentUpdate(){
    return false;
  }
  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
  }
  render() {
    const {Component} = this.cache;
    return <Component {...this.props}/>;
  }
}

module.exports = S;

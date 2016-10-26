import React, {Component, PropTypes,} from 'react';
import Relay from 'react-relay';

import stopEvent from '../../../utils/stopEvent';

import {
  intlShape,
} from 'react-intl';

import moment from 'moment';

import classnames from 'classnames';

import messages from '../messages';

import LazyCache from 'react-lazy-cache';

import CSSModules from 'react-css-modules';

import styles from './Result.scss';

import RelayRoute from '../../../routes/AppResultRoute'

@CSSModules(styles, { allowMultiple: true, })
class Result extends React.Component{
  static displayName = 'AppsList.Result';
  static contextTypes = {
    intl: intlShape.isRequired
  };
  render(){
    const { intl, } = this.context;
    const { loading, viewer, } = this.props;
    const { totalExpenses, totalSales, } = loading ? { totalExpenses: 0, totalSales: 0, } : getTotal(viewer.company);
    return (
      <div styleName={'glance'}>

        <div styleName={'section'}>Résultat</div>

        <div styleName={'count'} style={{ maxWidth: (350 / 3) - 12 - 10, }}>
          <div styleName={classnames('number word money', { /*shimmer: loading,*/ })} style={{ maxWidth: (350 / 3) - 12 - 10, }}>{intl.formatNumber(totalSales - totalExpenses, { format: 'MONEY', })}</div>
          <div styleName={'label word'} style={{ textTransform: 'uppercase', }}>RÉSULTAT</div>
        </div>

        <div styleName={'count'} style={{ maxWidth: (350 / 3) - 12 + 20, }}>
          <div styleName={classnames('number word money', { /*shimmer: loading,*/ })} style={{ maxWidth: (350 / 3) - 12 + 20, }}>{intl.formatNumber(totalSales, { format: 'MONEY', })}</div>
          <div styleName={'label word'} style={{ textTransform: 'uppercase', }}>CHIFFRE D’AFFAIRES</div>
        </div>

        <div styleName={'count'} style={{ maxWidth: (350 / 3) - 12 - 10, }}>
          <div styleName={classnames('number word money', { /*shimmer: loading,*/ })} style={{ maxWidth: (350 / 3) - 12 - 10, }}>{intl.formatNumber(totalExpenses, { format: 'MONEY', })}</div>
          <div styleName={'label word'} style={{ textTransform: 'uppercase', }}>DÉPENSES</div>
        </div>

        <span styleName='badge edit'>Derniers 30 jours</span>

      </div>
    );
  }
}

function getTotal({ dashboard__Result, }){
  let totalDEBIT_Expenses = 0;
  let totalCREDIT_Expenses = 0;

  let totalDEBIT_Sales = 0;
  let totalCREDIT_Sales = 0;

  dashboard__Result.edges.forEach(({ node: { categoryCode, type, amount, }, }) => {

    if(categoryCode === '6.1'){
      switch(type){
        case 'DEBIT':
          totalDEBIT_Expenses += amount;
          break;

        case 'CREDIT':
          totalCREDIT_Expenses += amount;
          break;
      }
      return;
    }

    if(categoryCode === '7.1'){
      switch(type){
        case 'DEBIT':
          totalDEBIT_Sales += amount;
          break;

        case 'CREDIT':
          totalCREDIT_Sales += amount;
          break;
      }
      return;
    }

    throw 'Invalid categoryCode';
  });

  return {
    totalExpenses: totalDEBIT_Expenses - totalCREDIT_Expenses,
    totalSales: totalCREDIT_Sales - totalDEBIT_Sales,
  };
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

      resultCategories: [
        '6.1',
        '7.1'
      ],

      from: moment().subtract(30, 'days').toDate(),
      to: null,
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

          dashboard__Result: operationsByCategories(first: 100000, categories: $resultCategories, from: $from, to: $to, _rev: 0){
            edges{
              node{
                categoryCode: _categoryCode,
                type,
                amount,
              }
            }
          }

        }
      }

    `,
    },
  });
}

function createContainer({ ...props, }){
  const Route = new RelayRoute({ companyId: props.company.id, });
  const MyComponent = wrapWithC(Result, { companyId: props.company.id, });

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

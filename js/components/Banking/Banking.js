import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../Sidebar/AppSidebar';
import Loading from '../Loading/Loading';

import moment from 'moment';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

const CASH = {
  'code': '5.1.6.1.1',
  'displayName': 'Caisses centrale',
  '_classCode': '5',
  '_categoryCode': '5.1',
  '_groupCode': '5.1.6'
};

// import BankAccountForm from './BankAccountForm';

import CSSModules from 'react-css-modules';

import throttle from 'lodash.throttle';

import events from 'dom-helpers/events';

import {sortMostRecent,} from '../../utils/sort';

import {TransitionMotion, spring, presets,} from 'react-motion';

import styles from './Banking.scss';

import messages from './messages';

import {
  FormattedMessage,
  FormattedRelative,
  intlShape,
} from 'react-intl';

import RelayRoute from '../../routes/BankingRoute';

const Title = (company) => company.displayName;

function getBodyHeight() {
  var body = document.body,
    html = document.documentElement;

  var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);

  return height;
}

class Header extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const {formatMessage,} = this.context.intl;
    return (
      <div className='header'>
        {/* <i className='material-icons' style={{color: '#788c97', transform: 'rotate(90deg)', }}>search</i>
         <input
         onChange={this.props.onFilterChange}
         className='search'
         placeholder={formatMessage(messages['filter'])}
         value={this.props.filterQuery || ''}
         />*/}

      </div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
class Banking extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false
  };

  _onAddClicked = (e) => {
    e.preventDefault();
    // this.context.store.dispatch(bankAccountEditStart('NEW'));
    this.setState({
      modalOpen: true
    })
  };

  _close = () => {
    this.setState({modalOpen: false});
  };

  _renderForm = () => {
    const form =/* this.state.modalOpen ? (
     <BankAccountForm
       onCancel={this._close}
       formKey={'NEW'}
       viewer={this.props.viewer}
       company={this.props.company}
     />
    ) :*/ null;

    return form;
  };

  // _onFilterChange = (e) => {
  //   this.setState({
  //     filterQuery: e.target.value
  //   })
  // };

  willEnter() {
    // triggered when c's gone. Keeping c until its width/height reach 0.
    return {height: 0, opacity: 1,};
  }

  willLeave() {
    // triggered when c's gone. Keeping c until its width/height reach 0.
    return {height: spring(0), opacity: spring(0),};
  }

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);
  }

  componentWillUnmount() {
    events.off(window, 'resize', this._handleWindowResize);
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

  render() {
    const {formatMessage,} = this.context.intl;

    const filterQuery = (this.state.filterQuery || '').trim();

    let matchesFilter;

    // if (Boolean(filterQuery)) {
    //
    //   const re = new RegExp('^' + (filterQuery || '').trim(), 'i');
    //
    //   matchesFilter = (company) => {
    //     return re.test(company.displayName);
    //   };
    //
    // } else {

      matchesFilter = () => {
        return true;
      };

    // }

    const ls = this.props.bankAccounts/*.filter(company => matchesFilter(company))*/.slice();

    ls.sort(sortMostRecent(obj => Date.parse(obj.createdAt)));

    return (
      <div className=''>

        <Sidebar
          viewer={this.props.viewer}
          company={this.props.company}
          companies={this.props.companies.edges.map(({ node: company, }) => company)}
          viewer={this.props.viewer}
          page='/tresors'
        />

        <div className='content'>

          <div styleName='page'>

            <div styleName='toolbar'>

              <div styleName='title'>
                <div styleName='section'>{Title(this.props.company)}</div>

                <div>
                  <span styleName='subsection'>{formatMessage(messages.Subtitle)}</span>
                  <span styleName='details'></span>
                </div>

              </div>

              {/*<div className='actions'>

               <a onClick={this._onAddClicked} role='button' styleName='create'>
               <FormattedMessage {...messages['newApp']} />
               </a>

               </div>*/}

              <div styleName='actions'>
                {/*

                 <ButtonToolbar>
                 <DropdownButton styleName={'s-btn'} bsStyle={'primary'} title={'New Transaction'} id={'new-transaction'}>
                 <MenuItem eventKey='1'>Action</MenuItem>
                 <MenuItem eventKey='2'>Another action</MenuItem>
                 <MenuItem eventKey='3' active>Active Item</MenuItem>
                 <MenuItem divider />
                 <MenuItem eventKey='4'>Separated link</MenuItem>
                 </DropdownButton>
                 </ButtonToolbar>
                */}
              </div>

            </div>

            <div styleName='index' style={{minHeight: getBodyHeight() - 96}}>

              {/*<Header
               // filterQuery={this.state.filterQuery}
               // onAddClicked={this._onAddClicked}
               // onFilterChange={this._onFilterChange}
               />*/}

              {ls.length === 0 ?
                null :

                <TransitionMotion
                  // willEnter={this.willEnter}
                  // willLeave={this.willLeave}
                  defaultStyles={ls.map(item => ({
                    key: item.id,
                    style: {height: 0, opacity: 1,},
                    }))}
                  styles={ls.map(item => ({
                    key: item.id,
                    style: {height: spring(80, presets.gentle), opacity: spring(1, presets.gentle),},
                    data: item,
                  }))}>
                  {interpolatedStyles =>
                    // first render: a, b, c. Second: still a, b, c! Only last one's a, b.
                    <ul className={this.props.styles['apps']}>
                      {interpolatedStyles.map(config => {
                        return (
                          <li key={config.key} onClick={e => {}} style={{  }}>

                            <div className='' style={{height: config.style.height}}>

                              <a className={this.props.styles['icon']}>
                                <i className='material-icons md-48 md-dark'>{config.data.icon}</i>
                              </a>

                              <div className={this.props.styles['plan']}>
                                <div className={this.props.styles['money-section']}>{formatMessage(messages['currentBal'])}</div>

                                <div className={this.props.styles['count']}>
                                  <div className={this.props.styles['number']}>MAD 0,00</div>
                                </div>

                              </div>

                              <div className={this.props.styles['details']} style={{}}>
                                <div className={this.props.styles['appname']}>{config.data.displayName}</div>
                                {/*<div>
                                 <span>
                                 <FormattedMessage {...messages['created']} />
                                 </span>
                                 {' '}
                                 <span className={'ago'}>
                                 <FormattedRelative value={this.props.company.createdAt}/>
                                 </span>
                                 </div>*/}
                              </div>

                            </div>

                          </li>
                        );
                      })}
                    </ul>
                  }
                </TransitionMotion>
              }

            </div>

          </div>

        </div>

        {this._renderForm()}

      </div>
    );
  }
}

function wrapWithC(Component, props) {
  class CWrapper extends React.Component {
    render() {
      return React.createElement(
        Component, {
          ...props,
          bankAccounts: this.props.viewer.company.bankAccounts.edges.map(obj => obj.node),
          companies: this.props.viewer.companies,
          company: this.props.viewer.company,
          viewer: this.props.viewer,
        },
        this.props.children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {companyId: props.params.app, first: 1000},

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

          company(id: $companyId){

            VATSettings{
              enabled,
              agency,
              startDate,
              IF,
              frequency,
              regime,
              percentages{ value, },
            },

            objectId,

            id,
            displayName,
            periodType,
            lastTransactionIndex, lastPaymentsTransactionIndex,
            createdAt,
            updatedAt,

            settings {
              periodType,
              closureEnabled,
              closureDate,
            },
            salesSettings {
              defaultDepositToAccountCode,
              preferredInvoiceTerms,
              enableCustomTransactionNumbers,
              enableServiceDate,
              discountEnabled,

              showProducts,
              showRates,
              trackInventory,
              defaultIncomeAccountCode,
            },
            expensesSettings {
              defaultExpenseAccountCode,
              preferredPaymentMethod,
            },
            paymentsSettings {
              defaultDepositToAccountCode,
              preferredPaymentMethod,
            },

            bankAccounts(first: $first){
              edges{
                node{
                  id,
                  displayName,
                  icon,
                }
              }
            },

          },

          companies(first: 100000){

            edges{

              node{
                objectId,
                id,
                displayName,
                periodType,
                lastTransactionIndex, lastPaymentsTransactionIndex,
                createdAt,
                updatedAt,

              }

            }

          },

        }
      `,
    },
  });
}

module.exports = (props) => (
  <Relay.RootContainer
    forceFetch={true}
    Component={wrapWithC(Banking, props)}
    route={new RelayRoute({companyId: props.params.app})}
    renderLoading={function() {
      return (
        <div className='loading'>

          <Sidebar
            viewer={props.viewer}
            company={props.company}
            companies={props.companies || []}
            page='/tresors'
          />

          <div className='content'>

              <Loading/>

          </div>

        </div>
      );
    }}
  />
);

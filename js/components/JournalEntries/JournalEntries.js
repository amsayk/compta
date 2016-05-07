import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import stopEvent from '../../utils/stopEvent';

import classnames from 'classnames';

import moment from 'moment';

import RelayRoute from '../../routes/JournalEntriesRoute';

import Loading from '../Loading/Loading';

import LazyCache from 'react-lazy-cache';

import styles from './JournalEntries.scss';

import find from 'lodash.findindex';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, {Header, Body, Footer} from '../utils/Dialog';

import requiredPropType from 'react-prop-types/lib/all';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

function getAccountName(accounts, accountCode){
  const index = find(accounts, ({code}) => code === accountCode);
  return accounts[index].name;
}

@CSSModules(styles, {allowMultiple: true})
class JournalEntries extends Component {

  static displayName = 'JournalEntries';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    type: PropTypes.oneOf([
      'Invoice',
      'Sale',
      'PaymentOfInvoices',

      'Bill',
      'Expense',
      'PaymentOfBills'
    ]).isRequired,
    transaction: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.loading === false && !props.transaction) {
          return new Error('transaction required!');
        }
      }
    ),
    person: PropTypes.shape({
      id: PropTypes.string.isRequired,
      objectId: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  state = {};

  _handleClose = (e) => {
    if(e){
      stopEvent(e);
    }

    setImmediate(() => {
      this.props.onCancel();
    });
  };

  render() {
    const self = this;

    const {
      styles,
      loading,
    } = this.props;

    const {intl,} = this.context;

    return (
      <Modal dialogClassName={`${this.props.styles['modal']} ${this.props.styles['mini']} journal-entries`}
             dialogComponentClass={Dialog}
             ref={ref => this._dialog = ref}
             animation={false}
             className={classnames({'journal-entries': true, [styles['journal-entries'] || '']: true, })}
             show={true} keyboard={true} backdrop={true} onHide={() => this._handleClose()} autoFocus enforceFocus>

        <Modal.Header styleName={'modal-header'} closeButton>{intl.formatMessage(messages['Title'])}
        </Modal.Header>

        <Modal.Body>

          <div styleName='table stretch'>

            <div styleName=''>

              <div>

                <div className='the-container table' style={{}}>

                  <div style={{}}>

                  {loading ? <Loading/> : this._showOperations() }

                  </div>

                </div>

              </div>


            </div>

          </div>

        </Modal.Body>

        <Modal.Footer>

          <div styleName='' style={{}}>
            <button
              style={{minWidth: 70}}
              styleName='btn primary floatRight'
              onClick={e => this._handleClose()} className='unselectable'>{intl.formatMessage(messages['Done'])}</button>
          </div>

        </Modal.Footer>

      </Modal>
    );

  }

  _showOperations = () => {
    const { intl, } = this.context;
    const { transaction, person, type : transactionType, accounts, } = this.props;
    let totalCredits = 0;
    let totalDebits = 0;
    return (
      <div>

      <div className={'operations'}>

        <table className='myTable myTable-sm myTable-responsive' styleName={'table'}>
          <thead>
            <tr>
              <th style={{ width: 100, }}>Date</th>
              <th>TYPE D’OPÉRATION</th>
              <th style={{ width: 50, }}>N°</th>
              <th style={{ width: 150, }}>NOM</th>
              <th>MÉMO/DESCRIPTION</th>
              <th>N° DE COMPTE</th>
              <th style={{ width: 250, }}>COMPTE</th>
              <th>DÉBIT</th>
              <th>CRÉDIT</th>
            </tr>
          </thead>
          <tbody>
          {transaction.operations.edges.map(({node: { accountCode, type, amount,  }}, rowIndex) => {
            totalCredits += (type === 'CREDIT' ? amount : 0);
            totalDebits += (type === 'DEBIT' ? amount : 0);
            return (
              <tr>
                <td>{rowIndex === 0 ? moment(transaction.date).format('ll') : null}</td>
                <td>{rowIndex === 0 ? Types[transactionType] : null}</td>
                <td>{rowIndex === 0 ? transaction.refNo : null}</td>
                <td>{rowIndex === 0 ? person.displayName : null}</td>
                <td>{rowIndex === 0 ? transaction.memo : null}</td>
                <td>{accountCode.replace(/\./g, '')}</td>
                <td>{getAccountName(accounts, accountCode)}</td>
                <td>{type === 'DEBIT' ? intl.formatNumber(amount, { format: 'MAD', }) : null}</td>
                <td>{type === 'CREDIT' ? intl.formatNumber(amount, { format: 'MAD', }) : null}</td>
              </tr>
            );
          })}
          </tbody>
        </table>

      </div>

      <br/>

      <div className={'totals'}>

        <table className='myTable myTable-sm myTable-responsive' styleName={'table'} style={{ fontWeight: 800, }}>
          <tbody>

            <tr>
              <td>Total</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{intl.formatNumber(totalDebits, { format: 'MAD', })}</td>
              <td>{intl.formatNumber(totalCredits, { format: 'MAD', })}</td>
            </tr>

            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{intl.formatNumber(totalDebits, { format: 'MAD', })}</td>
              <td>{intl.formatNumber(totalCredits, { format: 'MAD', })}</td>
            </tr>

          </tbody>
        </table>

      </div>

      </div>
    );
  };

}

function wrapWithC(MyComponent, props) {

  class CWrapper extends Component {

    static propTypes = {
      loading: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      loading: false,
      stale: false,
    };

    render() {
      const { stale, loading, viewer : root, relay, children, } = this.props;
      return React.createElement(
        MyComponent, {
          ...props,
          stale: stale,
          loading: loading,
          transaction: root.transaction,
          accounts: root.accounts,
          root: root,
          viewer: root,
          relay: relay,
        },
        children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {
      companyId: props.company.id,
      id: props.id,
      type: props.type,
    },

    fragments: {
      viewer: () => Relay.QL`
          fragment on User {

            accounts{
              code,
              name,
            }

            transaction: getTransactionByType(type: $type, companyId: $companyId, id: $id) {

              objectId,
              id,
              createdAt,
              updatedAt,

              refNo,
              memo,
              date,

              operations(first: 100000){

                edges {

                  node{

                    objectId,
                    id,
                    createdAt,
                    updatedAt,

                    refNo,
                    memo,
                    date,
                    amount,
                    type,
                    accountCode,
                    _categoryCode,
                    _groupCode,
                    _classCode,

                  },

                },

              },

            },

          }
      `,
    },
  });
}

function createContainer({ viewer, params, company, type, id, companies, ...props, }){
  const MyComponent = wrapWithC(JournalEntries, { params, company, type, id, ...props, });
  const Route = new RelayRoute({ companyId: company.id, type, id, });

  class Container extends Component{
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
              />
            );
          }}
          renderLoading={function() {
            return (
              <MyComponent
                {...{viewer: {
                  ...viewer,
                  company: company,
                  companies: companies || [],
                }}}
                loading={true}
              />
            );
          }}
        />
      );
    }
  }

  return () => Container;
}

export default class extends Component{
  static displayName = 'JournalEntries';
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

const Types = {
  'Bill': 'Facture fournisseur',
  'Expense': 'Achat comptant',
  'PaymentOfBills': 'Infos sur les paiements de factures',

  'PaymentOfInvoices': 'Paiements de factures',
  'Invoice': 'Facture',
  'Sale': 'Reçu de vente',
};

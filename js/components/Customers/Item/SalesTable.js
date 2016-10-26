import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import classnames from 'classnames';

import stopEvent from '../../../utils/stopEvent';

import GenPdfMutation from '../../../mutations/GenPdfMutation';

import PrintDialog from '../../PrintDialog/PrintDialog';

import {
  intlShape,
} from 'react-intl';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
// import Dropdown from 'react-bootstrap/lib/Dropdown';
// import SplitButton from 'react-bootstrap/lib/SplitButton';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

// import {sortMostRecent,} from '../../utils/sort';

class PrintDialogWrapper extends React.Component{
  state = {
    loading: true,
    url: undefined,
    error: undefined,
  };

  constructor(props, context) {
    super(props, context);

    const self = this;

    Relay.Store.commitUpdate(new GenPdfMutation({
      type: this.props.type,
      objectId: this.props.obj.objectId,
      company: this.props.company,
      viewer: this.props.viewer,

    }), {
      onSuccess: function ({genPdf: {pdf}}) {
        self.setState({ loading: false, url: pdf, error: undefined, });
      },
      onFailure: function (transaction) {
        const error = transaction.getError();
        self.setState({ loading: false, error, url: undefined, });
      },
    });
  }

  render(){
    const { url, error, loading, } = this.state;
    return (
      <PrintDialog
        url={url}
        error={error}
        loading={loading}
        onCancel={this.props.onCancel}
      />
    );
  }

}

import OverlayMenu from '../../utils/OverlayMenu';

const ACTIONS = {
  Invoice: {
    main: 'receivepayment',
    actions: [
      'print',
      // 'send',
    ],
  },
  Sale: {
    main: 'print',
    actions: [
      // 'send',
    ],
  },
  Payment: {
    main: undefined,
    actions: [],
  },
};

function getActionsStyle(rowIndex){
  return {
    display: 'block',
    width: 225,
    top: 475 + (rowIndex * 50),
    right: 20,
    left: 'auto',
    borderRadius: 2,
  };
}

class DropdownActions extends React.Component{
  state = { open: false, };
  render(){
    const { open, } = this.state;
    return (
      <div onClick={e => { stopEvent(e); this.setState({ open: !this.state.open, }); }} className={classnames({ open, })}>
        {this.props.children}
      </div>
    );
  }
}

function renderActions(self, { intl, store, rowIndex, }){
  const obj = store.getObjectAt(rowIndex);
  const { main, actions, } = obj.status === 'Closed' && obj.type === 'Invoice'
    ? { main: 'print', actions: [
      // 'send'
    ], }
    : ACTIONS[obj.type];
  return (
    typeof main === 'undefined' ? null : <OverlayMenu title={main ? intl.formatMessage(messages[`Action_${main}`]) : undefined} container={self} onMainAction={self._onMainAction.bind(self, obj, main)}>
      {actions.length > 0 && <DropdownActions>
        <ul className={'dropdown-menu'} style={getActionsStyle(rowIndex)}>
          {actions.map(action => {
            return (
              <li rol='presentation'>
                <a onClick={self._onAction.bind(self, action, obj)} role='menuitem' tabIndex='-1'>{intl.formatMessage(messages[`Action_${action}`])}</a>
              </li>
            );
          })}
        </ul>
      </DropdownActions>}
    </OverlayMenu>
  );
}

import Loading from '../../Loading/Loading';

const SortTypes = {
  ASC: 1,
  DESC: -1,
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
  constructor(props, context){
    super(props, context);

    // if(this.props.sortKey === 'balanceDue'){
      // console.log(
      //   'constructor:balanceDue'
      // );
    // }

    this.state = {
      sortDir: this.props.sortDir,
      sortKey: this.props.sortKey,
    };
  }
  componentWillReceiveProps(nextProps){
    // if(this.props.sortKey === 'balanceDue'){
      // console.log(
      //   'componentWillReceiveProps:balanceDue'
      // );
    // }

    if(this.state.sortDir !== nextProps.sortDir || this.state.sortKey !== nextProps.sortKey){
      this.setState({
        sortDir: nextProps.sortDir,
        sortKey: netxProps.sortKey,
      });
    }
  }
  // shouldComponentUpdate(nextProps, nextState){
  //   return (
  //     this.state.sortDir !== nextProps.sortDir ||
  //     nextState.sortDir !== nextProps.sortDir
  //   );
  // }
  render() {
    const { sortDir, sortKey, } = this.state;
    const { columnKey, className, styles, children, ...props, } = this.props;
    return (
      <Cell {...props} onClick={this._onSortChange} className={classnames(className, { [styles['has-key']]: sortKey === columnKey || (columnKey === 'date' && !sortKey), })} columnKey={columnKey}>
        <a>
          {children} <span className={styles['sort-dir']}>{sortDir === SortTypes.DESC || columnKey !== sortKey ? '↓' : '↑'}</span>
        </a>
      </Cell>
    );
  }

  _onSortChange = (e) => {
    stopEvent(e);

    const sortDir = this.state.sortDir ?
        reverseSortDirection(this.state.sortDir) :
        SortTypes.DESC;

    this.setState({
      sortDir,
    }, () => {

      if (this.props.onSortChange) {
        this.props.onSortChange(
          getSortKey(this.props.columnKey),
          sortDir,
          this._onReadyStateChange
        );
      }
    });

  };

  _onReadyStateChange = ({ done, }) => {
    this._readyStateDone = done;
  };

  shouldComponentUpdate(){
    // if(this.props.sortKey === 'balanceDue'){
    //   // console.log(
    //   //   'shouldComponentUpdate:balanceDue'
    //   // );
    // }

    if(typeof this._readyStateDone !== 'undefined'){
      return this._readyStateDone;
    }

    return true;
  }
}

function getSortKey(columnKey){
  switch (columnKey) {
    case 'age':           return 'dueDate';
    case 'latestPayment': return 'latestPaymentDate';
    default:              return columnKey;
  }
}

const BUTTONS = [
  'receive-payment',
  'print',
  'send',
];

const BUTTON_TITLES = {
  'receive-payment': 'Receive Payment',
  'print': 'Print',
  'send': 'Send',
};

import OperationDataListStore from './OperationDataListStore';

import moment from 'moment';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

import {editStart as editStartInvoice} from '../../../redux/modules/v2/invoices';
import {editStart as editStartPayment} from '../../../redux/modules/v2/paymentsOfInvoices';
import {editStart as editStartSale} from '../../../redux/modules/v2/sales';

// import InvoiceForm  from '../../Sales/InvoiceForm/InvoiceForm';
// import SaleForm  from '../../Sales/SaleForm/SaleForm';
// import PaymentForm  from '../../Sales/PaymentForm/PaymentForm';

import LoadingActions from '../../Loading/actions';

let InvoiceForm = null;
let SaleForm = null;
let PaymentForm = null;

function loadComponent(type, cb) {
  LoadingActions.show();

  switch (type){
    case 'Invoice':

      require.ensure([], function (require) {
        LoadingActions.hide();
        InvoiceForm = require('../../Sales/InvoiceForm/InvoiceForm').default;
        cb();
      }, 'InvoiceForm');

      break;

    case 'Payment':

      require.ensure([], function (require) {
        LoadingActions.hide();
        PaymentForm = require('../../Sales/PaymentForm/PaymentForm').default;
        cb();
      }, 'PaymentOfInvoicesForm');

      break;

    case 'Sale':

      require.ensure([], function (require) {
        LoadingActions.hide();
        SaleForm = require('../../Sales/SaleForm/SaleForm').default;
        cb();
      }, 'SaleForm');

      break;

  }
}

import requiredPropType from 'react-prop-types/lib/all';

import { Modes as SelectionModes, } from '../../../redux/modules/selection';

export default class SalesTable extends React.Component{

  static displayName = 'CustomerSalesTable';

  static propTypes = {
    page: PropTypes.number.isRequired,
    viewer: PropTypes.object.isRequired,
    company: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.company) {
          return new Error('company required!');
        }
      }
    ),
    customer: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.customer) {
          return new Error('customer required!');
        }
      }
    ),
    bodyWidth: PropTypes.number.isRequired,
    topLoading: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    selection: PropTypes.objectOf(PropTypes.shape({
      mode: PropTypes.oneOf(Object.keys(SelectionModes).map(key => SelectionModes[key])).isRequired,
      keys: PropTypes.objectOf(
        PropTypes.bool.isRequired
      ).isRequired,
    })).isRequired,
    onReceivePayment: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    toggleAll: PropTypes.func.isRequired,
    toggleNone: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  _onMainAction = (obj, btn) => {
    switch (btn) {
      case 'receivepayment':
        this._onReceivePayment(obj);
        break;

      // case 'send':

      case 'print':

        this.setState({
          modalOpen: true,
          modalType: 'preview',
          obj,
        });

        break;
    }
  };

  _onAction = (btn, obj) => {
    switch (btn) {
      case 'receivepayment':
        this._onReceivePayment(obj);
        break;

      // case 'send':
      case 'print':

      this.setState({
          modalOpen: true,
          modalType: 'preview',
          obj,
        });

        break;
    }
  };

    previewModal = () => {

    if(this.state.modalOpen && this.state.modalType === 'preview'){
      const self = this;

      const obj = this.state.obj;

      return (
        <PrintDialogWrapper
          type={obj.type}
          obj={obj}
          company={this.props.company}
          viewer={this.props.viewer}
          onCancel={this._close}
        />
      );
    }

    return null;
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      modalOpen: false,
      loading: this.props.topLoading,
      store: new OperationDataListStore({
        sales: this.props.topLoading ? [] : this.props.sales,
        count: this.props.count,
      })
    };
  }

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      loading: nextProps.topLoading,
      store: new OperationDataListStore({
        sales: nextProps.topLoading ? [] : nextProps.sales,
        count: nextProps.count,
      }),
    });

  }

  _close = (btn, e) => {
    stopEvent(e);

    this.setState({
      modalOpen: false,
      obj: undefined,
      invoice: undefined,
    })
  };

  _openItem = (rowIndex, e) => {
    stopEvent(e);

    const { store, } = this.state;

    const obj = store.getObjectAt(rowIndex);

        const VATInputType_ID_BY_NAME = {
          HT: 1,
          TTC: 2,
          NO_VAT: 3,
        };

        const self = this;

        function p__decorateItem(index, { ...props, item, VATPart,}){
          return {
            index,
            ...props,
            item: item ? {
              ...item,
              className: `Product_${self.props.company.objectId}`,
            } : undefined,
            VATPart: VATPart ? {
              inputType: VATInputType_ID_BY_NAME[VATPart.inputType],
              ...(VATPart.value !== undefined && VATPart.value !== null ? {value: VATPart.value,} : {}),
            } : undefined,
          };
        }

    switch (obj.type) {
      case 'Invoice':
        this.context.store.dispatch(
          editStartInvoice(
            obj.id,
            obj.itemsConnection.edges.map(({node}) => p__decorateItem(node.index, node)),
            {id: obj.id, company: this.props.company,})
        );
        break;

      case 'Sale':
        this.context.store.dispatch(
          editStartSale(
            obj.id,
            obj.itemsConnection.edges.map(({node}) => p__decorateItem(node.index, node)),
            {id: obj.id, company: this.props.company,})
        );
        break;

      case 'Payment':
        this.context.store.dispatch(
          editStartPayment(
            obj.id,
            obj.itemsConnection.edges.map(({node}) => decoratePaymentItem(node)),
            {id: obj.id, company: this.props.company,})
        );
        setImmediate(() => {
          this.props.onReceivePayment(obj.customer);
        });
        break;

      default:

        throw 'Invalid Operation';
    }

    loadComponent(obj.type, () => {
      this.setState({
        modalOpen: true,
        modalType: undefined,
        obj,
      });
    });
  };

  _onToggleAll = (e) => {
    const { selection, page, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    stopEvent(e);
    sel.mode === SelectionModes.None || sel.mode === SelectionModes.Some
      ? toggleAll(this.props.customer.objectId, page)
      : toggleNone(this.props.customer.objectId, page);
  };

  _onToggle = (id, e) => {
    const { page, toggle, } = this.props;
    stopEvent(e);
    toggle(this.props.customer.objectId, { key: id, page, }, this.state.store.getSize());
  };

  _onReceivePayment = (invoice) => {
    this.context.store.dispatch(
      editStartPayment(
        'NEW',
        [],
        {id: 'NEW', company: this.props.company,})
    );

    setImmediate(() => {
      this.props.onReceivePayment(invoice.customer);
    });

    loadComponent('Payment', () => {
      this.setState({
        modalOpen: true,
        modalType: undefined,
        obj: undefined,
        invoice,
      });
    });
  };

  _onInvoice = (obj) => {
    this.setState({
      modalOpen: false,
      obj: undefined,
      invoice: undefined,
    }, () => {
      obj = decorateInvoice(obj);

      const VATInputType_ID_BY_NAME = {
        HT: 1,
        TTC: 2,
        NO_VAT: 3,
      };

      const self = this;

      function p__decorateItem(index, { ...props, item, VATPart,}){
        return {
          index,
          ...props,
          item: item ? {
            ...item,
            className: `Product_${self.props.company.objectId}`,
          } : undefined,
          VATPart: VATPart ? {
            inputType: VATInputType_ID_BY_NAME[VATPart.inputType],
            ...(VATPart.value !== undefined && VATPart.value !== null ? {value: VATPart.value,} : {}),
          } : undefined,
        };
      }

      this.context.store.dispatch(
        editStartInvoice(
          obj.id,
          obj.itemsConnection.edges.map(({node}) => p__decorateItem(node.index, node)),
          {id: obj.id, company: this.props.company,})
      );

      setTimeout(() => {
        loadComponent('Invoice', () => {
          this.setState({
            modalOpen: true,
            modalType: undefined,
            obj,
            invoice: undefined,
          });
        });
      }, 150);
    });
  };

  _renderModal = () => {
    if(this.state.modalOpen === false || this.state.modalType === 'preview'){
      return (
        null
      );
    }

    switch (this.state.obj ? this.state.obj.type : 'Payment'){
      case 'Invoice':
        return (
          <InvoiceForm
            customer={this.props.customer}
            invoice={this.state.obj}
            company={this.props.company}
            viewer={this.props.viewer}
            salesAccounts={this.props.salesAccounts}
            formKey={this.state.obj.id}
            onCancel={this._close}
            onReceivePayment={this._onReceivePayment}
          />
        );
      case 'Sale':
        return (
          <SaleForm
            customer={this.props.customer}
            sale={this.state.obj}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={this.state.obj.id}
            salesAccounts={this.props.salesAccounts}
            depositsAccounts={this.props.depositsAccounts}
            onCancel={this._close}
          />
        );
      case 'Payment':
        return function(self){
          const formKey = self.state.obj ? self.state.obj.id : 'NEW';
          return (
            <PaymentForm
              customer={self.props.customer}
              invoice={self.state.invoice}
              payment={self.state.obj}
              company={self.props.company}
              viewer={self.props.viewer}
              formKey={formKey}
              // customerOpenInvoices={formKey === 'NEW' ? self.props.customerOpenInvoices : {edges: []}}
              customerOpenInvoices={self.props.customerOpenInvoices}
              salesAccounts={self.props.salesAccounts}
              depositsAccounts={self.props.depositsAccounts}
              onCancel={self._close}
              onPaymentCustomerSelected={self.props.onPaymentCustomerSelected}
              onInvoice={self._onInvoice}
            />
          );
        }(this);
    }
  };

  _onSortChange = (columnKey, dir) => {
    this.props.onSortChange(columnKey, dir);
  };

  _renderMoneyOnly(VATEnabled){
    const self = this;

    const { styles, page, selection, toggle, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const { loading, store, } = this.state;
    const rowsCount = loading ? 0 : store.getSize();
    const tableHeight = 36 + (rowsCount * 50) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 165 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 165 - 60, 956 - 245);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    return (
      <div styleName={classnames({ drawerOpen: this.props.drawerOpen, })} className={classnames({[styles['sales-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

        <div style={{}}>

          <Table
            renderRow={(Component, rowIndex, {style, className}) => {
              return (
               <div>
                  <Component
                    style={{...style, zIndex: 0}}
                    className={`${className} ${styles['table-row-container'] || ''}`}/>
                </div>
              );
            }}
            onHeaderClick={(e) => {}}
            onRowClick={(e, rowIndex) => this._openItem(rowIndex, e)}
            rowClassNameGetter={(rowIndex) => {
              const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
                [styles['new-row']]: this.props.relay.hasOptimisticUpdate(obj),
                [styles['selected']]: sel.keys[obj.id],
              });
            }}
            rowHeight={50}
            rowsCount={rowsCount}
            height={tableHeight}
            width={tableWidth}
            headerHeight={36}>

            {/* selected */}
            <Column
              columnKey={'selection'}
              align={'center'}
              header={<Cell onClick={this._onToggleAll}><input aria-checked={function(){
                switch (sel.mode) {
                  case SelectionModes.All:  return 'true';
                  case SelectionModes.None: return 'false';
                  case SelectionModes.Some: return 'mixed';
                }
              }()} onChange={e => {}} checked={sel.mode === SelectionModes.All} className={`${styles['input-on-header']} ${styles['input']}`} type='checkbox'/></Cell>}
              cell={({rowIndex, ...props}) => {
                const key = store.getObjectAt(rowIndex).id;
                return (
                 <Cell {...props} onClick={loading ? null : self._onToggle.bind(self, key)}>
                   <div><input onChange={e => {}} checked={loading ? false : sel.mode === SelectionModes.All || sel.keys[key]} className={classnames(styles['input'], { [styles['checked']]: sel.mode === SelectionModes.All || sel.keys[key], })} type='checkbox'/></div>
                 </Cell>
               );
              }}
              width={40}
            />

            {/* date */}
            <Column
              columnKey={'date'}
              align={'center'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Date'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'date'}
                  styles={styles}
                  className={sortKey === 'date' || !sortKey ? (`${styles['sort-key']} ${styles[sortDir === -1 || !sortKey ? 'sort-dir-desc' : 'sort-dir-asc']}`) : `${styles['sort-key']} ${styles['sort-dir-asc']}`}
                  columnKey={'date'}
                  sortKey={sortKey}
                  sortDir={sortKey === 'date' ? sortDir : SortTypes.DESC} onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Date'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || moment(store.getObjectAt(rowIndex).date).format('ll')}</div>
             </Cell>
           )}
              width={100}
            />

            {/* type */}
            <Column
              columnKey={'type'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Type'])}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {loading || intl.formatMessage(messages[`${store.getObjectAt(rowIndex).type}Type`])}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            {/* No */}
            <Column
              columnKey={'refNo'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_REF_NO'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || store.getObjectAt(rowIndex).refNo}</div>
             </Cell>
           )}
              width={60}
            />

            {/* Bal */}
            <Column
              columnKey={'balanceDue'}
              align={'right'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Balance'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'balanceDue'}
                  styles={styles}
                  className={sortKey === 'balanceDue' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'balanceDue'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Balance'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.balanceDue, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(0.0, {format: 'MONEY'});
                 // case 'Payment': return obj.balanceDue > 0 ? '(' + intl.formatNumber(obj.balanceDue, {format: 'MONEY'}) + ')' : intl.formatNumber(obj.balanceDue, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(obj.balanceDue, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* totalHT */}
            {VATEnabled && <Column
              columnKey={'totalHT'}
              align={'right'}
              header={(
                <SortHeaderCell
                  key={'totalHT'}
                  styles={styles}
                  className={sortKey === 'totalHT' || sortKey === getSortKey('totalHT') ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'totalHT'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Total_HT'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.totalHT, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(obj.totalHT, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(-1 * obj.total, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* VAT */}
            {VATEnabled && <Column
              columnKey={'VAT'}
              align={'right'}
              header={(
                <SortHeaderCell
                  key={'VAT'}
                  styles={styles}
                  className={sortKey === 'VAT' || sortKey === getSortKey('VAT') ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'VAT'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_VAT'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.VAT, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(obj.VAT, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(0.0, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* Total */}
            <Column
              columnKey={'total'}
              align={'right'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Total'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'total'}
                  styles={styles}
                  className={sortKey === 'total' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'total'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Total'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.totalAmount, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(obj.total, {format: 'MONEY'});
                //  case 'Payment': return obj.total > 0 ? '(' + intl.formatNumber(obj.total, {format: 'MONEY'}) + ')' : intl.formatNumber(obj.total, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(obj.totalAmountReceived, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* LATEST PAYMENT */}
            <Column
              columnKey={'latestPayment'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Lastest_Payment'])}</Cell>}
              // header={(
              //   <SortHeaderCell
              //     key={'latestPayment'}
              //     styles={styles}
              //     className={sortKey === 'dueDate' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
              //     columnKey={'dueDate'}
              //     sortKey={sortKey}
              //     sortDir={sortDir}
              //     onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Lastest_Payment'])}
              //   </SortHeaderCell>
              // )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return obj.paymentsConnection.latestPayment ? moment(obj.paymentsConnection.latestPayment.date).format('ll') : null;
                 case 'Payment': return moment(obj.date).format('ll');
                 case 'Sale':    return null;
               }
             }()}</div>
             </Cell>
           )}
              width={80}
              flexGrow={1}
            />

            {/* Status */}
            <Column
              columnKey={'status'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Status'])}</Cell>}
              cell={({rowIndex, ...props}) => {
                const obj = loading ? null : store.getObjectAt(rowIndex);
                return (
                 <Cell {...props}>
                  <div
                    className={`${styles['field-status']} ${styles[loading || obj.status.toLowerCase()] || ''}`}>
                    {loading || function(){
                      const obj = store.getObjectAt(rowIndex);
                      switch(obj.type){
                        case 'Invoice': return intl.formatMessage(messages[`InvoiceStatus${obj.status}`]);
                        case 'Payment': return intl.formatMessage(messages[`PaymentStatus${obj.status}`]);
                        case 'Sale':    return intl.formatMessage(messages[`SaleStatus${obj.status}`]);
                      }
                    }()}
                  </div>
                 </Cell>
               )
              }}
              width={100}
            />

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Action'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
              <div style={{ zIndex: 2, paddingLeft: 12, }} className={'row-actions'}>
                {renderActions(this, { intl, store, rowIndex, })}

              </div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

          </Table>

        </div>

        {loading ? null : isEmpty && <div style={{}}>
          <Empty message={intl.formatMessage(messages.noData)} styles={this.props.styles}/>
        </div>}

        {loading && <div style={{}}>
          <Loading/>
        </div>}

        {this._renderModal()}
        {this.previewModal()}

      </div>
    );
  }

  _renderInvoicesOnly(VATEnabled){
    const self = this;
    const { styles, page, selection, toggle, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const { loading, store, } = this.state;
    const rowsCount = loading ? 0 : store.getSize();
    const tableHeight = 36 + (rowsCount * 50) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 165 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 165 - 60, 956 - 245);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    return (
      <div styleName={classnames({ drawerOpen: this.props.drawerOpen, })} className={classnames({[styles['sales-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

        <div style={{}}>

          <Table
            renderRow={(Component, rowIndex, {style, className}) => {
              return (
               <div>
                  <Component
                    style={{...style, zIndex: 0}}
                    className={`${className} ${styles['table-row-container'] || ''}`}/>
                </div>
              );
            }}
            onHeaderClick={(e) => {}}
            onRowClick={(e, rowIndex) => this._openItem(rowIndex, e)}
            rowClassNameGetter={(rowIndex) => {
              const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
                [styles['new-row']]: this.props.relay.hasOptimisticUpdate(obj),
                [styles['selected']]: sel.keys[obj.id],
              });
            }}
            rowHeight={50}
            rowsCount={rowsCount}
            height={tableHeight}
            width={tableWidth}
            headerHeight={36}>

            {/* selected */}
            <Column
              columnKey={'selection'}
              align={'center'}
              header={<Cell onClick={this._onToggleAll}><input aria-checked={function(){
                switch (sel.mode) {
                  case SelectionModes.All: return 'true';
                  case SelectionModes.None: return 'false';
                  case SelectionModes.Some: return 'mixed';
                }
              }()} onChange={e => {}} checked={sel.mode === SelectionModes.All} className={`${styles['input-on-header']} ${styles['input']}`} type='checkbox'/></Cell>}
              cell={({rowIndex, ...props}) => {
                const key = store.getObjectAt(rowIndex).id;
                return (
                 <Cell {...props} onClick={loading ? null : self._onToggle.bind(self, key)}>
                   <div><input onChange={e => {}} checked={loading ? false : sel.mode === SelectionModes.All || sel.keys[key]} className={classnames(styles['input'], { [styles['checked']]: sel.mode === SelectionModes.All || sel.keys[key], })} type='checkbox'/></div>
                 </Cell>
               );
              }}
              width={40}
            />

            {/* date */}
            <Column
              columnKey={'date'}
              align={'center'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Date'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'date'}
                  styles={styles}
                  className={sortKey === 'date' || !sortKey ? (`${styles['sort-key']} ${styles[sortDir === -1 || !sortKey ? 'sort-dir-desc' : 'sort-dir-asc']}`) : `${styles['sort-key']} ${styles['sort-dir-asc']}`}
                  columnKey={'date'}
                  sortKey={sortKey}
                  sortDir={sortKey === 'date' ? sortDir : SortTypes.DESC} onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Date'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || moment(store.getObjectAt(rowIndex).date).format('ll')}</div>
             </Cell>
           )}
              width={100}
            />

            {/* No */}
            <Column
              columnKey={'refNo'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_REF_NO'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || store.getObjectAt(rowIndex).refNo}</div>
             </Cell>
           )}
              width={60}
            />

            {/* dueDate */}
            <Column
              columnKey={'dueDate'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_DueDate'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return moment(obj.dueDate).format('ll');
                 case 'Payment': return moment(obj.date).format('ll');
                 default:        return null;
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Age */}
            <Column
              columnKey={'age'}
              align={'right'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Age'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'age'}
                  styles={styles}
                  className={sortKey === 'dueDate' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'dueDate'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Age'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return function(){
                   switch (obj.status) {
                     case 'Overdue': return Math.abs(moment().diff(moment(obj.dueDate), 'days'));
                     default:        return null;
                   }
                 }();
                 default: return null;
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Bal */}
            <Column
              columnKey={'balanceDue'}
              align={'right'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Balance'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'balanceDue'}
                  styles={styles}
                  className={sortKey === 'balanceDue' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'balanceDue'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Balance'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.balanceDue, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(0.0, {format: 'MONEY'});
                //  case 'Payment': return obj.balanceDue > 0 ? '(' + intl.formatNumber(obj.balanceDue, {format: 'MONEY'}) + ')' : intl.formatNumber(obj.balanceDue, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(obj.balanceDue, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* totalHT */}
            {VATEnabled && <Column
              columnKey={'totalHT'}
              align={'right'}
              header={(
                <SortHeaderCell
                  key={'totalHT'}
                  styles={styles}
                  className={sortKey === 'totalHT' || sortKey === getSortKey('totalHT') ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'totalHT'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Total_HT'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.totalHT, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(obj.totalHT, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(-1 * obj.total, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* VAT */}
            {VATEnabled && <Column
              columnKey={'VAT'}
              align={'right'}
              header={(
                <SortHeaderCell
                  key={'VAT'}
                  styles={styles}
                  className={sortKey === 'VAT' || sortKey === getSortKey('VAT') ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'VAT'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_VAT'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.VAT, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(obj.VAT, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(0.0, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* Total */}
            <Column
              columnKey={'total'}
              align={'right'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Total'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'total'}
                  styles={styles}
                  className={sortKey === 'total' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'total'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Total'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.totalAmount, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(obj.total, {format: 'MONEY'});
                //  case 'Payment': return obj.total > 0 ? '(' + intl.formatNumber(obj.total, {format: 'MONEY'}) + ')' : intl.formatNumber(obj.total, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(obj.totalAmountReceived, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Status */}
            <Column
              columnKey={'status'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Status'])}</Cell>}
              cell={({rowIndex, ...props}) => {
                const obj = loading ? null : store.getObjectAt(rowIndex);
                return (
                 <Cell {...props}>
                  <div
                    className={`${styles['field-status']} ${styles[loading || obj.status.toLowerCase()] || ''}`}>
                    {loading || function(){
                      const obj = store.getObjectAt(rowIndex);
                      switch(obj.type){
                        case 'Invoice': return intl.formatMessage(messages[`InvoiceStatus${obj.status}`]);
                        case 'Payment': return intl.formatMessage(messages[`PaymentStatus${obj.status}`]);
                        case 'Sale':    return intl.formatMessage(messages[`SaleStatus${obj.status}`]);
                      }
                    }()}
                  </div>
                 </Cell>
               )
              }}
              width={100}
            />

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Action'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
              <div style={{ zIndex: 2, paddingLeft: 12, }} className={'row-actions'}>
                {renderActions(this, { intl, store, rowIndex, })}

              </div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

          </Table>

        </div>

        {loading ? null : isEmpty && <div style={{}}>
          <Empty message={intl.formatMessage(messages.noData)} styles={this.props.styles}/>
        </div>}

        {loading && <div style={{}}>
          <Loading/>
        </div>}

        {this._renderModal()}
        {this.previewModal()}

      </div>
    );
  }

  render(){
    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    const VATEnabled = this.props.topLoading ? false : this.props.company.VATSettings.enabled;

    const isOnlyPayments =  type === 'recent' || type === 'money' || type === 'payments' || type === 'sales';
    if(isOnlyPayments){
      return this._renderMoneyOnly(VATEnabled);
    }

    const isOnlyInvoices = type === 'invoices';
    if(isOnlyInvoices){
      return this._renderInvoicesOnly(VATEnabled);
    }

    return this._renderNormal(VATEnabled);
  }

  _renderNormal(VATEnabled){
    const self = this;
    const { styles, page, selection, toggle, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const { loading, store, } = this.state;
    const rowsCount = loading ? 0 : store.getSize();
    const tableHeight = 36 + (rowsCount * 50) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 165 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 165 - 60, 956 - 245);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    const isOnlyPayments = type === 'money' || type === 'payments' || type === 'sales';
    const isOnlyInvoices = type === 'recent' || type === 'invoices';

    return (
      <div styleName={classnames({ drawerOpen: this.props.drawerOpen, })} className={classnames({[styles['sales-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

        <div style={{}}>

          <Table
            renderRow={(Component, rowIndex, {style, className}) => {
              return (
               <div>
                  <Component
                    style={{...style, zIndex: 0}}
                    className={`${className} ${styles['table-row-container'] || ''}`}/>
                </div>
              );
            }}
            onHeaderClick={(e) => {}}
            onRowClick={(e, rowIndex) => this._openItem(rowIndex, e)}
            rowClassNameGetter={(rowIndex) => {
              const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
                [styles['new-row']]: this.props.relay.hasOptimisticUpdate(obj),
                [styles['selected']]: sel.keys[obj.id],
              });
            }}
            rowHeight={50}
            rowsCount={rowsCount}
            height={tableHeight}
            width={tableWidth}
            headerHeight={36}>

            {/* selected */}
            <Column
              columnKey={'selection'}
              align={'center'}
              header={<Cell onClick={this._onToggleAll}><input aria-checked={function(){
                switch (sel.mode) {
                  case SelectionModes.All: return 'true';
                  case SelectionModes.None: return 'false';
                  case SelectionModes.Some: return 'mixed';
                }
              }()} onChange={e => {}} checked={sel.mode === SelectionModes.All} className={`${styles['input-on-header']} ${styles['input']}`} type='checkbox'/></Cell>}
              cell={({rowIndex, ...props}) => {
                const key = store.getObjectAt(rowIndex).id;
                return (
                 <Cell {...props} onClick={loading ? null : self._onToggle.bind(self, key)}>
                   <div><input onChange={e => {}} checked={loading ? false : sel.mode === SelectionModes.All || sel.keys[key]} className={classnames(styles['input'], { [styles['checked']]: sel.mode === SelectionModes.All || sel.keys[key], })} type='checkbox'/></div>
                 </Cell>
               );
              }}
              width={40}
            />

            {/* date */}
            <Column
              columnKey={'date'}
              align={'center'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Date'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'date'}
                  styles={styles}
                  className={sortKey === 'date' || !sortKey ? (`${styles['sort-key']} ${styles[sortDir === -1 || !sortKey ? 'sort-dir-desc' : 'sort-dir-asc']}`) : `${styles['sort-key']} ${styles['sort-dir-asc']}`}
                  columnKey={'date'}
                  sortKey={sortKey}
                  sortDir={sortKey === 'date' ? sortDir : SortTypes.DESC} onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Date'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || moment(store.getObjectAt(rowIndex).date).format('ll')}</div>
             </Cell>
           )}
              width={100}
            />

            {/* type */}
            <Column
              columnKey={'type'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Type'])}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {loading || intl.formatMessage(messages[`${store.getObjectAt(rowIndex).type}Type`])}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            {/* No */}
            <Column
              columnKey={'refNo'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_REF_NO'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || store.getObjectAt(rowIndex).refNo}</div>
             </Cell>
           )}
              width={60}
            />

            {/* dueDate */}
            <Column
              columnKey={'dueDate'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_DueDate'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return moment(obj.dueDate).format('ll');
                 case 'Payment': return moment(obj.date).format('ll');
                 default:        return '';
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Bal */}
            <Column
              columnKey={'balanceDue'}
              align={'right'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Balance'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'balanceDue'}
                  styles={styles}
                  className={sortKey === 'balanceDue' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'balanceDue'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Balance'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.balanceDue, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(0.0, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(obj.balanceDue, {format: 'MONEY'});
                //  case 'Payment': return obj.balanceDue > 0 ? '(' + intl.formatNumber(obj.balanceDue, {format: 'MONEY'}) + ')' : intl.formatNumber(obj.balanceDue, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* totalHT */}
            {VATEnabled && <Column
              columnKey={'totalHT'}
              align={'right'}
              header={(
                <SortHeaderCell
                  key={'totalHT'}
                  styles={styles}
                  className={sortKey === 'totalHT' || sortKey === getSortKey('totalHT') ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'totalHT'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Total_HT'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.totalHT, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(obj.totalHT, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(-1 * obj.total, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* VAT */}
            {VATEnabled && <Column
              columnKey={'VAT'}
              align={'right'}
              header={(
                <SortHeaderCell
                  key={'VAT'}
                  styles={styles}
                  className={sortKey === 'VAT' || sortKey === getSortKey('VAT') ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'VAT'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_VAT'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.VAT, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(obj.VAT, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(0.0, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* Total */}
            <Column
              columnKey={'total'}
              align={'right'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Total'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'total'}
                  styles={styles}
                  className={sortKey === 'total' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'total'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Total'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Invoice': return intl.formatNumber(obj.totalAmount, {format: 'MONEY'});
                 case 'Payment': return intl.formatNumber(obj.total, {format: 'MONEY'});
                //  case 'Payment': return obj.total > 0 ? '(' + intl.formatNumber(obj.total, {format: 'MONEY'}) + ')' : intl.formatNumber(obj.total, {format: 'MONEY'});
                 case 'Sale':    return intl.formatNumber(obj.totalAmountReceived, {format: 'MONEY'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Status */}
            <Column
              columnKey={'status'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Status'])}</Cell>}
              cell={({rowIndex, ...props}) => {
                const obj = loading ? null : store.getObjectAt(rowIndex);
                return (
                 <Cell {...props}>
                  <div
                    className={`${styles['field-status']} ${styles[loading || obj.status.toLowerCase()] || ''}`}>
                    {loading || function(){
                      const obj = store.getObjectAt(rowIndex);
                      switch(obj.type){
                        case 'Invoice': return intl.formatMessage(messages[`InvoiceStatus${obj.status}`]);
                        case 'Payment': return intl.formatMessage(messages[`PaymentStatus${obj.status}`]);
                        case 'Sale':    return intl.formatMessage(messages[`SaleStatus${obj.status}`]);
                      }
                    }()}
                  </div>
                 </Cell>
               )
              }}
              width={100}
            />

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Action'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
              <div style={{ zIndex: 2, paddingLeft: 12, }} className={'row-actions'}>
                {renderActions(this, { intl, store, rowIndex, })}

              </div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

          </Table>

        </div>

        {loading ? null : isEmpty && <div style={{}}>
          <Empty message={intl.formatMessage(messages.noData)} styles={this.props.styles}/>
        </div>}

        {loading && <div style={{}}>
          <Loading/>
        </div>}

        {this._renderModal()}
        {this.previewModal()}

      </div>
    );
  }
}

function decoratePaymentItem({ id, amount, invoice: { id: invoiceId, objectId, date, dueDate, memo, refNo, itemsConnection, paymentsConnection, }, }){
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;
  const obj = {
    __selected: true,
    __existed: true,
    __originalAmount: amount,
    id,
    amount: amount,
    invoice: {
      id,
      objectId,
      refNo,
      total: itemsConnection.totalAmount,
      balanceDue,
      amountReceived: paymentsConnection.totalAmountReceived,
      date,
      dueDate,
      memo,
    },
  }

  return obj;
}

function decorateInvoice({ objectId, __dataID__, totalHT, VAT, id, refNo, customer, billingAddress, terms, inputType, date, dueDate, discountType, discountValue, itemsConnection, paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;

  function calcInvoiceStatus() {
    // const _date = moment(date);
    const _dueDate = moment(dueDate);
    const now = moment();

    const isPaidInFull = balanceDue === 0.0;

    if(isPaidInFull){
      return 'Closed';
    }

    if(_dueDate.isBefore(now)){
      return 'Overdue';
    }

    // const hasPayment = paymentsConnection.totalAmountReceived !== 0;
    //
    // if(hasPayment){
    //   return 'Partial';
    // }

    return 'Open';
  }

  return {
    __dataID__,
    id,
    terms,
    date,
    billingAddress,
    type: 'Invoice',
    refNo: parseInt(refNo),
    customer,
    dueDate,
    discountType, discountValue,
    totalAmount: itemsConnection.totalAmount,
    balanceDue,
    total: itemsConnection.totalAmount,
    totalAmountReceived: paymentsConnection.totalAmountReceived,
    status: calcInvoiceStatus(),
    memo, files,
    totalHT, VAT,
    inputType,
    itemsConnection,
    paymentsConnection,
    objectId,
  };
}

function Empty({styles, message, hasFilter,}) {

  return (
    <div className={styles.empty} style={{}}>

      <div className={styles.emptyCenter}>

        <div className={styles.emptyIcon}>
          <i style={{ color: '#343445', width:'80', height:'80', fontSize: '80px', }} className='material-icons md-light'>
            perm_media
          </i>
        </div>

        <div className={styles.emptyTitle}>{message}</div>

        {/*

         <div className={styles.description}>Add a row to store an object in this class</div>

         <a href='javascript:;' onClick={onNew} role='button' className={`${styles.button} unselectable primary`}>
         <span>Add a row</span>
         </a>

         */}

      </div>

    </div>
  )
};

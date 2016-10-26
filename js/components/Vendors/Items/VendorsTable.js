import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import classnames from 'classnames';

import stopEvent from '../../../utils/stopEvent';

import {
  intlShape,
} from 'react-intl';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import DropdownMenu from 'react-bootstrap/lib/DropdownMenu';
import MenuItem from 'react-bootstrap/lib/MenuItem';
// import Dropdown from 'react-bootstrap/lib/Dropdown';
// import SplitButton from 'react-bootstrap/lib/SplitButton';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

import BillForm from '../../Expenses/BillForm/BillForm';
import ExpenseForm from '../../Expenses/ExpenseForm/ExpenseForm';
import PaymentForm from '../../Expenses/PaymentForm/PaymentForm';

import OverlayMenu from '../../utils/OverlayMenu';

const DEFAULT_ACTIONS = obj => ({
  main: 'bill',
  actions: [
    'expense',
    'payment',
    obj.active ? 'inactive' : 'active'
  ],
});

const HAS_OPEN_ACTIONS = obj => ({
  main: 'payment',
  actions: [
    'bill',
    'expense',
    obj.active ? 'inactive' : 'active'
  ],
});

function getActionsStyle(rowIndex){
  return {
    display: 'block',
    width: 225,
    top: 149 + (rowIndex * 59),
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
  const { main, actions, } = (obj.expensesStatus ? obj.expensesStatus.open.totalCount : 0) > 0
    ? HAS_OPEN_ACTIONS(obj)
    : DEFAULT_ACTIONS(obj);
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

// import {sortMostRecent,} from '../../utils/sort';

import Loading from '../../Loading/Loading';

const SortTypes = {
  ASC: 1,
  DESC: -1,
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
  // constructor(props, context){
  //   super(props, context);
  //   this.state = {
  //     sortDir: this.props.sortDir,
  //   };
  // }
  // componentWillReceiveProps(nextProps){
  //   if(this.state.sortDir !== nextProps.sortDir){
  //     this.setState({
  //       sortDir: nextProps.sortDir,
  //     });
  //   }
  // }
  // shouldComponentUpdate(nextProps, nextState){
  //   return (
  //     this.state.sortDir !== nextProps.sortDir ||
  //     nextState.sortDir !== nextProps.sortDir
  //   );
  // }
  render() {
    const { sortDir, sortKey, columnKey, className, styles, children, ...props, } = this.props;
    return (
      <Cell {...props} onClick={this._onSortChange} className={classnames(className, { [styles['has-key']]: sortKey === columnKey || sortKey === getSortKey(columnKey) || (columnKey === 'date' && !sortKey), })} columnKey={columnKey}>
        <a>
          {children} <span className={styles['sort-dir']}>{sortDir === SortTypes.DESC || getSortKey(columnKey) !== sortKey ? '↓' : '↑'}</span>
        </a>
      </Cell>
    );
  }

  _onSortChange = (e) => {
    stopEvent(e);

    // this.setState({
    //   sortDir: this.props.sortDir ?
    //     reverseSortDirection(this.props.sortDir) :
    //     SortTypes.DESC
    // }, () => {

      if (this.props.onSortChange) {
        this.props.onSortChange(
          getSortKey(this.props.columnKey),
          this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.ASC
        );
      }
    // });

  };
}

function getSortKey(columnKey){
  switch (columnKey) {
    case 'age':           return 'dueDate';
    case 'latestPayment': return 'latestPaymentDate';
    case 'balanceDue':    return 'openBalance';
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

import {editStart as editStartBill} from '../../../redux/modules/v2/bills';
import {editStart as editStartPayment} from '../../../redux/modules/v2/paymentsOfBills';
import {editStart as editStartExpense} from '../../../redux/modules/v2/expenses';

import requiredPropType from 'react-prop-types/lib/all';

import { Modes as SelectionModes, } from '../../../redux/modules/selection';

export default class ExpensesTable extends React.Component{

  static displayName = 'VendorsExpensesTable';

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
    bodyWidth: PropTypes.number.isRequired,
    topLoading: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    selection: PropTypes.objectOf(PropTypes.shape({
      mode: PropTypes.oneOf(Object.keys(SelectionModes).map(key => SelectionModes[key])).isRequired,
      keys: PropTypes.objectOf(
        PropTypes.bool.isRequired
      ).isRequired,
    })).isRequired,
    toggle: PropTypes.func.isRequired,
    toggleAll: PropTypes.func.isRequired,
    toggleNone: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  _onMainAction = (obj, type, e) => {
    stopEvent(e);

    switch (type) {
      case 'bill':
        this.context.store.dispatch(
          editStartBill(
            'NEW',
            [],
            {id: 'NEW', company: this.props.company,})
        );
        break;

      // case 'expense':
      //   this.context.store.dispatch(
      //     editStartExpense(
      //       'NEW',
      //       [],
      //       {id: 'NEW', company: this.props.company,})
      //   );
      //   break;

      case 'payment':
        this.context.store.dispatch(
          editStartPayment(
            'NEW',
            [],
            {id: 'NEW', company: this.props.company,})
        );
        setImmediate(() => {
          this.props.onReceivePayment(obj);
        });
        break;

      default:

        throw 'Invalid Operation';
    }

    this.setState({
      modalOpen: true,
      modalType: type,
      payee: obj,
    });
  };

  _onAction = (type, obj) => {

    let showModal = true;

    switch (type) {
      case 'bill':
        this.context.store.dispatch(
          editStartBill(
            'NEW',
            [],
            {id: 'NEW', company: this.props.company,})
        );
        break;

      case 'expense':
        this.context.store.dispatch(
          editStartExpense(
            'NEW',
            [],
            {id: 'NEW', company: this.props.company,})
        );
        break;

      case 'payment':
        this.context.store.dispatch(
          editStartPayment(
            'NEW',
            [],
            {id: 'NEW', company: this.props.company,})
        );
        setImmediate(() => {
          this.props.onReceivePayment(obj);
        });
        break;

      case 'active':
        showModal = false;

        this.props.onActivate(obj);
        break;

      case 'inactive':
        showModal = false;

        this.props.onDeactivate(obj);
        break;

      default:

        throw 'Invalid Operation';
    }

    showModal && this.setState({
      modalOpen: true,
      modalType: type,
      payee: obj,
    });
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      modalOpen: false,
      loading: this.props.topLoading,
      store: new OperationDataListStore({
        vendors: this.props.topLoading ? [] : this.props.vendors,
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
        vendors: nextProps.topLoading ? [] : nextProps.vendors,
        count: nextProps.count,
      }),
    });

  }

  _close = (btn, e) => {
    stopEvent(e);

    this.setState({
      modalOpen: false,
      obj: undefined,
      bill: undefined,
    })
  };

  _openItem = (rowIndex, e) => {
    stopEvent(e);

    // const { store, } = this.state;
    //
    // const obj = store.getObjectAt(rowIndex);
    //
    // switch (obj.type) {
    //   case 'Bill':
    //     this.context.store.dispatch(
    //       editStartBill(
    //         obj.id,
    //         obj.itemsConnection.edges.map(({node}) => node),
    //         {id: obj.id, company: this.props.company,})
    //     );
    //     break;
    //
    //   case 'Expense':
    //     this.context.store.dispatch(
    //       editStartExpense(
    //         obj.id,
    //         obj.itemsConnection.edges.map(({node}) => node),
    //         {id: obj.id, company: this.props.company,})
    //     );
    //     break;
    //
    //   case 'Payment':
    //     this.context.store.dispatch(
    //       editStartPayment(
    //         obj.id,
    //         obj.itemsConnection.edges.map(({node}) => decoratePaymentItem(node)),
    //         {id: obj.id, company: this.props.company,})
    //     );
    //     setImmediate(() => {
    //       this.props.onReceivePayment(obj.vendor);
    //     });
    //     break;
    //
    //   default:
    //
    //     throw 'Invalid Operation';
    // }
    //
    // this.setState({
    //   modalOpen: true,
    //   obj,
    // });
  };

  _openLink = (obj) => {
    // this.context.router.push({
    //   pathname: `/apps/${this.props.company.id}/vendor/${obj.objectId}`,
    //   state: {},
    // });

    this.props.goToVendor(obj);
  };

  onOpenBills = (obj, e) => {
    stopEvent(e);

    localStorage.setItem('vendor.type', 'open');
    localStorage.setItem('vendor.status', 'open');

    this.props.goToVendor(obj);
  };

  onOverdueBills = (obj, e) => {
    stopEvent(e);

    localStorage.setItem('vendor.type', 'overdue');
    localStorage.setItem('vendor.status', 'overdue');

    this.props.goToVendor(obj);
  };

  _onToggleAll = (e) => {
    const { selection, page, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    stopEvent(e);
    sel.mode === SelectionModes.None || sel.mode === SelectionModes.Some
      ? toggleAll('vendors', page)
      : toggleNone('vendors', page);
  };

  _onToggle = (id, e) => {
    const { page, toggle, } = this.props;
    stopEvent(e);
    toggle('vendors', { key: id, page, }, this.state.store.getSize());
  };

  _onReceivePayment = (bill) => {
    this.context.store.dispatch(
      editStartPayment(
        'NEW',
        [],
        {id: 'NEW', company: this.props.company,})
    );

    setImmediate(() => {
      this.props.onReceivePayment(bill.payee);
    });

    this.setState({
      modalOpen: true,
      obj: undefined,
      modalType: undefined,
      bill,
    });
  };

  _onBill = (obj) => {
    this.setState({
      modalOpen: false,
      obj: undefined,
      modalType: undefined,
      bill: undefined,
    }, () => {
      obj = decorateBill(obj);

      this.context.store.dispatch(
        editStartBill(
          obj.id,
          obj.itemsConnection.edges.map(({node}) => node),
          {id: obj.id, company: this.props.company,})
      );

      setTimeout(() => {
        this.setState({
          modalOpen: true,
          obj,
          modalType: undefined,
          bill: undefined,
        });
      }, 150);
    });
  };

  _renderModal = () => {
    if(!this.state.modalOpen){
      return (
        null
      );
    }

    if(typeof this.state.modalType !== 'undefined'){
      switch (this.state.modalType) {
        case 'bill':
        return (
          <BillForm
            payee={this.state.payee}
            company={this.props.company}
            viewer={this.props.viewer}
            expensesAccounts={this.props.expensesAccounts}
            formKey={'NEW'}
            onCancel={this._close}
            onReceivePayment={this._onReceivePayment}
          />
        );
        case 'expense':
        return (
          <ExpenseForm
            payee={this.state.payee}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'}
            expensesAccounts={this.props.expensesAccounts}
            depositsAccounts={this.props.depositsAccounts}
            onCancel={this._close}
          />
        );
        case 'payment':
        return function(self){
          return (
            <PaymentForm
              payee={self.state.payee}
              company={self.props.company}
              viewer={self.props.viewer}
              formKey={'NEW'}
              vendorOpenBills={self.props.vendorOpenBills}
              expensesAccounts={self.props.expensesAccounts}
              depositsAccounts={self.props.depositsAccounts}
              onCancel={self._close}
              onPaymentVendorSelected={self.props.onPaymentVendorSelected}
            />
          );
        }(this);
      }

      throw 'Invalid modalType';
    }

    switch (this.state.obj ? this.state.obj.type : 'Payment'){
      case 'Bill':
        return (
          <BillForm
            bill={this.state.obj}
            company={this.props.company}
            viewer={this.props.viewer}
            expensesAccounts={this.props.expensesAccounts}
            formKey={this.state.obj.id}
            onCancel={this._close}
            onReceivePayment={this._onReceivePayment}
          />
        );
      case 'Expense':
        return (
          <ExpenseForm
            expense={this.state.obj}
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={this.state.obj.id}
            expensesAccounts={this.props.expensesAccounts}
            depositsAccounts={this.props.depositsAccounts}
            onCancel={this._close}
          />
        );
      case 'Payment':
        return function(self){
          const formKey = self.state.obj ? self.state.obj.id : 'NEW';
          return (
            <PaymentForm
              bill={self.state.bill}
              payment={self.state.obj}
              company={self.props.company}
              viewer={self.props.viewer}
              formKey={formKey}
              // vendorOpenBills={formKey === 'NEW' ? self.props.vendorOpenBills : {edges: []}}
              vendorOpenBills={self.props.vendorOpenBills}
              expensesAccounts={self.props.expensesAccounts}
              depositsAccounts={self.props.depositsAccounts}
              onCancel={self._close}
              onPaymentVendorSelected={self.props.onPaymentVendorSelected}
              onBill={self._onBill}
            />
          );
        }(this);
    }
  };

  _onSortChange = (columnKey, dir) => {
    this.props.onSortChange(columnKey, dir);
  }

  render(){
    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    const isOnlyBills = type === 'bills';
    if(isOnlyBills){
      return this._renderBillsOnly();
    }

    return this._renderNormal();
  }

  _renderNormal(){
    const self = this;
    const { styles, page, selection, toggle, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const { loading, store, } = this.state;
    const rowsCount = loading ? 0 : store.getSize();
    const tableHeight = 36 + (rowsCount * 59) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 165 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 165 - 60, 956);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    return (
      <div className={classnames({[styles['vendors-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

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
            rowHeight={59}
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

            {/* displayName */}
            <Column
              columnKey={'displayName'}
              align={'left'}
              header={(
                <SortHeaderCell
                  key={'displayName'}
                  styles={styles}
                  className={sortKey === 'displayName' || !sortKey ? (`${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}`) : `${styles['sort-key']} ${styles['sort-dir-asc']}`}
                  columnKey={'displayName'}
                  sortKey={sortKey}
                  sortDir={sortKey === 'displayName' ? sortDir : SortTypes.DESC} onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_CUSTOMER'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(self){
               const obj = store.getObjectAt(rowIndex);
               return (
                 <a style={{ fontWeight: 'bolder', color: '#000000', ...(obj.active ? {} : { opacity: 0.5, }), }} className={styles['link']} onClick={e => { stopEvent(e), self._openLink(obj); }}>{obj.displayName}</a>
               );
             }(this)}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* tel */}
            <Column
              columnKey={'tel'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Tel'])}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {loading || store.getObjectAt(rowIndex).tel}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            {/* email */}
            <Column
              columnKey={'email'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Email'])}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {loading || store.getObjectAt(rowIndex).email}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            {/* Bal */}
            <Column
              columnKey={'balanceDue'}
              align={'right'}
              header={(
                <SortHeaderCell
                  key={'balanceDue'}
                  styles={styles}
                  className={sortKey === 'balanceDue' || sortKey === getSortKey('balanceDue') ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
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
               return intl.formatNumber(obj.expensesStatus ? obj.expensesStatus.open.amount : 0.0, { format: 'MAD', });
             }()}</div>
             </Cell>
           )}
              width={150}
            />

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'right'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Actions'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
              <div style={{zIndex: 2}} className={'row-actions'}>

              {renderActions(this, { intl, store, rowIndex, })}

              </div>
             </Cell>
           )}
              width={225}
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

      </div>
    );
  }


  _renderBillsOnly(){
    const self = this;
    const { styles, page, selection, toggle, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const { loading, store, } = this.state;
    const rowsCount = loading ? 0 : store.getSize();
    const tableHeight = 36 + (rowsCount * 59) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 165 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 165 - 60, 956);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    return (
      <div className={classnames({[styles['vendors-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

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
            rowHeight={59}
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

            {/* displayName */}
            <Column
              columnKey={'displayName'}
              align={'left'}
              header={(
                <SortHeaderCell
                  key={'displayName'}
                  styles={styles}
                  className={sortKey === 'displayName' || !sortKey ? (`${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}`) : `${styles['sort-key']} ${styles['sort-dir-asc']}`}
                  columnKey={'displayName'}
                  sortKey={sortKey}
                  sortDir={sortKey === 'displayName' ? sortDir : SortTypes.DESC} onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_CUSTOMER'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(self){
               const obj = store.getObjectAt(rowIndex);
               return (
                 <a style={{ fontWeight: 'bolder', color: '#000000', ...(obj.active ? {} : { opacity: 0.5, }), }} className={styles['link']} onClick={e => { stopEvent(e), self._openLink(obj); }}>{obj.displayName}</a>
               );
             }(this)}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* tel */}
            <Column
              columnKey={'tel'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Tel'])}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {loading || store.getObjectAt(rowIndex).tel}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            {/* email */}
            <Column
              columnKey={'email'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Email'])}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {loading || store.getObjectAt(rowIndex).email}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            {/* Open bills */}
            <Column
              columnKey={'open'}
              align={'left'}
              header={(
                <SortHeaderCell
                  key={'open'}
                  styles={styles}
                  className={sortKey === 'open' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'open'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Open_Bills'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(self){
               const obj = store.getObjectAt(rowIndex);
               return (
                 <div>

                   <a style={{ display: 'inline-block', }} className={styles['link-2']} onClick={self.onOpenBills.bind(self, obj)}>{intl.formatMessage(messages['Open_Bills'], { count: obj.expensesStatus ? obj.expensesStatus.open.totalCount : 0, })}
                   </a>

                   {(obj.expensesStatus ? obj.expensesStatus.overdue.totalCount : 0) > 0 ? <a style={{ marginLeft: 3, display: 'inline-block', }} className={styles['link-2']} onClick={self.onOverdueBills.bind(self, obj)}>({intl.formatMessage(messages['Overdue_Bills'], { count: obj.expensesStatus ? obj.expensesStatus.overdue.totalCount : 0, })})
                   </a> : null}

                 </div>
               );
             }(this)}</div>
             </Cell>
           )}
              width={150}
              flexGrow={1}
            />

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'right'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Actions'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
              <div style={{zIndex: 2}} className={'row-actions'}>

              {renderActions(this, { intl, store, rowIndex, })}

              </div>
             </Cell>
           )}
              width={225}
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

      </div>
    );
  }

  // render(){
  //   const self = this;
  //   const { styles, page, selection, toggle, toggleAll, toggleNone, } = this.props;
  //   const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
  //   const { intl, } = this.context;
  //
  //   const { loading, store, } = this.state;
  //   const rowsCount = loading ? 0 : store.getSize();
  //   const tableHeight = 36 + (rowsCount * 59) + 2;
  //   // const bodyWidth = Math.max(956,
  //   //   this.props.bodyWidth - 165 - 60
  //   // )
  //   // ;
  //   const bodyWidth = Math.max(this.props.bodyWidth - 165 - 60, 956);
  //   const tableWidth = bodyWidth - 1;
  //
  //   const isEmpty = rowsCount === 0;
  //
  //   const {
  //     type,
  //     status,
  //     limit,
  //     sortKey, sortDir,
  //   } = this.props.filterArgs;
  //
  //   return (
  //     <div className={classnames({[styles['vendors-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>
  //
  //       <div style={{}}>
  //
  //         <Table
  //           renderRow={(Component, rowIndex, {style, className}) => {
  //             return (
  //              <div>
  //                 <Component
  //                   style={{...style, zIndex: 0}}
  //                   className={`${className} ${styles['table-row-container'] || ''}`}/>
  //               </div>
  //             );
  //           }}
  //           onHeaderClick={(e) => {}}
  //           onRowClick={(e, rowIndex) => this._openItem(rowIndex, e)}
  //           rowClassNameGetter={(rowIndex) => {
  //             const obj = store.getObjectAt(rowIndex);
  //             return classnames(`${styles.row} table-row`, {
  //               [styles['first-row'] || '']: rowIndex === 0,
  //               [styles['new-row']]: this.props.relay.hasOptimisticUpdate(obj),
  //               [styles['selected']]: sel.keys[obj.id],
  //             });
  //           }}
  //           rowHeight={59}
  //           rowsCount={rowsCount}
  //           height={tableHeight}
  //           width={tableWidth}
  //           headerHeight={36}>
  //
  //           {/* selected */}
  //           <Column
  //             columnKey={'selection'}
  //             align={'center'}
  //             header={<Cell onClick={this._onToggleAll}><input aria-checked={function(){
  //               switch (sel.mode) {
  //                 case SelectionModes.All: return 'true';
  //                 case SelectionModes.None: return 'false';
  //                 case SelectionModes.Some: return 'mixed';
  //               }
  //             }()} onChange={e => {}} checked={sel.mode === SelectionModes.All} className={`${styles['input-on-header']} ${styles['input']}`} type='checkbox'/></Cell>}
  //             cell={({rowIndex, ...props}) => {
  //               const key = store.getObjectAt(rowIndex).id;
  //               return (
  //                <Cell {...props} onClick={loading ? null : self._onToggle.bind(self, key)}>
  //                  <div><input onChange={e => {}} checked={loading ? false : sel.mode === SelectionModes.All || sel.keys[key]} className={classnames(styles['input'], { [styles['checked']]: sel.mode === SelectionModes.All || sel.keys[key], })} type='checkbox'/></div>
  //                </Cell>
  //              );
  //             }}
  //             width={40}
  //           />
  //
  //           {/* displayName */}
  //           <Column
  //             columnKey={'displayName'}
  //             align={'left'}
  //             header={(
  //               <SortHeaderCell
  //                 key={'displayName'}
  //                 styles={styles}
  //                 className={sortKey === 'displayName' || !sortKey ? (`${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}`) : `${styles['sort-key']} ${styles['sort-dir-asc']}`}
  //                 columnKey={'displayName'}
  //                 sortKey={sortKey}
  //                 sortDir={sortKey === 'displayName' ? sortDir : SortTypes.DESC} onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_CUSTOMER'])}
  //               </SortHeaderCell>
  //             )}
  //             cell={({rowIndex, ...props}) => (
  //            <Cell {...props}>
  //            <div>{loading || function(self){
  //              const obj = store.getObjectAt(rowIndex);
  //              return (
  //                <a style={{ fontWeight: 'bolder', color: '#000000', ...(obj.active ? {} : { opacity: 0.5, }), }} className={styles['link']} onClick={e => { stopEvent(e), self._openLink(obj); }}>{obj.displayName}</a>
  //              );
  //            }(this)}</div>
  //            </Cell>
  //          )}
  //             width={50}
  //             flexGrow={1}
  //           />
  //
  //           {/* tel */}
  //           <Column
  //             columnKey={'tel'}
  //             align={'left'}
  //             header={<Cell>{intl.formatMessage(messages['Table_Title_Tel'])}</Cell>}
  //             cell={({rowIndex, ...props}) => (
  //              <Cell {...props}>
  //               <div>
  //                 {loading || store.getObjectAt(rowIndex).tel}
  //               </div>
  //              </Cell>
  //            )}
  //             width={50}
  //             flexGrow={1}
  //           />
  //
  //           {/* Bal */}
  //           <Column
  //             columnKey={'balanceDue'}
  //             align={'right'}
  //             header={(
  //               <SortHeaderCell
  //                 key={'balanceDue'}
  //                 styles={styles}
  //                 className={sortKey === 'balanceDue' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
  //                 columnKey={'balanceDue'}
  //                 sortKey={sortKey}
  //                 sortDir={sortDir}
  //                 onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Balance'])}
  //               </SortHeaderCell>
  //             )}
  //             cell={({rowIndex, ...props}) => (
  //            <Cell {...props}>
  //            <div>{loading || function(){
  //              const obj = store.getObjectAt(rowIndex);
  //              return intl.formatNumber(obj.expensesStatus ? obj.expensesStatus.open.amount : 0.0, { format: 'MAD', });
  //            }()}</div>
  //            </Cell>
  //          )}
  //             width={150}
  //           />
  //
  //           {/* Actions */}
  //           <Column
  //             columnKey={'actions'}
  //             align={'right'}
  //             header={<Cell>{intl.formatMessage(messages['Table_Title_Actions'])}</Cell>}
  //             cell={({rowIndex, ...props}) => (
  //            <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
  //             <div style={{zIndex: 2}} className={'row-actions'}>
  //
  //             {renderActions(this, { intl, store, rowIndex, })}
  //
  //             </div>
  //            </Cell>
  //          )}
  //             width={225}
  //           />
  //
  //         </Table>
  //
  //       </div>
  //
  //       {loading ? null : isEmpty && <div style={{}}>
  //         <Empty message={intl.formatMessage(messages.noData)} styles={this.props.styles}/>
  //       </div>}
  //
  //       {loading && <div style={{}}>
  //         <Loading/>
  //       </div>}
  //
  //       {this._renderModal()}
  //
  //     </div>
  //   );
  // }
}

function decoratePaymentItem({ id, amount, bill: { id: billId, objectId, date, dueDate, memo, paymentRef, itemsConnection, paymentsConnection, }, }){
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;
  const obj = {
    __selected: true,
    __existed: true,
    __originalAmount: amount,
    id,
    amount: amount,
    bill: {
      id,
      objectId,
      paymentRef,
      refNo: paymentRef,
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

function decorateBill({ objectId, __dataID__, totalHT, VAT, inputType, id, paymentRef, vendor, billingAddress, terms, date, dueDate, discountType, discountValue, itemsConnection, paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;

  function calcBillStatus() {
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
    type: 'Bill',
    paymentRef,
    refNo: paymentRef,
    vendor,
    dueDate,
    discountType, discountValue,
    totalAmount: itemsConnection.totalAmount,
    balanceDue,
    total: itemsConnection.totalAmount,
    totalAmountReceived: paymentsConnection.totalAmountReceived,
    status: calcBillStatus(),
    memo, files,
    totalHT, VAT, inputType,
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

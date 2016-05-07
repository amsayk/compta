import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import classnames from 'classnames';

import stopEvent from '../../../utils/stopEvent';

import {
  intlShape,
} from 'react-intl';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

// import {sortMostRecent,} from '../../utils/sort';

import Loading from '../../Loading/Loading';

import {editStart as editStartExpense} from '../../../redux/modules/expenses';
import {editStart as editStartBill} from '../../../redux/modules/bills';
import {editStart as editStartPayment} from '../../../redux/modules/paymentsOfBills';

import BillForm  from '../../Expenses/BillForm/BillForm';
import ExpenseForm  from '../../Expenses/ExpenseForm/ExpenseForm';
import PaymentForm  from '../../Expenses/PaymentForm/PaymentForm';

import OverlayMenu from '../../utils/OverlayMenu';

const ACTIONS = {
  Bill: {
    main: 'makepayment',
    actions: [
      'print',
    ],
  },
  Expense: {
    main: 'print',
    actions: [
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

class DropdownActions extends Component{
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
  // const { main, actions, } = ACTIONS[obj.type];
  const { main, actions, } = obj.status === 'Closed' && obj.type === 'Bill'
    ? { main: 'print', actions: [ 'send' ], }
    : ACTIONS[obj.type];
  return (
    typeof main === 'undefined' ? null : <OverlayMenu title={main ? intl.formatMessage(messages[`Action_${main}`]) : undefined} container={self} onMainAction={self._onMainAction.bind(self, obj)}>
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

const BUTTONS = [
  'make-payment',
  'print',
  'send',
];

const BUTTON_TITLES = {
  'make-payment': 'Make Payment',
  'print': 'Print',
  'send': 'Send',
};

const SortTypes = {
  ASC: 1,
  DESC: -1,
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC
    ? SortTypes.ASC
    : SortTypes.DESC;
}

class SortHeaderCell extends Component {
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
      <Cell {...props} onClick={this._onSortChange} className={classnames(className, { [styles['has-key']]: sortKey === columnKey || (columnKey === 'date' && !sortKey), })} columnKey={columnKey}>
        <a>
          {children} <span className={styles['sort-dir']}>{sortDir === SortTypes.DESC || columnKey !== sortKey ? '↓' : '↑'}</span>
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
    default:              return columnKey;
  }
}

import requiredPropType from 'react-prop-types/lib/all';

import { Modes as SelectionModes, } from '../../../redux/modules/selection';

import OperationDataListStore from './OperationDataListStore';

import { getBodyWidth, } from '../../../utils/dimensions';

import moment from 'moment';

import throttle from 'lodash.throttle';

import events from 'dom-helpers/events';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

export default class ExpensesTable extends Component{

  static displayName = 'VendorExpensesTable';

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
    payee: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.payee) {
          return new Error('payee required!');
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

  _onMainAction = (obj, e) => {
    stopEvent(e);
    this._onReceivePayment(obj);
  };

  _onAction = (btn, obj) => {
    switch (btn) {
      case 'makepayment':
        this._onReceivePayment(obj);
        break;

      case 'send':
      case 'print':
    }
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      modalOpen: false,
      loading: props.topLoading,
      store: new OperationDataListStore({
        expenses: props.topLoading ? [] : this.props.expenses,
        count: this.props.count,
      }),
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      loading: nextProps.topLoading,
      store: new OperationDataListStore({
        expenses: nextProps.topLoading ? [] : nextProps.expenses,
        count: nextProps.count,
      }),
    })
  }

  componentWillUnmount() {
    events.off(window, 'resize', this._handleWindowResize);
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

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

    const { store, } = this.state;

    const obj = store.getObjectAt(rowIndex);

    switch (obj.type) {
      case 'Bill':
        this.context.store.dispatch(
          editStartBill(
            obj.id,
            obj.itemsConnection.edges.map(({node}) => node),
            {id: obj.id, company: this.props.company,})
        );
        break;

      case 'Expense':
        this.context.store.dispatch(
          editStartExpense(
            obj.id,
            obj.itemsConnection.edges.map(({node}) => node),
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
          this.props.onReceivePayment(obj.payee);
        });
        break;

      default:

        throw 'Invalid Operation';
    }

    this.setState({
      modalOpen: true,
      obj,
    });
  };

  _onToggleAll = (e) => {
    const { selection, page, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    stopEvent(e);
    sel.mode === SelectionModes.None || sel.mode === SelectionModes.Some
      ? toggleAll(this.props.payee.objectId, page)
      : toggleNone(this.props.payee.objectId, page);
  };

  _onToggle = (id, e) => {
    const { page, toggle, } = this.props;
    stopEvent(e);
    toggle(this.props.payee.objectId, { key: id, page, }, this.state.store.getSize());
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
      bill,
    });
  };

  _onBill = (obj) => {
    this.setState({
      modalOpen: false,
      obj: undefined,
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
          bill: undefined,
        });
      }, 150);
    });
  };

  _onReceivePayments = (bills) => {
    let amountReceived = 0.0;

    function decorateBillItem({ id, objectId, date, dueDate, memo, paymentRef, itemsConnection, paymentsConnection, }){
      const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;
      amountReceived += balanceDue;
      const obj = {
        __selected: true,
        __existed: true,
        __originalAmount: balanceDue,
        id,
        amount: balanceDue,
        bill: {
          id,
          objectId,
          paymentRef,
          refNo: paymentRef,
          total: itemsConnection.totalAmount,
          balanceDue,
          amountPaid: paymentsConnection.totalAmountPaid,
          date,
          dueDate,
          memo,
        },
      }

      return obj;
    }

    const items = bills.map(decorateBillItem);

    this.context.store.dispatch(
      editStartPayment(
        'NEW', items, {id: 'NEW', company: this.props.company, }));

    this.setState({
      modalOpen: true,
      obj: undefined,
      bill: undefined,
      amountReceived,
      selectedBills: bills,
    });
  };

  _renderModal = () => {
    if(!this.state.modalOpen){
      return (
        null
      );
    }

    switch (this.state.obj ? this.state.obj.type : 'Payment'){
      case 'Bill':
        return (
          <BillForm
            payee={this.props.payee}
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
            payee={this.props.payee}
            expense={this.state.obj}
            company={this.props.company}
            viewer={this.props.viewer}
            company={this.props.company}
            formKey={this.state.obj.id}
            expensesAccounts={this.props.expensesAccounts}
            depositsAccounts={this.props.depositsAccounts}
            onCancel={this._close}
            onReceivePayments={this._onReceivePayments}
            onPaymentVendorSelected={this.props.onPaymentVendorSelected}
          />
        );
      case 'Payment':
        return function(self){
          const formKey = self.state.obj ? self.state.obj.id : 'NEW';
          return (
            <PaymentForm
              payee={self.props.payee}
              bill={self.state.bill}
              payment={self.state.obj}
              company={self.props.company}
              viewer={self.props.viewer}
              formKey={formKey}
              vendorOpenBills={self.props.vendorOpenBills}
              expensesAccounts={self.props.expensesAccounts}
              depositsAccounts={self.props.depositsAccounts}
              onCancel={self._close}
              onPaymentVendorSelected={self.props.onPaymentVendorSelected}
              onBill={self._onBill}
              amountReceived={self.state.amountReceived || 0.0}
              selectedBills={self.state.selectedBills || []}
            />
          );
        }(this);
    }
  };

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);

    // const store = new OperationDataListStore([], 12);
    // setTimeout(() => {
    //   this.setState({
    //     store,
    //     loading: false,
    //   });
    // }, 1000);
  }

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

    const isOnlyPayments =  type === 'recent' || type === 'money' || type === 'payments' || type === 'expenses';
    if(isOnlyPayments){
      return this._renderMoneyOnly();
    }

    const isOnlyBills = type === 'bills';
    if(isOnlyBills){
      return this._renderBillsOnly();
    }

    return this._renderNormal();
  }

  _renderMoneyOnly(){
    const self = this;
    const { styles, page, selection, toggle, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const { loading, store, } = this.state;
    const rowsCount = loading ? 0 : store.getSize();
    const tableHeight = 36 + (rowsCount * 50) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 225 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 225 - 60, 956 - 245);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    return (
      <div className={classnames({[styles['expenses-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

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
              align={'center'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_REF_NO'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || store.getObjectAt(rowIndex).refNo}</div>
             </Cell>
           )}
              width={60}
            />

            {/* Payee */}
            <Column
              columnKey={'payee'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_PAYEE'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return obj.payee ? obj.payee.displayName : '';
                 case 'Expense': return obj.payee ? obj.payee.displayName : '';
                 case 'Payment': return obj.payee ? obj.payee.displayName : '';
               }
             }()}</div>
             </Cell>
           )}
              width={40}
              flexGrow={1}
            />

            {/* category */}
            {/*<Column
              columnKey={'category'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Category'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return 'Cetegory';
                 case 'Expense': return 'Cetegory';
                 case 'Payment': return null;
               }
             }()}</div>
             </Cell>
           )}
              width={180}
            />*/}

            {/* dueDate */}
            {/*<Column
              columnKey={'dueDate'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_DueDate'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return moment(obj.dueDate).format('ll');
                 case 'Payment': return moment(obj.date).format('ll');
                 default:        return '';
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />*/}

            {/* Bal */}
            {/*<Column
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
                 case 'Bill':     return intl.formatNumber(obj.balanceDue, {format: 'MAD'});
                 case 'Expense':  return intl.formatNumber(0.0, {format: 'MAD'});
                 case 'Payment':  return intl.formatNumber(obj.balanceDue, {format: 'MAD'});
                //  case 'Payment':  return obj.balanceDue > 0 ? '(' + intl.formatNumber(obj.balanceDue, {format: 'MAD'}) + ')' : intl.formatNumber(obj.balanceDue, {format: 'MAD'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />*/}

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
                 case 'Bill':    return intl.formatNumber(obj.totalAmount, {format: 'MAD'});
                 case 'Payment': return intl.formatNumber(obj.total, {format: 'MAD'});
                //  case 'Payment': return obj.total > 0 ? '(' + intl.formatNumber(obj.total, {format: 'MAD'}) + ')' : intl.formatNumber(obj.total, {format: 'MAD'});
                 case 'Expense': return intl.formatNumber(obj.totalAmountPaid, {format: 'MAD'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Status */}
            {/*<Column
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
                        case 'Bill': return intl.formatMessage(messages[`BillStatus${obj.status}`]);
                        case 'Payment': return intl.formatMessage(messages[`PaymentStatus${obj.status}`]);
                        case 'Expense':    return intl.formatMessage(messages[`SaleStatus${obj.status}`]);
                      }
                    }()}
                  </div>
                 </Cell>
               )
              }}
              width={50}
              flexGrow={1}
            />*/}

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'right'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Action'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
              <div style={{zIndex: 2}} className={'row-actions'}>
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
    const tableHeight = 36 + (rowsCount * 50) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 225 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 225 - 60, 956 - 245);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    return (
      <div className={classnames({[styles['expenses-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

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
            {/*<Column
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
            />*/}

            {/* No */}
            <Column
              columnKey={'refNo'}
              align={'center'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_REF_NO'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || store.getObjectAt(rowIndex).refNo}</div>
             </Cell>
           )}
              width={60}
            />

            {/* Payee */}
            <Column
              columnKey={'payee'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_PAYEE'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return obj.payee ? obj.payee.displayName : '';
                 case 'Expense': return obj.payee ? obj.payee.displayName : '';
                 case 'Payment': return obj.payee ? obj.payee.displayName : '';
               }
             }()}</div>
             </Cell>
           )}
              width={40}
              flexGrow={1}
            />

            {/* category */}
            {/*<Column
              columnKey={'category'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Category'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return 'Cetegory';
                 case 'Expense': return 'Cetegory';
                 case 'Payment': return null;
               }
             }()}</div>
             </Cell>
           )}
              width={180}
            />*/}

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
                 case 'Bill':    return moment(obj.dueDate).format('ll');
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
                 case 'Bill':     return intl.formatNumber(obj.balanceDue, {format: 'MAD'});
                 case 'Expense':  return intl.formatNumber(0.0, {format: 'MAD'});
                 case 'Payment':  return intl.formatNumber(obj.balanceDue, {format: 'MAD'});
                //  case 'Payment':  return obj.balanceDue > 0 ? '(' + intl.formatNumber(obj.balanceDue, {format: 'MAD'}) + ')' : intl.formatNumber(obj.balanceDue, {format: 'MAD'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

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
                 case 'Bill':    return intl.formatNumber(obj.totalAmount, {format: 'MAD'});
                 case 'Payment': return intl.formatNumber(obj.total, {format: 'MAD'});
                //  case 'Payment': return obj.total > 0 ? '(' + intl.formatNumber(obj.total, {format: 'MAD'}) + ')' : intl.formatNumber(obj.total, {format: 'MAD'});
                 case 'Expense': return intl.formatNumber(obj.totalAmountPaid, {format: 'MAD'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Status */}
            {/*<Column
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
                        case 'Bill': return intl.formatMessage(messages[`BillStatus${obj.status}`]);
                        case 'Payment': return intl.formatMessage(messages[`PaymentStatus${obj.status}`]);
                        case 'Expense':    return intl.formatMessage(messages[`SaleStatus${obj.status}`]);
                      }
                    }()}
                  </div>
                 </Cell>
               )
              }}
              width={50}
              flexGrow={1}
            />*/}

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'right'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Action'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
              <div style={{zIndex: 2}} className={'row-actions'}>
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

      </div>
    );
  }

  _renderNormal(){
    const self = this;
    const { styles, page, selection, toggle, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const { loading, store, } = this.state;
    const rowsCount = loading ? 0 : store.getSize();
    const tableHeight = 36 + (rowsCount * 50) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 225 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 225 - 60, 956 - 245);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    const isOnlyPayments = type === 'money' || type === 'payments' || type === 'expenses';
    const isOnlyBills = type === 'recent' || type === 'bills';

    return (
      <div className={classnames({[styles['expenses-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

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
              align={'center'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_REF_NO'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || store.getObjectAt(rowIndex).refNo}</div>
             </Cell>
           )}
              width={60}
            />

            {/* Payee */}
            <Column
              columnKey={'payee'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_PAYEE'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return obj.payee ? obj.payee.displayName : '';
                 case 'Expense': return obj.payee ? obj.payee.displayName : '';
                 case 'Payment': return obj.payee ? obj.payee.displayName : '';
               }
             }()}</div>
             </Cell>
           )}
              width={40}
              flexGrow={1}
            />

            {/* category */}
            {/*<Column
              columnKey={'category'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Category'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return 'Cetegory';
                 case 'Expense': return 'Cetegory';
                 case 'Payment': return null;
               }
             }()}</div>
             </Cell>
           )}
              width={180}
            />*/}

            {/* dueDate */}
            {/*<Column
              columnKey={'dueDate'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_DueDate'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill': return moment(obj.dueDate).format('ll');
                 case 'Payment': return moment(obj.date).format('ll');
                 default:        return '';
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />*/}

            {/* Bal */}
            {/*<Column
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
                 case 'Bill': return intl.formatNumber(obj.balanceDue, {format: 'MAD'});
                 case 'Expense':    return intl.formatNumber(0.0, {format: 'MAD'});
                 case 'Payment': return intl.formatNumber(obj.balanceDue, {format: 'MAD'});
                //  case 'Payment': return obj.balanceDue > 0 ? '(' + intl.formatNumber(obj.balanceDue, {format: 'MAD'}) + ')' : intl.formatNumber(obj.balanceDue, {format: 'MAD'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />*/}

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
                 case 'Bill':    return intl.formatNumber(obj.totalAmount, {format: 'MAD'});
                 case 'Payment': return intl.formatNumber(obj.total, {format: 'MAD'});
                //  case 'Payment': return obj.total > 0 ? '(' + intl.formatNumber(obj.total, {format: 'MAD'}) + ')' : intl.formatNumber(obj.total, {format: 'MAD'});
                 case 'Expense': return intl.formatNumber(obj.totalAmountPaid, {format: 'MAD'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Status */}
            {/*<Column
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
                        case 'Bill': return intl.formatMessage(messages[`BillStatus${obj.status}`]);
                        case 'Payment': return intl.formatMessage(messages[`PaymentStatus${obj.status}`]);
                        case 'Expense':    return intl.formatMessage(messages[`SaleStatus${obj.status}`]);
                      }
                    }()}
                  </div>
                 </Cell>
               )
              }}
              width={50}
              flexGrow={1}
            />*/}

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'right'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Action'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
              <div style={{zIndex: 2}} className={'row-actions'}>
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

      </div>
    );
  }

  // render(){
  //
  //   const loading = this.state.loading;
  //
  //   const {styles,} = this.props;
  //   const {intl} = this.context;
  //
  //   const store = this.state.store;
  //   const rowsCount = loading ? 0 : store.getSize();
  //   const tableHeight = 36 + (rowsCount * 50) + 2;
  //   const bodyWidth = Math.max(1080, getBodyWidth() - 300);
  //   const tableWidth = bodyWidth - 1;
  //   const isEmpty = rowsCount === 0;
  //   return (
  //     <div className={classnames({[styles['expenses-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>
  //       <div style={{}}>
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
  //           onRowClick={(e, rowIndex) => {}}
  //           rowClassNameGetter={(rowIndex) => `${styles.row} ${rowIndex === 0 ? styles['first-row'] || '' : ''} table-row`}
  //           rowHeight={50}
  //           rowsCount={rowsCount}
  //           height={tableHeight}
  //           width={tableWidth}
  //           headerHeight={36}>
  //
  //           {/* selected */}
  //           <Column
  //             columnKey={'selection'}
  //             align={'center'}
  //             header={<Cell><input className={`${styles['input-on-header']} ${styles['input']}`} type="checkbox"/></Cell>}
  //             cell={({rowIndex, ...props}) => (
  //              <Cell {...props}>
  //              <div><input className={styles['input']} type="checkbox"/></div>
  //              </Cell>
  //            )}
  //             width={40}
  //           />
  //
  //           {/* date */}
  //           <Column
  //             columnKey={'date'}
  //             align={'center'}
  //             header={<Cell>Date</Cell>}
  //             cell={({rowIndex, ...props}) => (
  //              <Cell {...props}>
  //              <div>{loading || moment(store.getObjectAt(rowIndex).date).format('ll')}</div>
  //              </Cell>
  //            )}
  //             width={50}
  //             flexGrow={1}
  //           />
  //
  //           {/* type */}
  //           <Column
  //             columnKey={'type'}
  //             align={'left'}
  //             header={<Cell>Type</Cell>}
  //             cell={({rowIndex, ...props}) => (
  //              <Cell {...props}>
  //              <div>{loading || intl.formatMessage(messages[`${store.getObjectAt(rowIndex).type}Type`])}</div>
  //              </Cell>
  //            )}
  //             width={50}
  //             flexGrow={1}
  //           />
  //
  //           {/* No */}
  //           <Column
  //             columnKey={'refNo'}
  //             align={'center'}
  //             header={<Cell>Nº</Cell>}
  //             cell={({rowIndex, ...props}) => (
  //              <Cell {...props}>
  //              <div>{loading || store.getObjectAt(rowIndex).refNo}</div>
  //              </Cell>
  //            )}
  //             width={70}
  //           />
  //
  //           {/* Payee */}
  //           <Column
  //             columnKey={'payee'}
  //             align={'left'}
  //             header={<Cell>Payee</Cell>}
  //             cell={({rowIndex, ...props}) => (
  //              <Cell {...props}>
  //              <div>{loading || function(){
  //                const obj = store.getObjectAt(rowIndex);
  //                return obj.payee ? obj.payee.displayName : '';
  //              }()}</div>
  //              </Cell>
  //            )}
  //             width={40}
  //             flexGrow={1}
  //           />
  //
  //           {/* category */}
  //           <Column
  //             columnKey={'category'}
  //             align={'left'}
  //             header={<Cell>Category</Cell>}
  //             cell={({rowIndex, ...props}) => (
  //              <Cell {...props}>
  //              <div>{loading || store.getObjectAt(rowIndex).category}</div>
  //              </Cell>
  //            )}
  //             width={50}
  //             flexGrow={1}
  //           />
  //
  //           {/* Total */}
  //           <Column
  //             columnKey={'total'}
  //             align={'right'}
  //             header={<Cell>Total</Cell>}
  //             cell={({rowIndex, ...props}) => (
  //              <Cell {...props}>
  //              <div>{loading || function(){
  //                const obj = store.getObjectAt(rowIndex);
  //                switch(obj.type){
  //                  case 'Expense': return `MAD ${obj.totalAmountPaid}`;
  //                  default:        return 'MAD 0.00';
  //                }
  //              }()}</div>
  //              </Cell>
  //            )}
  //             width={50}
  //             flexGrow={1}
  //           />
  //
  //           {/* Actions */}
  //           <Column
  //             columnKey={'actions'}
  //             align={'right'}
  //             header={<Cell>Action</Cell>}
  //             cell={({rowIndex, ...props}) => (
  //              <Cell {...{...props, className: classnames(props.className, 'row-actions'), }} onClick={stopEvent}>
  //               <div style={{zIndex: 2}}>
  //                 <DropdownButton bsStyle={'link'} title={'Actions'} id={rowIndex+'-actions'}>
  //                         {BUTTONS.map((btn, index) => <MenuItem key={index}
  //                                                                eventKey={index}>{BUTTON_TITLES[btn]}</MenuItem>)}
  //                       </DropdownButton>
  //               </div>
  //              </Cell>
  //            )}
  //             width={50}
  //             flexGrow={1}
  //           />
  //
  //         </Table>
  //       </div>
  //
  //       {loading ? null : isEmpty && <div style={{height: 200}}>
  //         <Empty message={intl.formatMessage(messages.noData)} styles={this.props.styles}/>
  //       </div>}
  //
  //       {loading && <div style={{height: 200}}>
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
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;
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
      amountPaid: paymentsConnection.totalAmountPaid,
      date,
      dueDate,
      memo,
    },
  }

  return obj;
}

function decorateBill({ objectId, __dataID__, id, payee, paymentRef, mailingAddress, terms, date, dueDate, itemsConnection, paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;

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

    // const hasPayment = paymentsConnection.totalAmountPaid !== 0;
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
    mailingAddress,
    type: 'Bill',
    paymentRef,
    refNo: paymentRef,
    payee,
    dueDate,
    totalAmount: itemsConnection.totalAmount,
    balanceDue,
    total: itemsConnection.totalAmount,
    totalAmountPaid: paymentsConnection.totalAmountPaid,
    status: calcBillStatus(),
    memo, files,
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

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

import ProductForm from '../ProductForm/ProductForm';

// import BillForm from '../../Expenses/BillForm/BillForm';
// import ExpenseForm from '../../Expenses/ExpenseForm/ExpenseForm';
// import PaymentForm from '../../Expenses/PaymentForm/PaymentForm';

import OverlayMenu from '../../utils/OverlayMenu';

const DEFAULT_ACTIONS = {
  main: 'product',
  actions: [
    'delete',
    'report',
  ],
};

function getActionsStyle(rowIndex){
  return {
    display: 'block',
    width: 180,
    top: 149 + (rowIndex * 59),
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
  const { main, actions, } = DEFAULT_ACTIONS;
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
      <Cell {...props} onClick={this._onSortChange} className={classnames(className, { [styles['has-key']]: sortKey === columnKey || (columnKey === 'displayName' && !sortKey), })} columnKey={columnKey}>
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
    case 'balanceDue':    return 'openBalance';
    default:              return columnKey;
  }
}

import OperationDataListStore from './OperationDataListStore';

import moment from 'moment';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

import {editStart as editStartProduct} from '../../../redux/modules/products';

// import {editStart as editStartBill} from '../../../redux/modules/bills';
// import {editStart as editStartPayment} from '../../../redux/modules/paymentsOfBills';
// import {editStart as editStartExpense} from '../../../redux/modules/expenses';

import find from 'lodash.findindex';

function getCategory(code){
  const index = find(CATEGORIES, obj => obj.code === code);
  return CATEGORIES[index].name;
}

const CATEGORIES = [{
  code: '7.1.1.1',
  _categoryCode: '7.1',
  _groupCode: '7.1.1',
  _classCode: '7',
  name: 'Ventes de marchandises', // Ventes de marchandises au Maroc
}, {
  code: '7.1.2.1.1',
  _categoryCode: '7.1',
  _groupCode: '7.1.2',
  _classCode: '7',
  name: 'Ventes de produits finis',
}, {
    code: '7.1.2.4',
    _categoryCode: '7.1',
    _groupCode: '7.1.2',
    _classCode: '7',
    name: 'Prestations de services', // 7124 Ventes de services produits au Maroc
}, {
  code: '7.1.2.4.1',
  _categoryCode: '7.1',
  _groupCode: '7.1.2',
  _classCode: '7',
  name: 'Travaux', // 71241 Travaux
}];

import requiredPropType from 'react-prop-types/lib/all';

import { Modes as SelectionModes, } from '../../../redux/modules/selection';

export default class ProductsTable extends Component{

  static displayName = 'ProductsTable';

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
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  _onMainAction = (obj, type, e) => {
    stopEvent(e);

    switch (type) {
      case 'product':
        this.context.store.dispatch(
          editStartProduct(
            'NEW',
            [],
            {id: 'NEW', company: this.props.company,})
        );
        break;

      default:

        throw 'Invalid Operation';
    }

    this.setState({
      modalOpen: true,
      modalType: type,
      item: obj,
    });
  };

  _onAction = (type, obj) => {

    switch (type) {
      case 'product':

        this.context.store.dispatch(
          editStartProduct(
            'NEW',
            [],
            {id: 'NEW', company: this.props.company,})
        );
        break;

      default:

        throw 'Invalid Operation';
    }

    this.setState({
      modalOpen: true,
      modalType: type,
      item: obj,
    });
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      modalOpen: false,
      loading: this.props.topLoading,
      store: new OperationDataListStore({
        products: this.props.topLoading ? [] : this.props.products,
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
        products: nextProps.topLoading ? [] : nextProps.products,
        count: nextProps.count,
      }),
    });

  }

  _close = (btn, e) => {
    stopEvent(e);

    this.setState({
      modalOpen: false,
      item: undefined,
    })
  };

  _renderModal = () => {
    if(!this.state.modalOpen){
      return (
        null
      );
    }

    switch (this.state.modalType) {
      case 'product':
      return (
        <ProductForm
          product={this.state.item}
          company={this.props.company}
          viewer={this.props.viewer}
          formKey={this.state.item.id}
          onDone={() => {}}
          onCancel={this._close}
        />
      );
    }

  };

  _onSortChange = (columnKey, dir) => {
    this.props.onSortChange(columnKey, dir);
  }

  render(){
    const self = this;
    const { styles, page, toggle, toggleAll, toggleNone, } = this.props;
    const { intl, } = this.context;

    const { loading, store, } = this.state;
    const rowsCount = loading ? 0 : store.getSize();
    const tableHeight = 36 + (rowsCount * 59) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 225 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 60, 956);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    return (
      <div className={classnames({[styles['products-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

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
            // onRowClick={(e, rowIndex) => this._openItem(rowIndex, e)}
            rowClassNameGetter={(rowIndex) => {
              const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
                [styles['new-row']]: this.props.relay.hasOptimisticUpdate(obj),
              });
            }}
            rowHeight={59}
            rowsCount={rowsCount}
            height={tableHeight}
            width={tableWidth}
            headerHeight={36}>


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
                  sortDir={sortKey === 'displayName' ? sortDir : SortTypes.DESC} onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Name'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(self){
               const obj = store.getObjectAt(rowIndex);
               return (
                 <a style={{ fontWeight: 'bolder', color: '#000000', }} className={styles['link']} onClick={e => { stopEvent(e); }}>{obj.displayName}</a>
               );
             }(this)}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />


            {/* Description */}
            <Column
              columnKey={'salesDesc'}
              align={'left'}
              header={<Cell>Description</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(self){
               const obj = store.getObjectAt(rowIndex);
               return (
                 obj.salesDesc
               );
             }(this)}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* incomeAccountCode */}
            <Column
              columnKey={'incomeAccountCode'}
              align={'left'}
              header={<Cell>Catégorie</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(self){
               const obj = store.getObjectAt(rowIndex);
               return (
                 getCategory(obj.incomeAccountCode)
               );
             }(this)}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* price */}
            <Column
              columnKey={'salesPrice'}
              align={'right'}
              header={(
                <SortHeaderCell
                  key={'salesPrice'}
                  styles={styles}
                  className={sortKey === 'salesPrice' || !sortKey ? (`${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}`) : `${styles['sort-key']} ${styles['sort-dir-asc']}`}
                  columnKey={'salesPrice'}
                  sortKey={sortKey}
                  sortDir={sortKey === 'salesPrice' ? sortDir : SortTypes.DESC} onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Price'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(self){
               const obj = store.getObjectAt(rowIndex);
               return (
                 intl.formatNumber(obj.salesPrice, { format: 'MAD', })
               );
             }(this)}</div>
             </Cell>
           )}
              width={50}
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

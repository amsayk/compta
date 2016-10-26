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

import EmployeeForm from '../../Employees/EmployeeForm/EmployeeForm';

import OverlayMenu from '../../utils/OverlayMenu';

const DEFAULT_ACTIONS = {
  main: 'employee',
  actions: [
  ],
};

function getActionsStyle(rowIndex){
  return {
    display: 'block',
    width: 185,
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
      <Cell {...props} onClick={this._onSortChange} className={classnames(className, { [styles['has-key']]: sortKey === columnKey || sortKey === getSortKey(columnKey) || (columnKey === 'displayName' && !sortKey), })} columnKey={columnKey}>
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
    default: return columnKey;
  }
}

import OperationDataListStore from './OperationDataListStore';

import moment from 'moment';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

import { editStart as editStartEmployee, } from '../../../redux/modules/employees';

import requiredPropType from 'react-prop-types/lib/all';

import { Modes as SelectionModes, } from '../../../redux/modules/selection';

export default class SalesTable extends React.Component{

  static displayName = 'EmployeesSalesTable';

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
      case 'employee':
        this.context.store.dispatch(
          editStartEmployee(
            'NEW')
        );
        break;

      default:

        throw 'Invalid Operation';
    }

    this.setState({
      modalOpen: true,
      modalType: type,
      employee: obj,
    });
  };

  _onAction = (type, obj) => {

    switch (type) {
      case 'employee':
        this.context.store.dispatch(
          editStartEmployee(
            'NEW')
        );
        break;

      default:

        throw 'Invalid Operation';
    }

    this.setState({
      modalOpen: true,
      modalType: type,
      employee: obj,
    });
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      modalOpen: false,
      loading: this.props.topLoading,
      store: new OperationDataListStore({
        employees: this.props.topLoading ? [] : this.props.employees,
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
        employees: nextProps.topLoading ? [] : nextProps.employees,
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


  _openLink = (obj) => {
    this._onMainAction(obj, 'employee');

    // this.props.goToEmployee(obj);

  };

  _onToggleAll = (e) => {
    const { selection, page, toggleAll, toggleNone, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    stopEvent(e);
    sel.mode === SelectionModes.None || sel.mode === SelectionModes.Some
      ? toggleAll('employees', page)
      : toggleNone('employees', page);
  };

  _onToggle = (id, e) => {
    const { page, toggle, } = this.props;
    stopEvent(e);
    toggle('employees', { key: id, page, }, this.state.store.getSize());
  };

  _renderModal = () => {
    if(!this.state.modalOpen){
      return (
        null
      );
    }

    switch (this.state.modalType) {
      case 'employee':
      return (
        <EmployeeForm
          employee={this.state.employee}
          company={this.props.company}
          viewer={this.props.viewer}
          formKey={'NEW'}
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
      <div className={classnames({[styles['employees-table-wrapper'] || '']: true, [styles['table']]: true, [styles['loading'] || '']: loading})}>

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
            {/*<Column
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
            />*/}

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
                 <a style={{ fontWeight: 'bolder', color: '#000000', }} className={styles['link']} onClick={e => { stopEvent(e), self._openLink(obj); }}>{obj.displayName}</a>
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

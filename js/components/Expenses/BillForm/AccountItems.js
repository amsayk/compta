import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import {DragSource, DropTarget, DragDropContext,} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import classnames from 'classnames';

import styles from './BillForm.scss';

import CSSModules from 'react-css-modules';

import findIndex from 'lodash.findindex';

import LineEditor from './BillLineEditor';

import enhanceWithClickOutside from '../../../utils/react-click-outside';

@enhanceWithClickOutside
class ClickOutsideWrapper extends Component {
  handleClickOutside = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    this.props.onClickOutside(e);
  };

  render() {
    return (
      <div className={''}>{this.props.children}</div>
    );
  }
}

import {Table, Column, Cell,} from '../../../../fixed-data-table';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

function clamp(value, min, max){
  return Math.min(Math.max(value, min), max);
}

const ItemTypes = {
  BILL: 'bill'
};

const billSource = {
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findOp(props.id).index
    };
  },

  endDrag(props, monitor) {
    const {id: droppedId, originalIndex} = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.moveOp(droppedId, originalIndex);
    }

    props.onHover({rowIndex: null, dragging: false});
  }
};

const billTarget = {
  canDrop() {
    return false;
  },

  hover(props, monitor) {
    const {id: draggedId} = monitor.getItem();
    const {id: overId} = props;

    if (draggedId !== overId) {
      const {index: overIndex} = props.findOp(overId);

      props.moveOp(draggedId, overIndex);

      props.onHover({rowIndex: overIndex, dragging: true});
    }
  },

};

@DropTarget(ItemTypes.BILL, billTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.BILL, billSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class DragHandle extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    findOp: PropTypes.func.isRequired,
    moveOp: PropTypes.func.isRequired,
    onHover: PropTypes.func.isRequired
  };

  render() {
    const {styles, isDragging, connectDragSource, connectDropTarget} = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div
        style={{ opacity }}
        className={`${styles['tertiary-sprite']} ${styles['dragHandle']}`}>
      </div>
    ));
  }
}

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.BILL, {
  drop() {
    //
  }
}, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'BillAccountItems';

  static contextTypes = {
    intl: intlShape.isRequired
  };

  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,

    height: PropTypes.number.isRequired,
    bodyWidth: PropTypes.number.isRequired,

    company: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,

    store: PropTypes.object.isRequired,

    refresh: PropTypes.func.isRequired,

    expensesAccounts: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      _categoryCode: PropTypes.string.isRequired,
      _groupCode: PropTypes.string.isRequired,
      _classCode: PropTypes.string.isRequired,
    })).isRequired,

    fields: PropTypes.shape({
      dirty: PropTypes.bool.isRequired,
      values: PropTypes.object.isRequired,
      valid: PropTypes.bool.isRequired,
      invalid: PropTypes.bool.isRequired,
      pristine: PropTypes.bool.isRequired,
      setActiveRow: PropTypes.func.isRequired,
      addMoreRows: PropTypes.func.isRequired,
      clearAllRows: PropTypes.func.isRequired,
      clearRow: PropTypes.func.isRequired,
      resetLines: PropTypes.func.isRequired,
      moveOp: PropTypes.func.isRequired,
      submitting: PropTypes.bool.isRequired,
    }).isRequired,
  };

  state = {
    modalOpen: false,
  };

  moveOp = (id, atIndex) => {
    const {
      store,
    } = this.props;

    const {index} = store.find(id);

    store.move(index, atIndex);
  };

  drop = (id, atIndex) => {
    const {
      formKey,
      store,
    } = this.props;

    const {index} = store.find(id);

    this.props.moveOp(formKey, index, atIndex);
  };

  findOp = (id) => {
    const {
      formKey,
      store,
    } = this.props;

    return store.find(id);
  };

  _onHover = ({rowIndex}) => {
    this.setState({
      rowIndex
    })
  };

  render() {

    const {intl,} = this.context;

    const {
      bill,
      company,
      store,
      height,
      connectDropTarget,
      bodyWidth : width,
      fields: {dirty, valid, invalid, pristine, save, resetLines, submitting, values,},

    } = this.props;

    const self = this;

    // const bills = store.getAll();

    const rowsCount = store.getSize() + 1;

    const tableHeight = 36 + (rowsCount * 50) + 2;

    // const bodyWidth = clamp(width - 50, 1220, 1345);
    const bodyWidth = clamp(width - 60, 1220, screen.width - 60);

    const tableWidth = bodyWidth;

    const {rowIndex: activeRow, cell: activeCell} = store.getActiveRow() || {};

    return (
      <div styleName='product-items-wrapper'>

        <div styleName='product-items'>

          <div styleName='products-line-1'>

            {connectDropTarget(<div className='' style={{}}>

              <ClickOutsideWrapper
                onClickOutside={(e) => {
                  // if(typeof this.state.pendingRowIndex !== 'undefined'){
                  //   return;
                  // }
                  store.hasActiveRow() && this._setActiveRow(undefined, e);
                }}>

                <Table
                  renderRow={(Component, rowIndex, {style, className}) => {
                    return (
                     <div style={{}}>

                        <Component
                          style={{...style, zIndex: 0}}
                           className={`${className} ${styles['table-row-container']} ${styles[`${self.state.rowIndex === rowIndex ? '' : 'not-'}isDragging`]}`}
                         />

                        {rowIndex === activeRow && <LineEditor
                          // isAddingAccount={typeof this.state.pendingRowIndex !== 'undefined'}
                          // onAddNewAccount={this._onAddNewAccount}
                          cell={activeCell}
                          styles={this.props.styles}
                          store={store}
                          rowIndex={activeRow}
                          tableWidth={tableWidth}
                          company={this.props.company}
                          items={this.props.expensesAccounts}
                      />}

                      </div>
                    );
                  }}
                  onHeaderClick={(e) => self._setActiveRow(0, e)}
                  rowClassNameGetter={(rowIndex) => ` ${styles.row} ${rowIndex === 0 ? styles['first-row'] : ''} table-row`}
                  rowHeight={50}
                  rowsCount={rowsCount}
                  height={tableHeight}
                  width={tableWidth}
                  headerHeight={36}>

                  {/* Space */}
                  <Column
                    columnKey={'drag'}
                    align={'center'}
                    width={0.035 * tableWidth}
                    cell={({rowIndex, ...props}) => {
                          const item = store.getObjectAt(rowIndex);
                          return (
                             <Cell {...props}>
                                <DragHandle
                                  rowIndex={rowIndex}
                                  onHover={self._onHover}
                                  drop={self.drop}
                                  moveOp={self.moveOp}
                                  findOp={self.findOp}
                                  id={item.id || item._id}
                                  styles={styles}
                                />
                             </Cell>
                           );
                        }}
                  />

                  {/* Number */}
                  <Column
                    columnKey={'index'}
                    align={'right'}
                    header={<Cell>#</Cell>}
                    cell={({rowIndex, ...props}) => (
                           <Cell {...props}>
                            <div onClick={(e) => self._setActiveRow({rowIndex, cell: 'accountCode'}, e)}>{rowIndex + 1}</div>
                           </Cell>
                         )}
                    width={0.04 * tableWidth}
                  />

                  {/* Account */}
                  <Column
                    columnKey={'accountCode'}
                    align={'left'}
                    header={<Cell>{intl.formatMessage(messages.Item)}</Cell>}
                    cell={(props) => {
                      return (
                        <div onClick={(e) => self._setActiveRow({rowIndex: props.rowIndex, cell: 'accountCode'}, e)}>
                          <AccountCodeCell
                          {...props}
                          styles={styles}
                          store={store}
                          expensesAccounts={this.props.expensesAccounts}
                          company={this.props.company}
                          className={classnames(props.className || '', styles['accountCodeCell'])}
                        />
                        </div>
                      );
                    }}
                    width={0.145 * tableWidth}
                  />

                  {/* DESCRIPTION */}
                  <Column
                    columnKey={'description'}
                    align={'left'}
                    header={<Cell>{intl.formatMessage(messages.Description)}</Cell>}
                    cell={(props) => {
                      return (
                        <div onClick={(e) => self._setActiveRow({rowIndex: props.rowIndex, cell: 'description'}, e)}>

                         <TextValueCell
                            {...props}
                            styles={styles}
                            type={'description'}
                            store={store}
                          />

                        </div>
                      );
                    }}
                    width={0.66 * bodyWidth}
                    flexGrow={1}
                  />

                  {/* amount */}
                  <Column
                    columnKey={'amount'}
                    align={'right'}
                    header={<Cell>{intl.formatMessage(messages.Amount)}</Cell>}
                    cell={(props) => {

                      return (

                        <div onClick={(e) => self._setActiveRow({rowIndex: props.rowIndex, cell: 'amount'}, e)}>

                           <AmountValueCell
                              {...props}
                              styles={styles}
                              store={store}
                           />

                        </div>

                      );
                    }}
                    width={0.09 * tableWidth}
                  />

                  {/* Del Action */}
                  <Column
                    columnKey={'del'}
                    align={'center'}
                    cell={({rowIndex, ...props}) => (
                           <Cell {...props}>
                             {rowIndex === activeRow ? null : <div onClick={self._onClearRow.bind(self, rowIndex)} className={`${styles['tertiary-sprite']} ${styles['deleteColumn']}`}></div>}
                           </Cell>
                         )}
                    width={0.03 * tableWidth}
                  />

                </Table>

              </ClickOutsideWrapper>

            </div>)}

          </div>

          <div styleName='products-line-2'>

            <div className='line-2-2' style={{minHeight: 30, marginTop: 15, }}>

              <button
                styleName='button floatLeft sm'
                onClick={this._addRows}
                className='btn btn-secondary btn-sm unselectable'>{intl.formatMessage(messages['add_more_lines'])}
              </button>

              <button
                styleName='button floatLeft sm'
                onClick={this._clearAll}
                style={{marginLeft: 10}}
                className='btn btn-secondary btn-sm unselectable'>{intl.formatMessage(messages['clear_all_lines'])}
              </button>

              {bill && store.isDirty && <button
                styleName='button floatLeft sm'
                onClick={this._reset}
                style={{marginLeft: 10}}
                className='btn btn-secondary btn-sm unselectable'>{intl.formatMessage(messages['reset_all_lines'])}
              </button>}

            </div>

          </div>

        </div>

      </div>
    );
  }

  _onClearRow = (rowIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.fields.clearRow(this.props.formKey, rowIndex);
  };

  _addRows = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.fields.addMoreRows(this.props.formKey);
  };

  _clearAll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.fields.clearAllRows(this.props.formKey);
  };
  _reset = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.fields.resetLines(this.props.formKey);
  };

  _setActiveRow = (config, e) => {
    // e.preventDefault();
    // e.stopPropagation();

    const {
      store,
    } = this.props;

    const {rowIndex: oldIndex} = store.getActiveRow() || {};
    const {rowIndex: newIndex} = config || {};

    if (oldIndex !== newIndex) {
      // store.setShowErrors(typeof config === 'undefined');
      this.props.fields.setActiveRow(this.props.formKey, config);
      setImmediate(() => {
        this.props.refresh();
      });
    }
  };
}

class AccountCodeCell extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    company: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  state = {
  };

  constructor(props) {
    super(props);

    const {rowIndex, store,} = this.props;

    const {accountCode: value} = store.getObjectAt(rowIndex);

    this.state.value = value;
  }

  componentWillReceiveProps(nextProps) {
    const {rowIndex, store,} = nextProps;

    const {accountCode: value} = store.getObjectAt(rowIndex);

    if (this.state.value !== value) {
      this.setState({
        value: value,
      });
    }
  }

  componentDidMount() {
    // this._component && this._component.focus();
  }

  render() {
    const {company, expensesAccounts, ...props} = this.props;

    const value = this.state.value;

    const index = value && findIndex(expensesAccounts, ({code}) => code === value);

    return (
      <Cell {...props}>
        {value ? <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>
          <span style={{marginLeft: 10, display: 'inline', overflow: 'hidden', textOverflow: 'ellipsis',}}
                className=''>{expensesAccounts[index].name}</span>
        </div> : <div/>}
      </Cell>
    );
  }
}

class TextValueCell extends Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['description']).isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    const {rowIndex, store, type,} = this.props;

    const {[type]: value} = store.getObjectAt(rowIndex);

    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextprops) {
    const {rowIndex, store, type,} = nextprops;

    const {[type]: value} = store.getObjectAt(rowIndex);

    if (this.state.value !== value) {
      this.setState({
        value,
      });
    }
  }

  render() {
    return (
      <Cell {...this.props}>
        <div>{this.state.value}</div>
      </Cell>
    );
  }
}

class AmountValueCell extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  render() {
    const { store, rowIndex, } = this.props;
    const {amount, pristine,} = store.getObjectAt(rowIndex);
    const {intl,} = this.context;
    return (
      <Cell {...this.props}>
        <div>{typeof amount === 'undefined' || amount === 0.0 || pristine ? '' : intl.formatNumber(amount, {format: 'MONEY',})}</div>
      </Cell>
    );
  }
}

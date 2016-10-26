import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import { StoreProto, } from '../../../redux/modules/v2/invoices';

import {DragSource, DropTarget, DragDropContext,} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import ProductForm from '../../Products/ProductForm/ProductForm';

// import StaticContainer from 'react-static-container';

import * as companyActions from '../../../redux/modules/companies';

import {createValidator, required, email, oneOf,} from '../../../utils/validation';

import classnames from 'classnames';

import styles from './InvoiceForm.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import throttle from 'lodash.throttle';

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';

import events from 'dom-helpers/events';

import {Company,} from '../../../utils/types';

import findIndex from 'lodash.findindex';

import LineEditor from './InvoiceLineEditor';

import enhanceWithClickOutside from '../../../utils/react-click-outside';

@enhanceWithClickOutside
class ClickOutsideWrapper extends React.Component {
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
import getFieldValue from "../../utils/getFieldValue";

function clamp(value, min, max){
  return Math.min(Math.max(value, min), max);
}

const ItemTypes = {
  INVOICE: 'invoice'
};

const invoiceSource = {
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

const invoiceTarget = {
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

@DropTarget(ItemTypes.INVOICE, invoiceTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.INVOICE, invoiceSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class DragHandle extends React.Component {

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
@DropTarget(ItemTypes.INVOICE, {
  drop() {
    //
  }
}, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {

  static displayName = 'InvoiceProductItems';

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

    salesAccounts: PropTypes.arrayOf(PropTypes.shape({
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

    // const {index} = store.find(id);
    const {index} = StoreProto.find.call(store, id);

    // store.move(index, atIndex);
    StoreProto.move.call(store, index, atIndex);
  };

  drop = (id, atIndex) => {
    const {
      formKey,
      store,
    } = this.props;

    // const {index} = store.find(id);
    const {index} = StoreProto.find.call(store, id);

    this.props.moveOp(formKey, index, atIndex);
  };

  findOp = (id) => {
    const {
      formKey,
      store,
    } = this.props;

    // return store.find(id);
    return StoreProto.find.call(store, id);
  };

  _onHover = ({rowIndex}) => {
    this.setState({
      rowIndex
    })
  };

  render() {

    const {intl,} = this.context;

    const {
      invoice,
      company: {salesSettings,},
      store,
      height,
      connectDropTarget,
      bodyWidth : width,
      fields: { inputType, dirty, valid, invalid, pristine, save, resetLines, submitting, values, },

    } = this.props;

    const self = this;

    // const invoices = store.getAll();

    // const rowsCount = store.getSize() + 1;
    const rowsCount = StoreProto.getSize.call(store) + 1;

    const tableHeight = 36 + (rowsCount * 50) + 2;

    // const bodyWidth = clamp(width - 50, 1220, 1345);
    const bodyWidth = clamp(width - 60, 1220, screen.width - 60);

    const tableWidth = bodyWidth;

    // const {rowIndex: activeRow, cell: activeCell} = store.getActiveRow() || {};
    const {rowIndex: activeRow, cell: activeCell} = StoreProto.getActiveRow.call(store) || {};

    const showDate = salesSettings.enableServiceDate;
    const showProducts = salesSettings.showProducts;
    const showRates = salesSettings.showRates;

    const VTEnabled = this.props.company.VATSettings.enabled;

    const inputTypeValue = getFieldValue(inputType);

    const hasVAT = inputTypeValue !== 'NO_VAT' && inputTypeValue !== 3;

    function getAmountLabel() {
      switch (inputTypeValue){
        case 1:
        case 'HT':

          return intl.formatMessage(messages.AmountHT);

        case 2:
        case 'TTC':

          return intl.formatMessage(messages.AmountTTC);

        default:

          return intl.formatMessage(messages.Amount);
      }
    }

    return (
      <div styleName='product-items-wrapper'>

        <div styleName='product-items'>

          <div styleName='products-line-1'>

            {connectDropTarget(<div className='' style={{}}>

              <ClickOutsideWrapper
                onClickOutside={(e) => {
                  if(typeof this.state.pendingRowIndex !== 'undefined'){
                    return;
                  }
                  // store.hasActiveRow() && this._setActiveRow(undefined, e);
                  StoreProto.hasActiveRow.call(store) && this._setActiveRow(undefined, e);
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
                          isAddingProduct={typeof this.state.pendingRowIndex !== 'undefined'}
                          onAddNewProduct={this._onAddNewProduct}
                          cell={activeCell}
                          styles={this.props.styles}
                          store={store}
                          rowIndex={activeRow}
                          tableWidth={tableWidth}
                          hasVAT={hasVAT}
                          VTEnabled={VTEnabled}
                          inputTypeValue={inputTypeValue}
                          company={this.props.company}
                          items={this.props.company.companyProducts.edges.map(({node: {...props}}) => ({...props}))}
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
                          const item = StoreProto.getObjectAt.call(store, rowIndex);
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
                            <div onClick={(e) => self._setActiveRow({rowIndex, cell: 'item'}, e)}>{rowIndex + 1}</div>
                           </Cell>
                         )}
                    width={0.04 * tableWidth}
                  />

                  {/* Product/Service Date */}
                  {showDate && <Column
                    columnKey={'date'}
                    align={'center'}
                    header={<Cell>{intl.formatMessage(messages.Date)}</Cell>}
                    cell={(props) => {
                      return (
                        <div onClick={(e) => self._setActiveRow({rowIndex: props.rowIndex, cell: 'date'}, e)}>
                          <DateCell
                          {...props}
                          styles={styles}
                          store={store}
                        />
                        </div>
                      );
                    }}
                    width={0.08 * tableWidth}
                  />}

                  {/* Product/Service */}
                  {showProducts && <Column
                    columnKey={'item'}
                    align={'left'}
                    header={<Cell>{intl.formatMessage(messages.Item)}</Cell>}
                    cell={(props) => {
                      return (
                        <div onClick={(e) => self._setActiveRow({rowIndex: props.rowIndex, cell: 'item'}, e)}>
                          <ProductCell
                          {...props}
                          styles={styles}
                          store={store}
                          company={this.props.company}
                        />
                        </div>
                      );
                    }}
                    width={0.145 * tableWidth}
                  />}

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
                    width={(hasVAT ? 0.25 * tableWidth : 0.28 * tableWidth) + (showDate ? 0 : 0.08 * tableWidth) + (showProducts ? 0 : 0.145 * tableWidth) + (showRates ? 0 : (0.07 + 0.09)*tableWidth)}
                    flexGrow={1}
                  />

                  {/* Qty */}
                  {showRates && <Column
                    columnKey={'qty'}
                    align={'right'}
                    header={<Cell>{intl.formatMessage(messages.Qty)}</Cell>}
                    cell={(props) => {

                      return (
                      <div onClick={(e) => self._setActiveRow({rowIndex: props.rowIndex, cell: 'qty'}, e)}>

                        <IntegerValueCell
                          {...props}
                          styles={styles}
                          type={'qty'}
                          store={store}
                         />

                       </div>
                      );
                    }}
                    width={hasVAT ? 0.05 * tableWidth : 0.07 * tableWidth}
                  />}

                  {/* rate */}
                  {showRates && <Column
                    columnKey={'rate'}
                    align={'right'}
                    header={<Cell>{intl.formatMessage(messages.Rate)}</Cell>}
                    cell={(props) => {

                      return (
                        <div onClick={(e) => self._setActiveRow({rowIndex: props.rowIndex, cell: 'rate'}, e)}>

                         <RateValueCell
                            {...props}
                            styles={styles}
                            store={store}
                         />

                        </div>
                      );
                    }}
                    width={hasVAT ? 0.08 * tableWidth : 0.09 * tableWidth}
                  />}

                  {/* amount */}
                  <Column
                    columnKey={'amount'}
                    align={'right'}
                    header={<Cell>{VTEnabled ? getAmountLabel() : intl.formatMessage(messages.Amount)}</Cell>}
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
                    width={hasVAT ? 0.08 * tableWidth : 0.10 * tableWidth}
                    flexGrow={1}
                  />

                  {/* VATPart */}
                  {hasVAT && <Column
                    columnKey={'VATPart'}
                    align={'right'}
                    header={<Cell>{intl.formatMessage(messages.VATPart)}</Cell>}
                    cell={(props) => {

                      return (

                        <div onClick={(e) => self._setActiveRow({rowIndex: props.rowIndex, cell: 'VATPart'}, e)}>

                           <VATPartValueCell
                              {...props}
                              styles={styles}
                              store={store}
                           />

                        </div>

                      );
                    }}
                    width={0.09 * tableWidth}
                    flexGrow={1}
                  />}

                  {/* discountPart */}
                  <Column
                    columnKey={'discountPart'}
                    align={'right'}
                    header={<Cell>{intl.formatMessage(messages.DiscountPart)}</Cell>}
                    cell={(props) => {

                      return (

                        <div onClick={(e) => self._setActiveRow({rowIndex: props.rowIndex, cell: 'discountPart'}, e)}>

                           <DiscountPartValueCell
                              {...props}
                              styles={styles}
                              store={store}
                           />

                        </div>

                      );
                    }}
                    width={0.08 * tableWidth}
                    flexGrow={1}
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

              {/*{invoice && store.isDirty && <button*/}
              {invoice && StoreProto.fnIsDirty.call(store) && <button
                styleName='button floatLeft sm'
                onClick={this._reset}
                style={{marginLeft: 10}}
                className='btn btn-secondary btn-sm unselectable'>{intl.formatMessage(messages['reset_all_lines'])}
              </button>}

              <div styleName='floatRight' style={{}}>

                <div styleName={'width_x'} className='row' style={{paddingRight: 5}}>

                  <div styleName='subsection12TitleText' className='col-sm-8' style={{paddingRight: 3, textAlign: 'right'}}>
                    {intl.formatMessage(messages['Subtotal'])}
                  </div>

                  <div className='col-sm-4 last-col' style={{textAlign: 'right',display: 'inline-block'}}>
                    {/* <div styleName='amount'>{intl.formatNumber(store.subtotal, {format: 'MAD'})}</div> */}
                    <div styleName='amount'>{intl.formatNumber(StoreProto.fnSubtotal.call(store), {format: 'MAD'})}</div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {this._renderProductForm()}

      </div>
    );
  }

  _onAddNewProduct = ({rowIndex}) => {
    this.setState({
      modalOpen: true,
      pendingRowIndex: rowIndex,
    });
  };
  _renderProductForm = () => {
    if(this.state.modalOpen){
      const rowIndex = this.state.pendingRowIndex;
      return (
        // <StaticContainer shouldUpdate={false}>
          <ProductForm
            company={this.props.company}
            viewer={this.props.viewer}
            formKey={'NEW'}
            onCancel={this._closeProductForm}
            onNew={this._onAddNewProduct.bind(this, {rowIndex,})}
            onDone={this._onProductFormDone.bind(null, this)}
            salesAccounts={this.props.salesAccounts}
            expensesAccounts={this.props.expensesAccounts}
          />
        // </StaticContainer>
      );
    }

    return null;
  };
  _closeProductForm = () => {
    this.setState({
      modalOpen: false,
      pendingRowIndex: undefined,
    })
  };
  _onProductFormDone = (self, {product}) => {
    const {
      company,
      store,
      fields: {
        inputType : _inputType,
      },
    } = self.props;
    const {pendingRowIndex: rowIndex} = self.state;

    console.assert(typeof rowIndex !== 'undefined', 'Bad row index');

    // store.setItem(rowIndex, {
    StoreProto.setItem.call(store, rowIndex, {
      className: `Product_${company.objectId}`,
      objectId: product.id,
      id: product.id,
      salesVATPart: product['salesVATPart'],
      salesPrice: product['salesPrice'],
    });

    const inputType = getFieldValue(_inputType);

    // store.setActiveRow({ rowIndex, cell: 'item', });
    StoreProto.setActiveRow.call(store, { rowIndex, cell: 'item', });

    const itemInputType = product['salesVATPart'] ? product['salesVATPart'].inputType : 1 /* HT */;

    const VAT_ID_TO_VALUE = {
      Value_20: 0.20,
      Value_14: 0.14,
      Value_10: 0.1,
      Value_Exempt: 0.0,
      Value_7: 0.07,

      1: 0.20,
      2: 0.14,
      3: 0.1,
      4: 0.0,
      5: 0.07,
    };

    function getItemPrice() {
      switch (inputType){
        case 1:
        case 'HT':
        case 3:
        case 'NO_VAT':

          return function () {
            switch (itemInputType){
              case 1:
              case 'HT':
              case 3:
              case 'NO_VAT':

                return product.salesPrice;

              case 2:
              case 'TTC':

                // `item.salesPrice` is TTC, convert `item.salesPrice` to HT
                return function() {
                  const itemVATValuePercent = product.salesVATPart
                    ? VAT_ID_TO_VALUE[product['salesVATPart'].value] || 0.0
                    : 0.0;

                  return product.salesPrice / (1 + itemVATValuePercent);
                }();

              default:

                throw new Error(`getItemPrice: Invalid item inputType`, itemInputType);
            }

          }();

        case 2:
        case 'TTC':

          return function () {
            switch (itemInputType){
              case 1:
              case 'HT':
              case 3:
              case 'NO_VAT':

                // `item.salesPrice` is HT, convert `item.salesPrice` to TTC
                return function() {
                  const itemVATValuePercent = product.salesVATPart
                    ? VAT_ID_TO_VALUE[product['salesVATPart'].value] || 0.0
                    : 0.0;

                  return product.salesPrice * (1 + itemVATValuePercent);
                }();

              case 2:
              case 'TTC':

                return product.salesPrice;

              default:

                throw new Error(`getItemPrice: Invalid item inputType`, itemInputType);
            }

          }();

        default:

          throw new Error(`getItemPrice: Invalid inputType`, inputType);
      }
    }

    // typeof product.salesPrice !== 'undefined' && !!product.salesPrice && store.setRate(rowIndex, getItemPrice());
    // typeof product.salesDesc !== 'undefined' && !!product.salesDesc && store.setDescription(rowIndex, product.salesDesc);

    // store.setVATPart(rowIndex, product.salesVATPart ? { inputType, ...(product.salesVATPart.value !== undefined && product.salesVATPart.value !== null ? {value: product.salesVATPart.value,} : {}), } : undefined);

    typeof product.salesPrice !== 'undefined' && !!product.salesPrice && StoreProto.setRate.call(store, rowIndex, getItemPrice());
    typeof product.salesDesc !== 'undefined' && !!product.salesDesc && StoreProto.setDescription.call(store, rowIndex, product.salesDesc);

    StoreProto.setVATPart.call(store, rowIndex, product.salesVATPart ? { inputType, ...(product.salesVATPart.value !== undefined && product.salesVATPart.value !== null ? {value: product.salesVATPart.value,} : {}), } : undefined);
  };

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

    // const {rowIndex: oldIndex} = store.getActiveRow() || {};
    const {rowIndex: oldIndex} = StoreProto.getActiveRow.call(store) || {};
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

class ProductCell extends React.Component {

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

    const {item: value} = StoreProto.getObjectAt.call(store, rowIndex);

    this.state.value = value;
  }

  componentWillReceiveProps(nextProps) {
    const {rowIndex, store,} = nextProps;

    const {item: value} = StoreProto.getObjectAt.call(store, rowIndex);

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
    const {company, ...props} = this.props;

    const value = this.state.value;

    const index = value && findIndex(company.companyProducts.edges, ({node: {id, objectId}}) => objectId === value.id || id === value.id);

    return (
      <Cell {...props}>
        {value ? <div>
          <span style={{marginLeft: 10, display: 'inline', overflow: 'hidden', textOverflow: 'ellipsis',}}
                className=''>{company.companyProducts.edges[index].node.displayName}</span>
        </div> : <div/>}
      </Cell>
    );
  }
}

class TextValueCell extends React.Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['description']).isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    const {rowIndex, store, type,} = this.props;

    const {[type]: value} = StoreProto.getObjectAt.call(store, rowIndex);

    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextprops) {
    const {rowIndex, store, type,} = nextprops;

    const {[type]: value} = StoreProto.getObjectAt.call(store, rowIndex);

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

class RateValueCell extends React.Component {

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
    const {rate, pristine,} = StoreProto.getObjectAt.call(store, rowIndex);
    const {intl,} = this.context;
    return (
      <Cell {...this.props}>
        <div>{typeof rate === 'undefined' || rate === 0.0 || pristine ? '' : intl.formatNumber(rate, {format: 'MONEY',})}</div>
      </Cell>
    );
  }
}

class AmountValueCell extends React.Component {

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
    const {qty, rate, pristine,} = StoreProto.getObjectAt.call(store, rowIndex);
    const {intl,} = this.context;
    return (
      <Cell {...this.props}>
        <div>{typeof rate === 'undefined' || rate === 0.0 || pristine ? '' : intl.formatNumber(qty * rate, {format: 'MONEY',})}</div>
      </Cell>
    );
  }
}
class DiscountPartValueCell extends React.Component {

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
    const { discountPart: { type, value, } , pristine, } = StoreProto.getObjectAt.call(store, rowIndex);
    const isPercent = type === 'Percent' || type === 2;
    const {intl,} = this.context;
    return (
      <Cell {...this.props}>
        <div>{typeof value === 'undefined' || value === 0.0 || pristine ? '' : intl.formatNumber(isPercent ? value / 100 : value, {format: isPercent ? 'PERCENT' : 'MONEY',})}</div>
      </Cell>
    );
  }
}

const VAT_ID_TO_TEXT = {
  1: `20%`,
  2: `14%`,
  3: `10%`,
  4: `Exonéré`,
  5: `7%`,
};

const VAT_NAME_TO_ID = {
  Value_20: 1,
  Value_14: 2,
  Value_10: 3,
  Value_Exempt: 4,
  Value_7: 5,
};

class VATPartValueCell extends React.Component {

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
    const {intl,} = this.context;

    const { VATPart: value, } = StoreProto.getObjectAt.call(store, rowIndex);

    return (
      <Cell {...this.props}>
        <div>{value && VAT_ID_TO_TEXT[VAT_NAME_TO_ID[value.value]]}</div>
      </Cell>
    );
  }
}

// class TaxableCell extends React.Component {
//
//   static propTypes = {
//     styles: PropTypes.object.isRequired,
//     store: PropTypes.object.isRequired,
//     rowIndex: PropTypes.number.isRequired,
//   };
//
//   render() {
//     const { styles, store, rowIndex, } = this.props;
//     const {taxable} = StoreProto.getObjectAt.call(store, rowIndex);
//     return (
//       <Cell {...this.props}>
//         <div>
//
//           <div
//             style={{
//             }}
//             className={classnames({
//             [styles['checkbox-sprite']]: true,
//             [styles['checked-2']]: taxable,
//             })}>
//
//           </div>
//
//         </div>
//       </Cell>
//     );
//   }
// }

class IntegerValueCell extends React.Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['qty']).isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    const {rowIndex, store, type,} = this.props;

    const {[type]: value} = StoreProto.getObjectAt.call(store, rowIndex);

    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {rowIndex, store, type,} = nextProps;

    const {[type]: value,} = StoreProto.getObjectAt.call(store, rowIndex);

    if (this.state.value !== value) {
      this.setState({
        value,
      });
    }
  }

  render() {
    const {rowIndex, store,} = this.props;
    const {pristine,} = StoreProto.getObjectAt.call(store, rowIndex);
    return (
      <Cell {...this.props}>
        <div>{pristine ? '' : this.state.value}</div>
      </Cell>
    );
  }
}

class DateCell extends React.Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    const {rowIndex, store,} = this.props;

    const {date: value} = StoreProto.getObjectAt.call(store, rowIndex);

    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {rowIndex, store,} = nextProps;

    const {date: value} = StoreProto.getObjectAt.call(store, rowIndex);

    if (this.state.value !== value) {
      this.setState({
        value,
      });
    }
  }

  render() {
    return (
      <Cell {...this.props}>
        <div>{this.state.value ? moment(this.state.value).format('ll') : ''}</div>
      </Cell>
    );
  }
}

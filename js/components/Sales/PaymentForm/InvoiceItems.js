import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import classnames from 'classnames';

import styles from './PaymentForm.scss';

import CSSModules from 'react-css-modules';

import parseNumber from '../../../utils/number/parse';

const MONEY_VALUE_REGEX = /^\d+((,|\.)\d{3})*((\.|,)\d*)?$/;

import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';

import moment from 'moment';

import getFieldValue from '../../utils/getFieldValue';

import stopEvent from '../../../utils/stopEvent';

import events from 'dom-helpers/events';

import { Modes as SelectionModes, } from '../../../redux/modules/paymentsOfInvoices';

import {Company,} from '../../../utils/types';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true,})
class SelectHandle extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    id: PropTypes.any.isRequired,
  };

  refresh = () => {
    this.forceUpdate();
  };

  render() {
    const { store, styles, rowIndex,} = this.props;
    const checked = store.isSelected(rowIndex);

    return (
      <div
        style={{  }}
        className={''}>

        <input
          type='checkbox'
          checked={checked}
          onChange={e => {}}
          value={`item-${rowIndex}`}
          // styleName={'select-input'}
          className={classnames(styles['select-input'], { [styles['checked']]: checked, })}
        />

      </div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'PaymentInvoiceItems';

  static contextTypes = {
    intl: intlShape.isRequired
  };

  static propTypes = {
    bodyWidth: PropTypes.number.isRequired,

    store: PropTypes.object.isRequired,

    fields: PropTypes.shape({
      dirty: PropTypes.bool.isRequired,
      values: PropTypes.object.isRequired,
      valid: PropTypes.bool.isRequired,
      invalid: PropTypes.bool.isRequired,
      pristine: PropTypes.bool.isRequired,
      submitting: PropTypes.bool.isRequired,
      refresh: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    showInvoices: false,
  };

  _setRef = (name, ref) => {
    // this[name] = ref;
  }

  _refresh = (rowIndex) => {
    const ref = this[`select${rowIndex}`];
    if(ref){
      ref.refresh();
    }

    // setImmediate(() => {
    //   this.props.fields.refresh();
    // });
  };

  componentDidMount(){
    setTimeout(() => {
      this.setState({
        showInvoices: true,
      })
    }, 300)
  }

  render() {
    const { showInvoices, } = this.state;

    const {intl,} = this.context;

    const {
      store,
      bodyWidth : width,
      fields: { dirty, valid, invalid, pristine, save, submitting, values,},
    } = this.props;

    const self = this;

    const rowsCount = showInvoices ? store.getSize() : 0;

    const tableHeight = 36 + (rowsCount * 50) + 2;

    const bodyWidth = width - 60;

    const tableWidth = bodyWidth - 2;

    return (
      <div styleName='product-items-wrapper'>

        <div styleName='product-items'>

          <div styleName='products-line-1'>

            <div styleName='subsection20TitleText'>Opérations en cours</div>

            <br/>

            <div className='' style={{}}>

              <RootCloseWrapper onRootClose={this._onRootClose}>

                <Table
                  renderRow={(Component, rowIndex, {style, className}) => {
                      return (
                       <div style={{}}>

                          <Component
                            style={{...style, zIndex: 0}}
                             className={`${className} ${styles['table-row-container']} ${styles[`${self.state.rowIndex === rowIndex ? '' : 'not-'}isDragging`]}`}
                           />

                        </div>
                      );
                    }}
                  // onRowClick={(e, rowIndex) => self._onToggle(rowIndex, e)}
                  rowClassNameGetter={(rowIndex) => `${styles.row} ${rowIndex === 0 ? styles['first-row'] : ''} table-row`}
                  rowHeight={50}
                  rowsCount={rowsCount}
                  height={tableHeight}
                  width={tableWidth}
                  headerHeight={36}>

                  {/* select */}
                  <Column
                    columnKey={'select'}
                    align={'center'}
                    width={0.035 * tableWidth}
                    header={<Cell onClick={this._onToggleAll}><input aria-checked={function(){
                  switch (store.mode) {
                    case SelectionModes.All: return 'true';
                    case SelectionModes.None: return 'false';
                    case SelectionModes.Some: return 'mixed';
                  }
                }()} onChange={e => {}} checked={store.mode === SelectionModes.All} className={`${styles['select-input-on-header']} ${store.mode === SelectionModes.All ? styles['checked'] : ''} ${styles['select-input']}`} type='checkbox'/></Cell>}
                    cell={({rowIndex, ...props}) => {
                            const item = store.getObjectAt(rowIndex);
                            return (
                               <Cell {...props} onClick={self._onToggle.bind(self, rowIndex)}>
                                  <SelectHandle
                                    ref={self._setRef.bind(self, `select${rowIndex}`)}
                                    rowIndex={rowIndex}
                                    id={item.id}
                                    styles={styles}
                                    store={store}
                                  />
                               </Cell>
                             );
                          }}
                  />

                  {/* Product/Service */}
                  <Column
                    columnKey={'item'}
                    align={'left'}
                    header={<Cell>{intl.formatMessage(messages.Item)}</Cell>}
                    cell={({rowIndex, ...props}) => {
                        return (
                          // <div onClick={self._onToggle.bind(self, rowIndex)}>
                          <div>
                            <InvoiceInfoCell
                            {...props}
                            onInvoice={this._onInvoice.bind(this, rowIndex)}
                            rowIndex={rowIndex}
                            styles={styles}
                            store={store}
                          />
                          </div>
                        );
                      }}
                    width={0.41 * tableWidth}
                    flexGrow={1}
                  />

                  {/* Due Date */}
                  <Column
                    columnKey={'dueDate'}
                    align={'left'}
                    header={<Cell>{intl.formatMessage(messages.DueDate)}</Cell>}
                    cell={({rowIndex, ...props}) => {

                        return (
                        // <div onClick={self._onToggle.bind(self, rowIndex)}>
                        <div>

                          <DueDateCell
                            {...props}
                            rowIndex={rowIndex}
                            styles={styles}
                            store={store}
                           />

                         </div>
                        );
                      }}
                    width={0.125 * tableWidth}
                  />

                  {/* originalAmount */}
                  <Column
                    columnKey={'originalAmount'}
                    align={'right'}
                    header={<Cell>{intl.formatMessage(messages.OriginalAmount)}</Cell>}
                    cell={({rowIndex, ...props}) => {

                        return (
                          // <div onClick={self._onToggle.bind(self, rowIndex)}>
                          <div>

                           <OriginalAmountCell
                              {...props}
                              rowIndex={rowIndex}
                              styles={styles}
                              store={store}
                           />

                          </div>
                        );
                      }}
                    width={0.13 * tableWidth}
                  />

                  {/* Open Balance */}
                  <Column
                    columnKey={'openBalance'}
                    align={'right'}
                    header={<Cell>{intl.formatMessage(messages.OpenBalance)}</Cell>}
                    cell={({rowIndex, ...props}) => {

                        return (

                          // <div onClick={self._onToggle.bind(self, rowIndex)}>
                          <div>

                             <OpenBalanceCell
                                {...props}
                                rowIndex={rowIndex}
                                styles={styles}
                                store={store}
                             />

                          </div>

                        );
                      }}
                    width={0.15 * tableWidth}
                  />

                  {/* Amount */}
                  <Column
                    columnKey={'amount'}
                    align={'right'}
                    header={<Cell>{intl.formatMessage(messages.PaymentAmount)}</Cell>}
                    cell={({rowIndex, ...props}) => {

                        return (

                          <div onClick={(e) => {  }}>

                            <PaymentAmountCell
                              {...props}
                                rowIndex={rowIndex}
                                refresh={self._refresh.bind(self, rowIndex)}
                                styles={styles}
                                store={store}
                                onAmountChanged={this._onAmountChanged}
                                setActiveRow={this._setActiveRow}
                              />

                          </div>

                        );
                      }}
                    width={0.15 * tableWidth}
                  />


                </Table>

              </RootCloseWrapper>

            </div>

          </div>

          {/*<div styleName='products-line-2'>

            <div className='line-2-2' style={{minHeight: 30, marginTop: 15, }}>

              <button
                styleName='button floatLeft sm'
                onClick={this._clearAll}
                style={{marginLeft: 10}}
                className='btn btn-secondary btn-sm unselectable'>{intl.formatMessage(messages['clear_all_payments'])}
              </button>

              <div styleName='floatRight'>

                <div style={{width: 350}} className='row'>

                  <div styleName='subsection12TitleText' className='col-sm-6' style={{textAlign: 'right'}}>
                    Total Amount received
                  </div>

                  <div style={{display: 'inline-block'}} className='col-sm-6' style={{textAlign: 'right'}}>
                    <div styleName='amount'>MAD 0.00</div>
                  </div>

                </div>

              </div>

            </div>

          </div>*/}

        </div>

      </div>
    );
  }

  _onAmountChanged = (rowIndex, amount) => {
    const { formKey, store, fields: { amountReceived, }, } = this.props;
    const amountReceivedValue = getFieldValue(amountReceived);
    const total = store.total;
    if(typeof amountReceivedValue === 'number' && isFinite(amountReceivedValue)){
      // Do nothing
      switch(formKey){
        case 'NEW':
          amountReceived.onChange(total);
          break;

        default:

          if(amountReceivedValue >= total){
            amountReceived.onChange(amountReceivedValue);
          }else{
            amountReceived.onChange(total);
          }
      }

    }else{
      amountReceived.onChange(total);
    }
  };

  _onRootClose = () => {
    this._setActiveRow(undefined);
  };

  _onInvoice = (rowIndex, e) => {
    stopEvent(e);
    if(this.props.onInvoice){
      const { store, } = this.props;
      const obj = store.getObjectAt(rowIndex);
      this.props.onInvoice(
        obj.invoice.__original);
    }
  };

  _setActiveRow = (rowIndex) => {
    const { store, } = this.props;
    const row = store.activeRow;
    if(row !== rowIndex){
      store.setActiveRow(row);
    }
  };

  _onToggle = (rowIndex, e) => {
    stopEvent(e);
    const { store, fields: { refresh, amountReceived, }, } = this.props;
    store.toggle(rowIndex);

    setImmediate(() => {
      amountReceived.onChange(store.total);
      // refresh();
    });
  };

  _onToggleAll = (e) => {
    stopEvent(e);
    const { store, fields: { refresh, amountReceived, }, } = this.props;
    store.mode === SelectionModes.None || store.mode === SelectionModes.Some
      ? store.toggleAll()
      : store.toggleNone();

    setImmediate(() => {
      amountReceived.onChange(store.total);
      // refresh();
    });
  };

}

class InvoiceInfoCell extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    onInvoice: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  render() {
    const {...props} = this.props;

    const { store, rowIndex, } = this.props;
    const {invoice} = store.getObjectAt(rowIndex);

    return (
      <Cell {...props}>
         <div>
          <span style={{marginLeft: 10, display: 'inline', overflow: 'hidden', textOverflow: 'ellipsis',}}
                className=''><a onClick={this.props.onInvoice}>{'Facture'} n°{invoice.refNo}</a> ({moment(invoice.date).format('ll')})</span>
        </div>
      </Cell>
    );
  }
}

class PaymentAmountCell extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props, context){
    super(props, context);

    const {rowIndex, store, } = this.props;

    const {amount: value} = store.getObjectAt(rowIndex);

    const {intl,} = this.context;

    const fValue = typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(value, {format: 'MONEY',});

    this.state = {
      value: fValue,
    };
  }

  componentWillReceiveProps(nextProps){
    const {intl,} = this.context;
    const {rowIndex, store, } = nextProps;

    const {amount: value} = store.getObjectAt(rowIndex);

    const fValue = typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(value, {format: 'MONEY',});

    if(this.state.value !== fValue){
      this.setState({
        value: fValue,
      });
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   const self = this;
  //   const val = nextState.value !== this.state.value || function(){
  //     const {intl,} = self.context;
  //     const {rowIndex, store, } = nextProps;
  //
  //     const {amount: value} = store.getObjectAt(rowIndex);
  //
  //     const fValue = typeof value !== 'number' || !isFinite(value) ? undefined : intl.formatNumber(value, {format: 'MONEY',});
  //     return self.state.value !== fValue;
  //   }();
  //
  //   console.log('shouldComponentUpdate', this.props.rowIndex, val);
  //
  //   return val;
  // }

  render() {
    const { intl, } = this.context;
    const { store, rowIndex, } = this.props;
    const item = store.getObjectAt(rowIndex);
    return (
      <Cell {...this.props} onClick={e => { stopEvent(e); this.props.setActiveRow(rowIndex); }}>
        <div>

          <input
            autoFocus={store.activeRow === rowIndex}
            className={classnames('form-control', { 'has-error': store.showErrors && !item.pristine && ! store.isKeyValid(rowIndex, 'amount'), })}
            style={{
              textAlign: 'right',
            }}
            type='text'
            pattern={MONEY_VALUE_REGEX}
            value={this.state.value || ''}
            onBlur={(e) => {
              stopEvent(e);
              const self = this;
              // const value = parseFloat(String(this.state.value || '').replace('.', '').replace(',', '').replace(/\s+/, '')) || 0.0;
              const value = function(){
                const val = parseNumber(String(self.state.value || ''));
                // return !val || isFinite(val) ? val : 0.0;
                return val && isFinite(val) ? val : undefined;
              }();
              this.setState({
                value: value ? intl.formatNumber(value, {format: 'MONEY',}) : undefined,
              }, () => {
                store.setAmount(rowIndex, value);
                this.props.onAmountChanged();
                // self.props.refresh();
              });
            }}
            onFocus={(e) => {
            }}
            onChange={(e) => {
              const value = e.target.value;
              this.setState({
                value,
              }, () => {
                // const self = this;
                // // const value = parseFloat(String(this.state.value || '').replace('.', '').replace(',', '').replace(/\s+/, ''));
                // const value = parseNumber(String(this.state.value || ''));
                // value && isFinite(value) && function(){
                //   store.setAmount(rowIndex, value);
                //   self.props.refresh();
                // }();
              });
            }}
          />

        </div>
      </Cell>
    );
  }
}
class OpenBalanceCell extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };


  render() {
    const { intl, } = this.context;
    const { store, rowIndex, } = this.props;
    const item = store.getObjectAt(rowIndex);
    return (
      <Cell {...this.props}>
        <div>

          {getOpenBalance(intl, item)}

        </div>
      </Cell>
    );
  }
}
class OriginalAmountCell extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };


  render() {
    const { intl, } = this.context;
    const { store, rowIndex, } = this.props;
    const item = store.getObjectAt(rowIndex);
    return (
      <Cell {...this.props}>
        <div>

          {getOriginalAmount(intl, item.invoice)}

        </div>
      </Cell>
    );
  }
}

class DueDateCell extends Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };


  render() {
    const { store, rowIndex, } = this.props;
    const item = store.getObjectAt(rowIndex);
    return (
      <Cell {...this.props}>
        <div>

          {moment(item.dueDate).format('ll')}

        </div>
      </Cell>
    );
  }
}

function getOpenBalance(intl, { invoice: { total, balanceDue, }, amount, }){
  return intl.formatNumber(typeof amount !== 'undefined' && amount !== null ? total - amount : balanceDue, { format: 'MAD', });
}
function getOriginalAmount(intl, {total}){
  return intl.formatNumber(total, { format: 'MAD', });
}

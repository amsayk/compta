import React, {Component, PropTypes} from 'react';

import messages from './messages';

import {intlShape,} from 'react-intl';

// import isEqual from 'lodash.isequal';

import moment from 'moment';

import classnames from 'classnames';

import ProductListItem from './ProductListItem';

import parseNumber from '../../../utils/number/parse';

const MONEY_VALUE_REGEX = /^\d+((,|\.)\d{3})*((\.|,)\d*)?$/;

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Combobox from 'react-widgets/lib/Combobox';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

export default class extends Component{

  static displayName = 'InvoiceLineEditor';

  static propTypes = {
    company: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    tableWidth: PropTypes.number.isRequired,
    rowIndex: PropTypes.number.isRequired,
    cell: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      salesDesc: PropTypes.string,
      salesPrice: PropTypes.number,
    })).isRequired,
    onAddNewProduct: PropTypes.func.isRequired,
    isAddingProduct: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  state = {
  };

  _setElmRef = (name, ref) => {
    this[`_${name}`] = ref;
  };

  _onRefresh = (current) => {
    ['description', 'rate', 'amount'].forEach(item => {
      if(item === current){
        return;
      }
      const ref = this[`_${item}`];
      if(ref){
        setImmediate(() => {
          ref.refresh();
        });
      }
    })
  }

  render(){
    const {intl,} = this.context;

    const {
      company: {salesSettings,},

      store,

      items,

      tableWidth,
      styles,
      rowIndex: row,

      cell,

    } = this.props;

    const showDate = salesSettings.enableServiceDate;
    const showProducts = salesSettings.showProducts;
    const showRates = salesSettings.showRates;

    return (
      <div style={{position: 'absolute', top: (row * 50) - 1, }}>

        <Table
          renderRow={(Component, rowIndex, {style, className}) => {
            return (
              <Component style={{...style, zIndex: 1}} className={className}/>
            );
          }}
          rowClassNameGetter={(rowIndex) => `${styles['row']} ${row === 0 ? styles['first-row'] : ''} ${styles['row-is-editing']} table-row not-isDragging`}
          rowHeight={50}
          rowsCount={1}
          height={54}
          width={tableWidth - (0.03 * tableWidth)}
          headerHeight={0}>

          {/* Space */}
          <Column
            columnKey={'add'}
            align={'center'}
            width={0.035 * tableWidth}
            cell={({...props}) => {
                          return (
                             <Cell {...props}>
                                <AddIcon
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
            cell={({...props}) => (
                           <Cell {...props}>
                           <div>{row + 1}</div>
                           </Cell>
                         )}
            width={0.04 * tableWidth}
          />

          {/* Product/Service Date*/}
          {showDate && <Column
            columnKey={'date'}
            align={'center'}
            header={<Cell>{intl.formatMessage(messages.Date)}</Cell>}
            cell={(props) => <DateCellEditor {...props} styles={styles} store={store} rowIndex={row} active={this.props.isAddingProduct ? false : cell === 'date'}/>}
            width={0.08 * tableWidth}
          />}

          {/* Product/Service */}
          {showProducts && <Column
            columnKey={'item'}
            align={'left'}
            header={<Cell>{intl.formatMessage(messages.Item)}</Cell>}
            cell={(props) => <ItemCellEditor refresh={this._onRefresh} onAddNewProduct={this.props.onAddNewProduct} company={this.props.company} items={items} {...props} styles={styles} store={store} rowIndex={row} active={this.props.isAddingProduct ? false : cell === 'item' || !cell}/>}
            width={0.145 * tableWidth}
          />}

          {/* DESCRIPTION */}
          <Column
            columnKey={'description'}
            align={'left'}
            header={<Cell>{intl.formatMessage(messages.Description)}</Cell>}
            cell={(props) => <DescriptionCellEditor {...props} ref={this._setElmRef.bind(this, 'description')} styles={styles} store={store} rowIndex={row} active={this.props.isAddingProduct ? false : cell === 'description'}/>}

            width={(0.28 * tableWidth) + (showDate ? 0 : 0.08 * tableWidth) + (showProducts ? 0 : 0.145 * tableWidth) + (showRates ? 0 : (0.07 + 0.09)*tableWidth)}
            flexGrow={1}
          />

          {/* Qty */}
          {showRates && <Column
            columnKey={'qty'}
            align={'right'}
            header={<Cell>{intl.formatMessage(messages.Qty)}</Cell>}
            cell={(props) => <QtyCellEditor refresh={this._onRefresh} {...props} styles={styles} store={store} rowIndex={row} active={this.props.isAddingProduct ? false : cell === 'qty'}/>}
            width={0.07 * tableWidth}
          />}

          {/* rate */}
          {showRates && <Column
            columnKey={'rate'}
            align={'right'}
            header={<Cell>{intl.formatMessage(messages.Rate)}</Cell>}
            cell={(props) => <RateCellEditor refresh={this._onRefresh} ref={this._setElmRef.bind(this, 'rate')} company={this.props.company} {...props} styles={styles} store={store} rowIndex={row} active={this.props.isAddingProduct ? false : cell === 'rate'}/>}
            width={0.09 * tableWidth}
          />}

          {/* amount */}
          <Column
            columnKey={'amount'}
            align={'right'}
            header={<Cell>{intl.formatMessage(messages.Amount)}</Cell>}
            cell={(props) => <AmountCellEditor refresh={this._onRefresh} ref={this._setElmRef.bind(this, 'amount')} company={this.props.company} {...props} styles={styles} store={store} rowIndex={row} active={this.props.isAddingProduct ? false : cell === 'amount'}/>}
            width={0.10 * tableWidth}
            flexGrow={1}
          />

          {/* discountPart */}
          <Column
            columnKey={'discountPart'}
            align={'right'}
            header={<Cell>{intl.formatMessage(messages.DiscountPart)}</Cell>}
            cell={(props) => <DiscountPartCellEditor refresh={this._onRefresh} ref={this._setElmRef.bind(this, 'discountPart')} company={this.props.company} {...props} styles={styles} store={store} rowIndex={row} active={this.props.isAddingProduct ? false : cell === 'discountPart'}/>}
            width={0.08 * tableWidth}
            flexGrow={1}
          />

        </Table>

      </div>

    );
  }
}

const NEW_ITEM = {
  id: 'NEW',
};

class ItemCellEditor extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    })).isRequired,
    company: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
  };

  state = {
  };

  constructor(props, context){
    super(props, context);

    const {rowIndex, store, } = this.props;

    const {item: value} = store.getObjectAt(rowIndex);

    this.state.value = value;
    this.state.open = props.active;
  }

  componentWillReceiveProps(nextProps){
    const {rowIndex, store, } = nextProps;

    const {item: value} = store.getObjectAt(rowIndex);

    // if(! isEqual(this.state.value, value)){
      this.setState({
        value,
      });
    // }
  }

  componentDidMount(){
  }

  _onAddNew = () => {
    this.props.onAddNewProduct({
      rowIndex: this.props.rowIndex,
    });
  };

  _onToggle = e => {
    this.setState({
      open: !this.state.open,
    });
  };

  _renderEditor = ({rowIndex, items, store, props, }) => {

    const { intl, } = this.context;

    const self = this;

    const el = store.getObjectAt(rowIndex);

    const value = el.item;

    return (
      <Cell {...props}>

        <div>

          <Combobox
            caseSensitive={false}
            filter={(a, b) => {
              if(a.id === NEW_ITEM.id){
                return true;
              }
              return a.displayName.indexOf(b) !== -1;
            }}
            open={this.state.open}
            onToggle={this._onToggle}
            autoFocus={props.active}
            placeholder={intl.formatMessage(messages['itemPlaceholder'])}
            data={[NEW_ITEM].concat(items)}
            className={classnames({
              'has-error': store.showErrors && !el.pristine && ! store.isKeyValid(rowIndex, 'item'),
            })}
            // busy={this.state.showItems}
            value={value && value.objectId}
            onSelect={item => {
              if(item.id === NEW_ITEM.id){
                return false;
              }
            }}
            onChange={item => {
              if(!item || typeof item === 'string'){
                store.setItem(rowIndex, undefined);
                return;
              }

              if(item.id === NEW_ITEM.id){
                return;
              }

              if(typeof item !== 'string'){
                store.setItem(rowIndex, {
                  className: `Product_${this.props.company.objectId}`,
                  id: item['objectId'],
                  objectId: item['objectId'],
                  incomeAccountCode: item['incomeAccountCode'],
                });

                typeof item.salesPrice !== 'undefined' && !!item.salesPrice && store.setRate(rowIndex, item.salesPrice);
                typeof item.salesDesc !== 'undefined' && !!item.salesDesc && store.setDescription(rowIndex, item.salesDesc);

                this.props.refresh('item');
              }
            }}
            textField={'displayName'}
            valueField='objectId'
            // disabled
            // groupBy={ person => person.name.length }
            // groupComponent={GroupByLength}
            itemComponent={props => <ProductListItem {...props} onAddNew={this._onAddNew}/>}
          />

        </div>

      </Cell>
    );
  };

  render() {
    const {rowIndex, store, styles, items, ...props} = this.props;

    return this._renderEditor({rowIndex, store, items, props, styles});
  }
}

class DescriptionCellEditor extends Component {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props, context){
    super(props, context);

    const {rowIndex, store, } = this.props;

    const {description: value} = store.getObjectAt(rowIndex);

    this.state = {
      value,
    };
  }

  refresh = () => {
    const {rowIndex, store, } = this.props;
    const {description: value} = store.getObjectAt(rowIndex);

    if(this.state.value !== value){
      this.setState({
        value,
      });
    }
  };

  componentWillReceiveProps(nextProps){
    const {rowIndex, store, } = nextProps;

    const {description: value} = store.getObjectAt(rowIndex);

    if(this.state.value !== value){
      this.setState({
        value,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    const {rowIndex, store, } = nextProps;

    const {description: value} = store.getObjectAt(rowIndex);

    return nextState.value !== this.state.value || this.state.value !== value;
  }

  _renderEditor = ({rowIndex, store, props}) => {
    const el = store.getObjectAt(rowIndex);
    return (
      <Cell {...props}>
        <div className={''}>
          <input
            autoFocus={this.props.active}
            className={classnames('form-control', { 'has-error': store.showErrors && !el.pristine && ! store.isKeyValid(rowIndex, 'description'), })}
            style={{}}
            type='text'
            value={this.state.value}
            onBlur={(e) => {
            }}
            onFocus={(e) => {
            }}
            onChange={(e) => {
              this.setState({
                value: e.target.value,
              }, () => {
                  store.setDescription(rowIndex, this.state.value);
              });
            }}/>
        </div>
      </Cell>
    );
  };

  render() {
    const {
      rowIndex,
      styles,
      store,
      onChange,
      ...props
    } = this.props;

    return this._renderEditor({rowIndex, onChange, store, props, styles});
  }
}

class QtyCellEditor extends Component {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props, context){
    super(props, context);

    const {rowIndex, store, } = this.props;

    const {qty: value} = store.getObjectAt(rowIndex);

    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps){
    const {rowIndex, store, } = nextProps;

    const {qty: value} = store.getObjectAt(rowIndex);

    if(this.state.value !== value){
      this.setState({
        value,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    const {rowIndex, store, } = nextProps;

    const {qty: value} = store.getObjectAt(rowIndex);

    return nextState.value !== this.state.value || this.state.value !== value;
  }

  _renderEditor = ({rowIndex, store, props, styles}) => {
    return (
      <Cell {...props}>
        <div className={''}>
          <input
            autoFocus={props.active}
            className={'form-control'}
            style={{
              textAlign: 'right',
              height: 34,
            }}
            type='number'
            pattern={/^\d+$/}
            value={this.state.value}
            onBlur={(e) => {
              const value = parseInt(this.state.value) || 1;
              this.setState({
                value,
              }, () => {
                store.setQty(rowIndex, this.state.value);
              })
            }}
            onFocus={(e) => {
            }}
            onChange={(e) => {
              const self = this;
              const value = parseInt(e.target.value) || '';
              this.setState({
                value,
              }, () => {
                const value = parseInt(this.state.value);
                isNaN(value) || function() {
                  store.setQty(rowIndex, value);
                  self.props.refresh('qty');
                }();
              });
            }}/>
        </div>
      </Cell>
    );
  };

  render() {
    const {rowIndex, styles, store, ...props} = this.props;

    return this._renderEditor({rowIndex, store, props, styles});
  }
}

class RateCellEditor extends Component {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props, context){
    super(props, context);

    const {rowIndex, store, } = this.props;

    const {rate: value} = store.getObjectAt(rowIndex);

    const {intl,} = this.context;

    this.state = {
      value: !value || !isFinite(value) ? undefined : intl.formatNumber(value, {format: 'MONEY',}),
    };
  }

  refresh = () => {
    const {intl,} = this.context;
    const {rowIndex, store, } = this.props;
    const {rate: value} = store.getObjectAt(rowIndex);

    const fValue = !value || !isFinite(value) ? undefined : intl.formatNumber(value, {format: 'MONEY',});

    if(this.state.value !== fValue){
      this.setState({
        value: fValue,
      });
    }
  };

  componentWillReceiveProps(nextProps){
    const {intl,} = this.context;
    const {rowIndex, store, } = nextProps;

    const {rate: value} = store.getObjectAt(rowIndex);

    const fValue = !value || !isFinite(value) ? undefined : intl.formatNumber(value, {format: 'MONEY',});

    if(this.state.value !== fValue){
      this.setState({
        value: fValue,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    const {intl,} = this.context;
    const {rowIndex, store, } = nextProps;

    const {rate: value} = store.getObjectAt(rowIndex);

    const fValue = !value || !isFinite(value) ? undefined : intl.formatNumber(value, {format: 'MONEY',});

    return nextState.value !== this.state.value || this.state.value !== fValue;
  }

  _renderEditor = ({rowIndex, store, props, styles}) => {
    const {intl,} = this.context;
    const el = store.getObjectAt(rowIndex);
    return (
      <Cell {...props}>
        <div className={''}>
          <input
            autoFocus={this.props.active}
            className={classnames('form-control', { 'has-error': props.company.salesSettings.showRates ? store.showErrors && !el.pristine && ! store.isKeyValid(rowIndex, 'rate') : false, })}
            style={{
              textAlign: 'right',
            }}
            type='text'
            pattern={MONEY_VALUE_REGEX}
            value={this.state.value || ''}
            onBlur={(e) => {
              const self = this;
              const value = function(){
                const val = parseNumber(String(self.state.value || ''));
                return val && isFinite(val) ? val : 0.0;
              }();
              this.setState({
                value: !value || !isFinite(value) ? undefined : intl.formatNumber(value, {format: 'MONEY',}),
              }, () => {
                store.setRate(rowIndex, !value || !isFinite(value) ? 0.0 : value);
              });
            }}
            onFocus={(e) => {
            }}
            onChange={(e) => {
              const value = e.target.value;
              this.setState({
                value,
              }, () => {
                const self = this;
                const value = parseNumber(String(this.state.value || ''));
                value && isFinite(value) && function(){
                  store.setRate(rowIndex, value);
                  self.props.refresh('rate');
                }();
              });
            }}/>
        </div>
      </Cell>
    );
  };

  render() {
    const {rowIndex, styles, onChange, store, ...props} = this.props;

    return this._renderEditor({rowIndex, onChange, store, props, styles});
  }
}


const EMPTY_DISCOUNT_PART = {
  type: 'Value',
  value: 0.0,
};

function getDiscountValue(spec/*{type, value}*/){
  if(!isValidDiscount(spec)){
    return undefined;
  }

  switch (spec.type) {
    case 'Value':    return spec.value || 0.0;
    case 1:          return spec.value || 0.0;

    case 'Percent':  return (spec.value || 0.0) / 100;
    case 2:          return (spec.value || 0.0) / 100;
  }
}

function isValidDiscount({type, value}){
  switch (type) {
    case 'Value':    return value && isFinite(value) && value >= 0.0;
    case 1:          return value && isFinite(value) && value >= 0.0;

    case 'Percent':  return value && isFinite(value) && value >= 0.0 && value <= 100;
    case 2:          return value && isFinite(value) && value >= 0.0 && value <= 100;
  }
}

class DiscountPartCellEditor extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props, context){
    super(props, context);

    const {rowIndex, store, } = this.props;

    const {discountPart = EMPTY_DISCOUNT_PART} = store.getObjectAt(rowIndex);
    const { type, value, } = discountPart;

    const discountValue = getDiscountValue({ type, value, });

    const {intl,} = this.context;

    this.state = {
      value: !discountValue || !isFinite(discountValue) ? undefined : intl.formatNumber(
        discountValue, {format: type === 'Percent' ? 'PERCENT' : 'MONEY',}),
    };
  }

  refresh = () => {
    const {rowIndex, store, } = this.props;
    const {discountPart = EMPTY_DISCOUNT_PART} = store.getObjectAt(rowIndex);
    const { type, value, } = discountPart;

    const discountValue = getDiscountValue({ type, value, });

    if(parseNumber(
      String(this.state.value || '').replace('%', '')
    ) !== discountValue){
      const {intl,} = this.context;
      this.setState({
        value: !discountValue || !isFinite(discountValue) ? undefined : intl.formatNumber(discountValue, {format: type === 'Percent' ? 'PERCENT' : 'MONEY',}),
      });
    }
  };

  componentWillReceiveProps(nextProps){
    const {rowIndex, store, } = nextProps;

    const {discountPart = EMPTY_DISCOUNT_PART} = store.getObjectAt(rowIndex);
    const { type, value, } = discountPart;

    const discountValue = getDiscountValue({ type, value, });

    if(parseNumber(
      String(this.state.value || '').replace('%', '')
    ) !== discountValue){
      const {intl,} = this.context;
      this.setState({
        value: !discountValue || !isFinite(discountValue) ? undefined : intl.formatNumber(discountValue, {format: type === 'Percent' ? 'PERCENT' : 'MONEY',}),
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    const {rowIndex, store, } = nextProps;

    const {discountPart = EMPTY_DISCOUNT_PART} = store.getObjectAt(rowIndex);
    const { type, value, } = discountPart;
    const discountValue = getDiscountValue({ type, value, });

    return nextState.value !== this.state.value || discountValue !== parseNumber(
      String(this.state.value || '').replace('%', '')
    );
  }

  _renderEditor = ({rowIndex, store, props, styles}) => {
    const {intl,} = this.context;
    const el = store.getObjectAt(rowIndex);
    return (
      <Cell {...props}>
        <div className={''}>
          <input
            autoFocus={props.active}
            className={classnames('form-control')}
            style={{
              textAlign: 'right',
            }}
            type='text'
            pattern={MONEY_VALUE_REGEX}
            placeholder={'MAD or %'}
            value={this.state.value || ''}
            onBlur={(e) => {
              const self = this;
              const { type, value, isPercent, } = function(){
                const str = String(self.state.value || '');
                const isPercent = str.indexOf('%') !== -1;
                const val = parseNumber(str.replace('%', ''));
                return val && isFinite(val) && isValidDiscount({ type: isPercent ? 'Percent' : 'Value', value: val, }) ? { isPercent, type: isPercent ? 'Percent' : 'Value', value: val, } : { ...EMPTY_DISCOUNT_PART, isPercent: false, };
              }();
              this.setState({
                value: !value || !isFinite(value) ? undefined : intl.formatNumber(isPercent ? value / 100 : value, {format: isPercent ? 'PERCENT' : 'MONEY',}),
              }, () => {
                store.setDiscountPart(rowIndex, { type, value, });
              });
            }}
            onFocus={(e) => {
            }}
            onChange={(e) => {
              const value = e.target.value;
              this.setState({
                value,
              }, () => {
                const self = this;
                const str = String(this.state.value || '');
                const isPercent = str.indexOf('%') !== -1;
                const value = parseNumber(str.replace('%', ''));
                value && isFinite(value) && isValidDiscount({ type: isPercent ? 'Percent' : 'Value', value: value, }) && function() {
                  store.setDiscountPart(rowIndex, { type: isPercent ? 'Percent' : 'Value', value: value, });
                  self.props.refresh('discountPart');
                }();
              });
            }}/>
        </div>
      </Cell>
    );
  };

  render() {
    const {rowIndex, styles, store, ...props} = this.props;

    return this._renderEditor({rowIndex, store, props, styles});
  }
}

class AmountCellEditor extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props, context){
    super(props, context);

    const {rowIndex, store, } = this.props;

    const {qty, rate} = store.getObjectAt(rowIndex);

    const {intl,} = this.context;

    const fValue = !rate || !isFinite(rate)
      ? undefined
      : intl.formatNumber(qty * (rate || 0.0), {format: 'MONEY',});

    this.state = {
      value: fValue,
    };
  }

  refresh = () => {
    const {intl,} = this.context;
    const {rowIndex, store, } = this.props;
    const {qty, rate} = store.getObjectAt(rowIndex);

    const fValue = !rate || !isFinite(rate)
      ? undefined
      : intl.formatNumber(qty * (rate || 0.0), {format: 'MONEY',});

    if(this.state.value !== fValue){
      this.setState({
        value: fValue,
      });
    }
  };

  componentWillReceiveProps(nextProps){
    const {intl,} = this.context;
    const {rowIndex, store, } = nextProps;

    const {qty, rate} = store.getObjectAt(rowIndex);

    const fValue = !rate || !isFinite(rate)
      ? undefined
      : intl.formatNumber(qty * (rate || 0.0), {format: 'MONEY',});

    if(this.state.value !== fValue){
      this.setState({
        value: fValue,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    const {intl,} = this.context;
    const {rowIndex, store, } = nextProps;

    const {qty, rate = 0.0} = store.getObjectAt(rowIndex);

    const fValue = !rate || !isFinite(rate)
      ? undefined
      : intl.formatNumber(qty * (rate || 0.0), {format: 'MONEY',});

    return nextState.value !== this.state.value || fValue !== this.state.value;
  }

  _renderEditor = ({rowIndex, store, props, styles}) => {
    const {intl,} = this.context;
    const el = store.getObjectAt(rowIndex);
    return (
      <Cell {...props}>
        <div className={''}>
          <input
            autoFocus={props.active}
            className={classnames('form-control', { 'has-error': props.company.salesSettings.showRates ? false : store.showErrors && !el.pristine && ! store.isKeyValid(rowIndex, 'rate'), })}
            style={{
              textAlign: 'right',
            }}
            type='text'
            pattern={MONEY_VALUE_REGEX}
            value={this.state.value || ''}
            onBlur={(e) => {
              const self = this;
              const value = function(){
                const val = parseNumber(String(self.state.value || ''));
                return val && isFinite(val) ? val : undefined;
              }();
              this.setState({
                value: value ? intl.formatNumber(value, {format: 'MONEY',}) : undefined,
              }, () => {
                const {qty,} = store.getObjectAt(rowIndex);
                store.setRate(rowIndex, value ? value / qty : 0.0);
              });
            }}
            onFocus={(e) => {
            }}
            onChange={(e) => {
              const value = e.target.value;
              this.setState({
                value,
              }, () => {
                const self = this;
                const value = parseNumber(String(this.state.value || ''));
                (value && isFinite(value)) && function() {
                  const {qty} = store.getObjectAt(rowIndex);
                  store.setRate(rowIndex, value / qty);
                  self.props.refresh('amount');
                }();
              });
            }}/>
        </div>
      </Cell>
    );
  };

  render() {
    const {rowIndex, styles, store, ...props} = this.props;

    return this._renderEditor({rowIndex, store, props, styles});
  }
}

function normalizeMoment(d){
  return moment(d).seconds(0).minutes(0).hour(0);
}

class DateCellEditor extends Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props, context){
    super(props, context);

    const {rowIndex, store, } = this.props;

    const {date: value} = store.getObjectAt(rowIndex);

    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps){
    const {rowIndex, store, } = nextProps;

    const {date: value} = store.getObjectAt(rowIndex);

    if(moment.isSame(this.state.value, value)){
      this.setState({
        value,
      });
    }
  }

  _renderEditor = ({rowIndex, store, props, styles}) => {
    const {intl,} = this.context;
    return (
      <Cell {...props}>

        <div className={''}>

          <div className="inline-block">

            <DateTimePicker
              autoFocus={props.active}
              defaultOpen={props.active ? 'calendar' : false}
              placeholder={intl.formatMessage(messages['ServiceDatePlaceholder'])}
              onChange={value => {
                store.setDate(rowIndex, value);
                this.setState({
                  value,
                });
              }}
              value={this.state.value}
              // editFormat={"d"}
              // max={new Date()}
              // min={new Date()}
              className={styles.datepicker}
              tabIndex={-1}
              culture={intl.locale}
              messages={{
                        clearButton: intl.formatMessage(messages.clearButton),
                      }}
              time={false}/>

          </div>

        </div>

      </Cell>
    );
  };

  render() {
    const {rowIndex, styles, onChange, store, ...props} = this.props;

    return this._renderEditor({rowIndex, onChange, store, props, styles});
  }
}

// class TaxableCellEditor extends Component {
//
//   static propTypes = {
//     active: PropTypes.bool.isRequired,
//     styles: PropTypes.object.isRequired,
//     store: PropTypes.object.isRequired,
//     rowIndex: PropTypes.number.isRequired,
//   };
//
//   constructor(props, context){
//     super(props, context);
//
//     const {rowIndex, store, } = this.props;
//
//     const {taxable: value} = store.getObjectAt(rowIndex);
//
//     this.state = {
//       value,
//     };
//   }
//
//   refresh = () => {
//     const {rowIndex, store, } = this.props;
//     const {taxable: value} = store.getObjectAt(rowIndex);
//
//     if(this.state.value !== value){
//       this.setState({
//         value,
//       });
//     }
//   };
//
//   componentWillReceiveProps(nextProps){
//     const {rowIndex, store, } = nextProps;
//
//     const {taxable: value} = store.getObjectAt(rowIndex);
//
//     if(this.state.value !== value){
//       this.setState({
//         value,
//       });
//     }
//   }
//
//   _renderEditor = ({rowIndex, store, props, styles}) => {
//     return (
//       <Cell {...props}>
//         <div className={''}>
//           <input
//             className={`form-control ${styles['taxable-input']}${this.state.value ? ` ${styles['checked']}` : ''}`}
//             style={{
//               textAlign: 'right',
//               float: 'right',
//               marginRight: 5,
//             }}
//             autoFocus={this.props.active}
//             type='checkbox'
//             value={'taxable-' + rowIndex}
//             checked={this.state.value}
//             onBlur={(e) => {
//             }}
//             onFocus={(e) => {
//             }}
//             onChange={(e) => {
//               this.setState({
//                 value: e.target.checked,
//               }, () => {
//                 store.setTaxable(rowIndex, this.state.value);
//               });
//             }}/>
//         </div>
//       </Cell>
//     );
//   };
//
//   render() {
//     const {rowIndex, styles, store, ...props} = this.props;
//
//     return this._renderEditor({rowIndex, store, props, styles});
//   }
// }

class AddIcon extends Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
  };

  render() {
    const {styles} = this.props;

    return (
      <div
        style={{  }}
        className={`${styles['secondary-color-sprite']} ${styles['editHandle']}`}>
      </div>
    );
  }
}

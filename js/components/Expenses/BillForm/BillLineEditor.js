import React, {Component, PropTypes} from 'react';

import messages from './messages';

import {intlShape,} from 'react-intl';

import isEqual from 'lodash.isequal';
import map from 'lodash.map';

import moment from 'moment';

import classnames from 'classnames';

import AccountListItem from './AccountListItem';

import parseNumber from '../../../utils/number/parse';

const MONEY_VALUE_REGEX = /^\d+((,|\.)\d{3})*((\.|,)\d*)?$/;

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Combobox from 'react-widgets/lib/Combobox';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

export default class extends React.Component{

  static displayName = 'BillLineEditor';

  static propTypes = {
    company: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    tableWidth: PropTypes.number.isRequired,
    rowIndex: PropTypes.number.isRequired,
    cell: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      _categoryCode: PropTypes.string,
      _groupCode: PropTypes.string,
      _classCode: PropTypes.string,
    })).isRequired,
    // onAddNewProduct: PropTypes.func.isRequired,
    // isAddingProduct: PropTypes.bool.isRequired,
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
    [ 'description', 'amount', 'VATPart'].forEach(item => {
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
      company,

      store,

      items,

      tableWidth,
      styles,
      rowIndex: row,

      cell,

      VTEnabled,
      hasVAT,
      inputTypeValue,

    } = this.props;

    function getAmountLabel() {
      switch (inputTypeValue) {
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


          {/* Account */}
          <Column
            columnKey={'accountCode'}
            align={'left'}
            header={<Cell>{intl.formatMessage(messages.Item)}</Cell>}
            cell={(props) => <AccountCodeCellEditor refresh={this._onRefresh} onAddNewProduct={this.props.onAddNewProduct} company={this.props.company} items={items} {...props} className={classnames(props.className || '', styles['accountCodeCell'])} styles={styles} store={store} rowIndex={row} active={this.props.isAddingProduct ? false : cell === 'accountCode' || !cell}/>}
            width={0.145 * tableWidth}
          />

          {/* DESCRIPTION */}
          <Column
            columnKey={'description'}
            align={'left'}
            header={<Cell>{intl.formatMessage(messages.Description)}</Cell>}
            cell={(props) => <DescriptionCellEditor {...props} ref={this._setElmRef.bind(this, 'description')} styles={styles} store={store} rowIndex={row} active={cell === 'description'}/>}

            width={hasVAT ? 0.57 * tableWidth : 0.66 * tableWidth}
            flexGrow={1}
          />

          {/* amount */}
          <Column
            columnKey={'amount'}
            align={'right'}
            header={<Cell>{intl.formatMessage(messages.Rate)}</Cell>}
            cell={(props) => <AmountCellEditor refresh={this._onRefresh} ref={this._setElmRef.bind(this, 'amount')} company={this.props.company} {...props} styles={styles} store={store} rowIndex={row} active={cell === 'amount'}/>}
            width={0.09 * tableWidth}
          />

          {/* VATPart */}
          {hasVAT && <Column
            columnKey={'VATPart'}
            align={'right'}
            header={<Cell>{intl.formatMessage(messages.VATPart)}</Cell>}
            cell={(props) => <VATPartCellEditor refresh={this._onRefresh} ref={this._setElmRef.bind(this, 'VATPart')} company={this.props.company} {...props} inputType={inputTypeValue} styles={styles} store={store} rowIndex={row} active={this.props.isAddingProduct ? false : cell === 'VATPart'}/>}
            width={0.09 * tableWidth}
            flexGrow={1}
          />}

        </Table>

      </div>

    );
  }
}

// const NEW_ITEM = {
//   id: 'NEW',
// };

class AccountCodeCellEditor extends React.Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      _categoryCode: PropTypes.string.isRequired,
      _groupCode: PropTypes.string.isRequired,
      _classCode: PropTypes.string.isRequired,
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

    const {accountCode: value} = store.getObjectAt(rowIndex);

    this.state.value = value;
    this.state.open = props.active;
  }

  componentWillReceiveProps(nextProps){
    const {rowIndex, store, } = nextProps;

    const {accountCode: value} = store.getObjectAt(rowIndex);

    // if(! isEqual(this.state.value, value)){
      this.setState({
        value,
      });
    // }
  }

  componentDidMount(){
  }

  _onAddNew = () => {
    // this.props.onAddNewProduct({
    //   rowIndex: this.props.rowIndex,
    // });
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

    const value = el.accountCode;

    return (
      <Cell {...props}>

        <div>

          <Combobox
            caseSensitive={false}
            //filter={(a, b) => {
              // if(a.id === NEW_ITEM.id){
              //   return true;
              // }
              //return a.name.indexOf(b) !== -1;
            //}}
            filter={(a, b) => {
              //  if(a.id === NEW_ITEM.id){
              //    return true;
              //  }
              return a.name.toLowerCase().indexOf((b||'').toLowerCase()) !== -1 || a.code.replace('.', '').indexOf(b) !== -1;
            }}
            open={this.state.open}
            onToggle={this._onToggle}
            autoFocus={props.active}
            placeholder={intl.formatMessage(messages['itemPlaceholder'])}
            data={items}
            className={classnames('no-new', {
              'has-error': store.showErrors && !el.pristine && ! store.isKeyValid(rowIndex, 'accountCode'),
            })}
            // busy={this.state.showItems}
            value={value}
            onSelect={item => {
              // if(item.id === NEW_ITEM.id){
              //   return false;
              // }
            }}
            onChange={item => {
              if(!item || typeof item === 'string'){
                store.setAccountCode(rowIndex, undefined);
                return;
              }

              // if(item.id === NEW_ITEM.id){
              //   return;
              // }

              if(typeof item !== 'string'){
                store.setAccountCode(rowIndex, item['code']);

                this.props.refresh('accountCode');
              }
            }}
            textField={'name'}
            valueField='code'
            // disabled
            // groupBy={ person => person.name.length }
            // groupComponent={GroupByLength}
            itemComponent={props => <AccountListItem {...props} onAddNew={this._onAddNew}/>}
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

class DescriptionCellEditor extends React.Component {

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
            value={this.state.value ? this.state.value : ''}
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

class AmountCellEditor extends React.Component {
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

    const {amount: value} = store.getObjectAt(rowIndex);

    const {intl,} = this.context;

    const fValue = !value || !isFinite(value)
      ? undefined
      : intl.formatNumber(value, {format: 'MONEY',});

    this.state = {
      value: fValue,
    };
  }

  refresh = () => {
    const {rowIndex, store, } = this.props;
    const {amount: value} = store.getObjectAt(rowIndex);

    const {intl,} = this.context;

    const fValue = !value || !isFinite(value)
      ? undefined
      : intl.formatNumber(value, {format: 'MONEY',});

    if(this.state.value !== fValue){
      this.setState({
        value: fValue,
      });
    }
  };

  componentWillReceiveProps(nextProps){
    const {rowIndex, store, } = nextProps;

    const {amount: value} = store.getObjectAt(rowIndex);

    const {intl,} = this.context;

    const fValue = !value || !isFinite(value)
      ? undefined
      : intl.formatNumber(value, {format: 'MONEY',});

    if(this.state.value !== fValue){
      this.setState({
        value: fValue,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    const {rowIndex, store, } = nextProps;

    const {amount: value} = store.getObjectAt(rowIndex);


    const {intl,} = this.context;

    const fValue = !value || !isFinite(value)
      ? undefined
      : intl.formatNumber(value, {format: 'MONEY',});

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
            className={classnames('form-control', { 'has-error': store.showErrors && !el.pristine && ! store.isKeyValid(rowIndex, 'amount'), })}
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
                store.setAmount(rowIndex, value ? value : 0.0);
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
                  store.setAmount(rowIndex, value);
                  self.props.refresh('amount');
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

class VATPartCellEditor extends React.Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    const {rowIndex, store,} = this.props;

    const {VATPart: value,} = store.getObjectAt(rowIndex);

    const {intl,} = this.context;

    this.state = {
      value,
      open: this.props.active,
    };
  }

  _onToggle = open => {
    this.setState({
      open,
    });
  };

  refresh = () => {
    const {intl,} = this.context;
    const {rowIndex, store,} = this.props;
    const {VATPart: value,} = store.getObjectAt(rowIndex);

    if (!isEqual(this.state.value, value)) {
      this.setState({
        value,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    const {intl,} = this.context;
    const {rowIndex, store,} = nextProps;

    const {VATPart : value,} = store.getObjectAt(rowIndex);

    if (!isEqual(this.state.value, value)) {
      this.setState({
        value,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {intl,} = this.context;
    const {rowIndex, store,} = nextProps;

    const {VATPart: value,} = store.getObjectAt(rowIndex);

    return !isEqual(this.state.value, nextState.value) || this.state.open !== nextState.open || !isEqual(this.state.value, value);
  }

  _renderEditor = ({rowIndex, store, inputType, company, props, styles}) => {
    const {intl,} = this.context;
    const {VATPart : value,} = store.getObjectAt(rowIndex);

    const items = map(company.VATSettings.percentages, function ({value}) {
      return {
        value,
        name: VAT_ID_TO_TEXT[VAT_NAME_TO_ID[value]],
      };
    });

    return (
      <Cell {...props}>

        <div>

          <Combobox
            caseSensitive={false}
            filter={(a, b) => {
              return a.name.indexOf(b) !== -1;
            }}
            open={this.state.open}
            onToggle={this._onToggle}
            autoFocus={props.active}
            placeholder={intl.formatMessage(messages['VATPartPlaceholder'])}
            data={items}
            className={'no-new'}
            // busy={this.state.showItems}
            value={value && value.value}
            onChange={item => {
              if(!item || typeof item === 'string'){
                store.setVATPart(rowIndex, undefined);
                return;
              }

              if(typeof item !== 'string'){
                const value = item['value'];

                store.setVATPart(rowIndex, {
                  inputType: VAT_NAME_TO_ID[value] === 4 ? 3 /* NO_VAT */ : inputType,
                  ...(item['value'] ? { value: item['value'], } : {}),
                });

                this.props.refresh('VATPart');
              }
            }}
            textField={'name'}
            valueField='value'
          />

        </div>

      </Cell>
    );
  };

  render() {
    const {rowIndex, styles, store, inputType, company, ...props} = this.props;

    return this._renderEditor({rowIndex, store, inputType, company, props, styles});
  }
}

function normalizeMoment(d){
  return moment(d).seconds(0).minutes(0).hour(0);
}

class AddIcon extends React.Component {

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

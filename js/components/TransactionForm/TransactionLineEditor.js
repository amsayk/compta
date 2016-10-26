import React, {Component, PropTypes} from 'react';

import messages from './messages';

import {intlShape,} from 'react-intl';

// import Select from 'react-select';

import {Table, Column, Cell,} from '../../../fixed-data-table';

export default class TransactionLineEditor extends React.Component{

  static propTypes = {
    onClickOutside: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    tableWidth: PropTypes.number.isRequired,
    rowIndex: PropTypes.number.isRequired,
    accounts: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      _classCode: PropTypes.string.isRequired,
      _categoryCode: PropTypes.string.isRequired,
      _groupCode: PropTypes.string.isRequired,
      _parentCode: PropTypes.string,
    })).isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  handleClickOutside = (e) => {
    // e.preventDefault();
    // e.stopImmediatePropagation();
    this.props.onClickOutside(e);
  };

  render(){
    logInfo('TransactionLineEditor rendered!');

    const {formatMessage,} = this.context.intl;

    const {
      store,

      accounts,

      tableWidth,
      styles,
      rowIndex: row,

    } = this.props;

    return (
      <div style={{position: 'absolute', top: (row * 50) - 1, }}>

        <Table
          renderRow={(Component, rowIndex, {style, className}) => {
          return (
            <Component {...{style: {...style, zIndex: 1}, className}}/>
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
            columnKey={'drag'}
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
            cell={(props) => <AccountCellEditor {...props} accounts={accounts} styles={styles} rowIndex={row} store={store}/>}
            width={0.295 * tableWidth}
          />

          {/* DEBIT */}
          <Column
            columnKey={'debit'}
            align={'right'}
            cell={(props) => <DebitCellEditor {...props} styles={styles} rowIndex={row} store={store}/>}
            width={0.1 * tableWidth}
          />

          {/* CREDIT */}
          <Column
            columnKey={'credit'}
            align={'right'}
            cell={(props) => <CreditCellEditor {...props} styles={styles} rowIndex={row} store={store}/>}
            width={0.1 * tableWidth}
          />

          {/* DESCRIPTION */}
          <Column
            columnKey={'description'}
            align={'left'}
            cell={(props) => <TextValueCellEditor {...props} styles={styles} type={'description'} rowIndex={row} store={store}/>}
            width={0.25 * tableWidth}
            flexGrow={1}
          />

          {/* Name */}
          <Column
            columnKey={'name'}
            align={'left'}
            cell={(props) => <TextValueCellEditor {...props} styles={styles} type={'name'} rowIndex={row} store={store}/>}
            width={0.15 * tableWidth}
            flexGrow={1}
          />

        </Table>

      </div>

    );
  }
}

class AccountCellEditor extends React.Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    accounts: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      _classCode: PropTypes.string.isRequired,
      _categoryCode: PropTypes.string.isRequired,
      _groupCode: PropTypes.string.isRequired,
      _parentCode: PropTypes.string,
    })).isRequired,
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  state = {
    open: false,
    showAccounts: false,
  };

  constructor(props){
    super(props);

    const {rowIndex, store, } = this.props;

    const {account: accountCode} = store.getObjectAt(rowIndex);

    this.state.value = accountCode;
  }

  componentWillReceiveProps(nextprops){
    const {rowIndex, store, } = nextprops;

    const {account: accountCode} = store.getObjectAt(rowIndex);

    if(this.state.value !== accountCode){
      this.setState({
        value: accountCode,
      });
    }
  }

  componentDidMount(){
    this._component && this._component.focus();

    setTimeout(() => {
      this.setState({
        showAccounts: true,
      })
    }, 200);
  }

  _renderEditor = ({rowIndex, accounts, store, props, }) => {

    const { formatMessage, } = this.context.intl;

    //const ListItem = React.createClass({
    //  render() {
    //    var person = this.props.item;
    //
    //    return (
    //      <span>
    //        <strong>{ person.firstName }</strong>
    //        { " " + person.lastName }
    //      </span>);
    //  }
    //});

    //const Group = React.createClass({
    //  render() {
    //    return (<span>
    //      {this.props.item + ' letters long'}
    //    </span>);
    //  }
    //});

    const self = this;

    return (
      <Cell {...props}>
        <div>
          <Select.Async
            ref={(component) => this._component = component}
            clearable
            labelKey={'name'}
            valueKey={'code'}
            value={this.state.value}
            loading={this.state.showAccounts}
            loadOptions={async(input) => ({options: this.state.showAccounts ? accounts : []})}
            // valueRenderer={ListItem}
            onChange={(item) => {
              store.setAccount(rowIndex, item['code']);
              self.setState({
                value: item['code'],
              });
            }}
            onBlur={(e) => {
              store.setAccount(rowIndex, self.state.value);
            }}
            onFocus={(e) => {
            }}
            // optionRenderer
            placeholder={formatMessage(messages.accountPlaceholder)}
            searchingText={formatMessage(messages.searchingText)}
            searchPromptText={formatMessage(messages.searchPromptText)}
            noResultsText={formatMessage(messages.emptyFilter)}
          />
        </div>
      </Cell>
    );
  };

  render() {
    const {rowIndex, store, styles, accounts, onChange, ...props} = this.props;

    return this._renderEditor({rowIndex, store, accounts, onChange, props, styles});
  }
}

class DebitCellEditor extends React.Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props){
    super(props);

    const {rowIndex, store, } = this.props;

    const {type, amount} = store.getObjectAt(rowIndex);

    this.state = {
      value: {type, amount},
    };
  }

  componentWillReceiveProps(nextprops){
    const {rowIndex, store, } = nextprops;

    const {type, amount} = store.getObjectAt(rowIndex);

    if(this.state.value.type !== type || this.state.value.amount !== amount){
      this.setState({
        value: {type, amount},
      });
    }
  }

  _renderEditor = ({rowIndex, store, onChange, props, styles}) => {
    return (
      <Cell {...props}>
        <div className={''}>
          <input
            className={'form-control'}
            style={{ textAlign: 'right', }}
            type='text'
            value={!this.state.value.type || this.state.value.type === 'DEBIT' ? this.state.value.amount : undefined}
            onBlur={(e) => {
              store.setAmount(rowIndex, 'DEBIT', !this.state.value.type || this.state.value.type === 'DEBIT' ? this.state.value.amount : undefined);
            }}
            onFocus={(e) => {
            }}
            onChange={(e) => {
              const amount = parseFloat(e.target.value) || undefined;
              this.setState({
                value: {type: this.state.type, amount}
              }, () => store.setAmount(rowIndex, 'DEBIT', amount));
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

class CreditCellEditor extends React.Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props){
    super(props);

    const {rowIndex, store, } = this.props;

    const {type, amount} = store.getObjectAt(rowIndex);

    this.state = {
      value: {type, amount},
    };
  }

  componentWillReceiveProps(nextprops){
    const {rowIndex, store, } = nextprops;

    const {type, amount} = store.getObjectAt(rowIndex);

    if(this.state.value.type !== type || this.state.value.amount !== amount){
      this.setState({
        value: {type, amount},
      });
    }
  }

  _renderEditor = ({rowIndex, store, onChange, props, styles}) => {
    return (
      <Cell {...props}>
        <div className={''}>
          <input
            className={'form-control'}
            style={{ textAlign: 'right', }}
            type='text'
            value={!this.state.value.type || this.state.value.type === 'CREDIT' ? this.state.value.amount : undefined}
            onBlur={(e) => {
              store.setAmount(rowIndex, 'CREDIT', !this.state.value.type || this.state.value.type === 'CREDIT' ? this.state.value.amount : undefined);
            }}
            onFocus={(e) => {
            }}
            onChange={(e) => {
              const amount = parseFloat(e.target.value) || undefined;
              this.setState({
                value: {type: this.state.type, amount}
              }, () => store.setAmount(rowIndex, 'CREDIT', amount));
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

class TextValueCellEditor extends React.Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['name', 'description']).isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
  };

  constructor(props){
    super(props);

    const {rowIndex, store, type, } = this.props;

    const {[type]: value} = store.getObjectAt(rowIndex);

    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextprops){
    const {rowIndex, store, type, } = nextprops;

    const {[type]: value} = store.getObjectAt(rowIndex);

    if(this.state.value !== value){
      this.setState({
        value,
      });
    }
  }

  _renderEditor = ({rowIndex, store, type, props}) => {
    return (
      <Cell {...props}>
        <div className={''}>
          <input
            className={'form-control'}
            style={{}}
            type='text'
            value={this.state.value || ''}
            onBlur={(e) => {
              switch (type){
                case 'name':
                  store.setName(rowIndex, this.state.value);
                  break;

                case 'description':
                  store.setDescription(rowIndex, this.state.value);
                  break;
              }
            }}
            onFocus={(e) => {
              logInfo(type, ' focused');
            }}
            onChange={(e) => {
              this.setState({
                value: e.target.value,
              }, () => {
                switch (type){
                case 'name':
                  store.setName(rowIndex, this.state.value);
                  break;

                case 'description':
                  store.setDescription(rowIndex, this.state.value);
                  break;
              }
              })
            }}/>
        </div>
      </Cell>
    );
  };

  render() {
    const {
      rowIndex,
      type,
      styles,
      store,
      onChange,
      ...props
    } = this.props;

    return this._renderEditor({rowIndex, onChange, type, store, props, styles});
  }
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

function logInfo(...messages){
  if(process.env.NODE_ENV !== 'production'){
    return console.log(...messages);
  }
}

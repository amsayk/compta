import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';
import Loading from '../Loading/Loading';
import {DragSource, DropTarget, DragDropContext,} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import transactionValidation, {} from './transactionValidation';
import * as transactionActions from '../../redux/modules/transactions';

import enhanceWithClickOutside from 'react-click-outside';

import findIndex from 'lodash.findindex';

import TransactionFormRoute from '../../routes/TransactionFormRoute';

import classnames from 'classnames';

// import DatePicker from 'react-datepicker';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
// import Combobox from 'react-widgets/lib/Combobox';
import Select from 'react-select';
import moment from 'moment';

import Modal from 'react-bootstrap/lib/Modal';

import {Table, Column, Cell,} from '../../../fixed-data-table';

import styles from './TransactionForm.scss';

import CSSModules from 'react-css-modules';

import throttle from 'lodash.throttle';

import Parse from 'parse';

import events from 'dom-helpers/events';

import {Text,} from '../form/form';

@enhanceWithClickOutside
class ClickOutsideWrapper extends Component{
  handleClickOutside = (e) => {
    // e.preventDefault();
    // e.stopImmediatePropagation();
    this.props.onClickOutside(e);
  };

  render() {
    return (
      <div className={'inline-block'}>{this.props.children}</div>
    );
  }
}

const Progress = ({}) => (
  <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate is-upgraded">
    <div className="progressbar bar bar1" style={{width: '0%'}}></div>
    <div className="bufferbar bar bar2" style={{width: '100%'}}></div>
    <div className="auxbar bar bar3" style={{width: '0%'}}></div>
  </div>
);

import {
  defineMessages,
  intlShape,
} from 'react-intl';

function getBodyHeight() {
  var body = document.body,
    html = document.documentElement;

  var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);

  return height;
}

function getBodyWeight() {
  var body = document.body,
    html = document.documentElement;

  var width = Math.max(body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth);

  return width;
}

const messages = defineMessages({

  Account: {
    id: 'transaction-form.th.account',
    defaultMessage: 'Acccount',
  },

  DEBIT: {
    id: 'transaction-form.th.DEBIT',
    defaultMessage: 'DEBIT',
  },

  CREDIT: {
    id: 'transaction-form.th.CREDIT',
    defaultMessage: 'CREDIT',
  },

  Description: {
    id: 'transaction-form.th.Description',
    defaultMessage: 'Description',
  },

  Name: {
    id: 'transaction-form.th.Name',
    defaultMessage: 'Name',
  },

  error: {
    id: 'transaction-form.error.unknown',
    defaultMessage: 'There was an unknown error. Please try again.',
  },

  searchPromptText: {
    id: 'transaction-form.message.searchPromptText',
    defaultMessage: 'Select Account…',
  },

  accountPlaceholder: {
    id: 'transaction-form.message.accountPlaceholder',
    defaultMessage: 'Select Account…',
  },

  searchingText: {
    id: 'transaction-form.message.searchingText',
    defaultMessage: 'Searching…',
  },

  clearButton: {
    id: 'transaction-form.date.clearButton',
    defaultMessage: 'Select Date',
  },

  emptyFilter: {
    id: 'transaction-form.account-combobox.emptyFilter',
    defaultMessage: 'The filter returned no results',
  },

  date_label: {
    id: 'transaction-form.date_label',
    defaultMessage: 'Journal Date',
  },

  add_more_lines: {
    id: 'transaction-form.add_more_lines',
    defaultMessage: 'Add lines',
  },

  clear_all_lines: {
    id: 'transaction-form.clear_all_lines',
    defaultMessage: 'Clear all lines',
  },

  memo: {
    id: 'transaction-form.memo',
    defaultMessage: 'Enter a note for this journal entry',
  },

  emailError: {
    id: 'transaction-form.error.displayName',
    defaultMessage: 'This Company Name was already used',
  },

  formTitle: {
    id: 'transaction-form.message.add-transaction-title',
    defaultMessage: 'Journal Entry #{transactionNumber}',
  },

  Total: {
    id: 'transaction-form.message.total',
    defaultMessage: 'Total'
  },

  cancel: {
    id: 'transaction-form.cancel',
    defaultMessage: 'Cancel'
  },

  save: {
    id: 'transaction-form.action.save',
    defaultMessage: 'Save'
  },

  saveAndNew: {
    id: 'transaction-form.action.save-and-new',
    defaultMessage: 'Save and new'
  },

  saving: {
    id: 'transaction-form.action.saving-transaction',
    defaultMessage: 'Saving…'
  },

});

//function asyncValidate({email}) {
//  // TODO: figure out a way to move this to the server. need an instance of ApiClient
//  if (!email) {
//    return Promise.resolve({});
//  }
//  return new Promise((resolve, reject) => {
//    const query = new Parse.Query(Parse.User);
//    query.equalTo('email', email);
//
//    query.first().then(
//      function (object) {
//        if (object) {
//          reject({
//            email: messages.emailError
//          });
//          return;
//        }
//
//        resolve();
//      },
//
//      function () {
//        reject({
//          email: messages.error
//        });
//      }
//    );
//  });
//}

const ItemTypes = {
  OPERATION: 'operation'
};

const operationSource = {
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findOp(props.id).index
    };
  },

  endDrag(props, monitor) {
    const {id: droppedId, originalIndex} = monitor.getItem();
    const didDrop = monitor.didDrop();

    props.onHover({rowIndex: null, dragging: false});

    if (!didDrop) {
      props.moveOp(droppedId, originalIndex);
    }
  }
};

const operationTarget = {
  canDrop() {
    return false;
  },

  hover(props, monitor) {
    const {id: draggedId} = monitor.getItem();
    const {id: overId} = props;

    if (draggedId !== overId) {
      const {index: overIndex} = props.findOp(overId);

      props.onHover({rowIndex: overIndex, dragging: true});

      props.moveOp(draggedId, overIndex);
    }
  }
};

@DropTarget(ItemTypes.OPERATION, operationTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.OPERATION, operationSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class DragHandle extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    rowIndex: PropTypes.number.isRequired,
    activeRow: PropTypes.number,
    findOp: PropTypes.func.isRequired,
    moveOp: PropTypes.func.isRequired,
    onHover: PropTypes.func.isRequired
  };

  render() {
    const {styles, rowIndex, activeRow, isDragging, connectDragSource, connectDropTarget} = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div
        style={{ opacity }}
        className={rowIndex === activeRow ? `${styles['secondary-color-sprite']} ${styles['editHandle']}` : `${styles['tertiary-sprite']} ${styles['dragHandle']}`}>
      </div>
    ));
  }
}

@reduxForm({
  form: 'transaction',
  fields: ['id', 'date', 'operations', 'memo', 'files',],
  validate: transactionValidation,
}, (state, ownProps) => ({
  company: ownProps.company,
  editing: state.transactions.editing,
  saveError: state.transactions.saveError,
  initialValues: {date: moment().format(),},
}), dispatch => bindActionCreators(transactionActions, dispatch))
@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.OPERATION, {
  drop() {
    //
  }
}, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@CSSModules(styles, {allowMultiple: true})
class TransactionForm extends Component {
  static contextTypes = {
    intl: intlShape.isRequired
  };

  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    asyncValidating: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    dirty: PropTypes.bool.isRequired,
    editStop: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    setActiveRow: PropTypes.func.isRequired,
    addMoreRows: PropTypes.func.isRequired,
    clearAllRows: PropTypes.func.isRequired,
    clearRow: PropTypes.func.isRequired,
    moveOp: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
  };

  state = {};

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);
  }

  componentWillUnmount() {
    events.off(window, 'resize', this._handleWindowResize);
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 200);

  static _getStyles() {
    return getBodyHeight() - 60 /* HEADER */ - 55 /* FOOTER */;
  }

  moveOp = (id, atIndex) => {
    const {
      formKey,
      editing: {
        [formKey]: store,
      }
    } = this.props;

    const {index} = store.find(id);

    this.props.moveOp(this.props.formKey, index, atIndex);
  };

  findOp = (id) => {
    const {
      formKey,
      editing: {
        [formKey]: store,
      }
    } = this.props;

    return store.find(id);
  };

  _onHover = ({rowIndex}) => {
    this.setState({
      rowIndex
    })
  };

  render() {
    const {formatMessage, locale,} = this.context.intl;

    const {
      formKey,
      connectDropTarget,
      // asyncValidating,
      dirty,
      editStop,
      fields: {id, date, memo,},
      handleSubmit,
      valid,
      invalid,
      pristine,
      save,
      submitting,
      saveError: {
        [formKey]: saveError,
      },
      editing: {
        [formKey]: store,
      },
      values,

      onCancel,

      styles,

      setName,
      setDescription,
      setAccount,
      setAmount,

      accounts,
    } = this.props;

    const handleClose = () => {
      editStop(formKey);
      onCancel();
    };

    const operations = store.getAll();

    const activeRow = store.getActiveRow();

    const ops = (operations || []);

    const rowsCount = Math.max(store.getSize(), ops.length);

    const minHeight = TransactionForm._getStyles();

    const tableHeight = 36 + (rowsCount * 50) + 50 + 2 + (activeRow ? 2 : 0) + 4 + (activeRow === 0 ? 0 : 2);

    const bodyWidth = getBodyWeight() - 60;

    const tableWidth = bodyWidth - 1;

    const { DEBIT: sumOfDebits, CREDIT: sumOfCredits} = operations.reduce(function({DEBIT, CREDIT}, {type, amount}){
      return {
        CREDIT: type === 'CREDIT' ? CREDIT + (amount || 0.0) : CREDIT,
        DEBIT: type === 'DEBIT' ? DEBIT + (amount || 0.0) : DEBIT,
      };
    }, {DEBIT: 0.0, CREDIT: 0.0});

    const {valid: opsValid, isEmpty: opsAreEmpty} = store.isValid();

    const self = this;

    function onDateChange(value) {
      date.onChange(moment(value));
    }

    function onDateFocus(e) {
      date.onFocus(e);
    }

    function onDateBlur(e) {
      // date.onBlur(e);
    }

    return (
      <Modal styleName={'modal'}
             className={classnames({'valid': !pristine && valid, 'submitting': submitting, 'journal-form form modal-fullscreen': true, [styles['journal-form']]: true, [styles['dragging']]: this.state.dragging, })}
             show={true} keyboard={false} backdrop={'static'} onHide={() => handleClose()} autoFocus enforceFocus>
        <div className="modal-header" style={{ background: '#1e3b4d', }}>

          <div styleName="title"
               style={{}}>{formatMessage(messages['formTitle'], {transactionNumber: this.props.company.lastSeqNr + 1})}
          </div>

          <div styleName="icon">
            <i style={{verticalAlign: 'middle'}} className="material-icons md-light" style={{}}>group_work</i>
          </div>

        </div>
        <div className="modal-body">

          <div className="scrollable" style={{height: minHeight, overflowY: 'auto'}}>


            {saveError && <div styleName="error">{formatMessage(saveError)}</div>}

            <div className="form-wrapper" style={{padding: 0, margin: 0,}}>

              <div className="header-wrapper" style={{ backgroundColor: '#f6f7f8', }}>

                <div className="line-1" style={{minHeight: 29, margin: 0, }}>

                </div>

              </div>

              <div className="line-1" style={{minHeight: 50, padding: `11.5px 0`, margin: '15px 30px 15px', }}>

                <div styleName="date" style={{display: 'inline-block'}}>{formatMessage(messages['date_label'])}</div>

                {/*

                 <DatePicker
                 selected={moment(date.defaultValue)}
                 {...{onChange: date.onChange, onBlur: date.onBlur, onFocus: date.onFocus}}
                 locale={locale}
                 moment={moment}
                 minDate={undefined}
                 maxDate={undefined}
                 className={styles.datepicker}
                 weekdays={moment.weekdaysMin()}
                 tabIndex={-1}
                 />

                */}

                <DateTimePicker
                  // onSelect={() => alert('selected!')}
                  {...{onChange: onDateChange, onBlur: onDateBlur, onFocus: onDateFocus}}
                  defaultValue={moment(date.defaultValue).toDate()}
                  // editFormat={"d"}
                  // max={new Date()}
                  // min={new Date()}
                  className={styles.datepicker}
                  tabIndex={-1}
                  culture={locale}
                  messages={{
                    clearButton: formatMessage(messages.clearButton),
                  }}
                  time={false}/>

              </div>

              <div className="body-wrapper" style={{margin: '30px 30px 0',}}>

                <div className="line-2" style={{}}>

                  {connectDropTarget(<div className="line-2-1" style={{}}>

                    <ClickOutsideWrapper onClickOutside={(e) => store.hasActiveRow() && this._setActiveRow(undefined, e)}>

                      <Table
                        wrapRow={(Component, rowIndex, {style, className}) => {

                          return (
                            <Component {...{style: {...style/*, borderTop: rowIndex === activeRow ? 'none' : '1px solid #c7c7c7'*/, zIndex: rowIndex === activeRow ? 1 : 0}, className}}/>
                          );
                        }}
                        onRowClick={(e, rowIndex) => self._setActiveRow(rowIndex, e)}
                        // onRowMouseEnter
                        // onRowMouseLeave
                        rowClassNameGetter={(rowIndex) => `${styles.row} ${rowIndex === 0 ? styles['first-row'] : ''} ${rowIndex === activeRow ? styles['row-is-editing'] : ''} table-row ${styles[`${self.state.rowIndex === rowIndex ? '' : 'not-'}isDragging`]}`}
                        rowHeight={50}
                        rowHeightGetter={(rowIndex) => rowIndex === activeRow ? 54 : 50}
                        rowsCount={rowsCount}
                        height={tableHeight}
                        width={tableWidth}
                        headerHeight={36}
                        footerHeight={50}>

                        {/* Space */}
                        <Column
                          columnKey={'drag'}
                          align={'center'}
                          width={0.035 * tableWidth}
                          cell={({rowIndex, ...props}) => {
                          const operation = store.getObjectAt(rowIndex);
                          return (
                             <Cell {...props}>
                                <DragHandle
                                  rowIndex={rowIndex}
                                  activeRow={activeRow}
                                  onHover={self._onHover}
                                  moveOp={self.moveOp}
                                  findOp={self.findOp}
                                  id={operation.id || operation._id}
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
                           <div>{rowIndex + 1}</div>
                           </Cell>
                         )}
                          width={0.04 * tableWidth}
                        />

                        {/* Account */}
                        <Column
                          columnKey={'accountCode'}
                          align={'left'}
                          header={<Cell>{formatMessage(messages.Account)}</Cell>}
                          cell={(props) => <AccountCell {...props} accounts={accounts} styles={styles} activeRow={activeRow} store={store} onChange={ (rowIndex, value) => setAccount(formKey, rowIndex, value) }/>}
                          width={0.295 * tableWidth}
                          footer={<Cell><div className={`${styles['align-Right']} ${opsValid ? '' : styles['invalid']}`}><b style={{}}>{formatMessage(messages.Total)}</b></div></Cell>}
                        />

                        {/* DEBIT */}
                        <Column
                          columnKey={'debit'}
                          align={'right'}
                          header={<Cell>{formatMessage(messages.DEBIT)}</Cell>}
                          cell={(props) => <DebitCell {...props} styles={styles} activeRow={activeRow} store={store} onChange={ (rowIndex, value) => setAmount(formKey, rowIndex, 'DEBIT', value) }/>}
                          width={0.1 * tableWidth}
                          footer={<Cell><div className={opsValid ? '' : styles['invalid']}>{sumOfDebits}</div></Cell>}
                        />

                        {/* CREDIT */}
                        <Column
                          columnKey={'credit'}
                          align={'right'}
                          header={<Cell>{formatMessage(messages.CREDIT)}</Cell>}
                          cell={(props) => <CreditCell {...props} styles={styles} activeRow={activeRow} store={store} onChange={ (rowIndex, value) => setAmount(formKey, rowIndex, 'CREDIT', value) }/>}
                          width={0.1 * tableWidth}
                          footer={<Cell><div className={opsValid ? '' : styles['invalid']}>{sumOfCredits}</div></Cell>}
                        />

                        {/* DESCRIPTION */}
                        <Column
                          columnKey={'description'}
                          align={'left'}
                          header={<Cell>{formatMessage(messages.Description)}</Cell>}
                          cell={(props) => <TextValueCell {...props} styles={styles} type={'description'} activeRow={activeRow} store={store} onChange={ (rowIndex, value) => setDescription(formKey, rowIndex, value) } />}
                          width={0.25 * tableWidth}
                          flexGrow={1}
                        />

                        {/* Name */}
                        <Column
                          columnKey={'name'}
                          align={'left'}
                          header={<Cell>{formatMessage(messages.Name)}</Cell>}
                          cell={(props) => <TextValueCell {...props} styles={styles} type={'name'} activeRow={activeRow} store={store} onChange={ (rowIndex, value) => setName(formKey, rowIndex, value) } />}
                          width={0.15 * tableWidth}
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

                  <div className="line-2-2" style={{minHeight: 30, marginTop: 10, }}>

                    <button
                      styleName="button left sm"
                      onClick={this._addRows}
                      className="btn btn-secondary btn-sm unselectable">{formatMessage(messages['add_more_lines'])}
                    </button>

                    <button
                      styleName="button left sm"
                      onClick={this._clearAll}
                      style={{marginLeft: 10}}
                      className="btn btn-secondary btn-sm unselectable">{formatMessage(messages['clear_all_lines'])}
                    </button>

                  </div>

                </div>

                <div className="line-3" style={{minHeight: 50, padding: 0, marginTop: 50, marginBottom: 50, }}>

                  <div className="label-3" style={{marginBottom: '.5rem'}}>{formatMessage(messages['memo'])}</div>

                  <div className="memo">
                    <textarea {...memo} style={{ width: 'initial', borderRadius: 0, resize: 'none', }}
                                        className="form-control" cols="40" rows="5"/>
                  </div>

                </div>


                <hr/>

                <div className="line-3" style={{minHeight: 50, padding: 0, marginTop: 50, marginBottom: 50, }}>

                  <div className="label-3" style={{marginBottom: '.5rem'}}>{formatMessage(messages['memo'])}</div>

                  <div className="memo">
                    <textarea {...memo} style={{ width: 'initial', borderRadius: 0, resize: 'none', }}
                                        className="form-control" cols="40" rows="5"/>
                  </div>

                </div>

              </div>

            </div>

            {submitting && <Progress/>}
          </div>


        </div>
        <div className="modal-footer">

          <button
            styleName="button left"
            onClick={() => handleClose()}
            disabled={submitting}
            className="btn btn-primary-outline unselectable">{formatMessage(messages['cancel'])}
          </button>

          <div styleName="right">

            <button
              styleName="button"
              onClick={handleSubmit((data) => {
              return save({...data})
                    .then(result => {
                      if (result && typeof result.error === 'object') {
                        return Promise.reject(messages['error']);
                      }

                      handleClose();
                    });
            })}
              disabled={opsAreEmpty || !opsValid || invalid || submitting}
              className={"btn btn-primary unselectable" + (!opsAreEmpty && opsValid && valid ? ' green' : '')}>
              {' '}{formatMessage(messages['save'])}
            </button>

            <button
              styleName="button"
              onClick={handleSubmit((data) => {
              return save({...data})
                    .then(result => {
                      if (result && typeof result.error === 'object') {
                        return Promise.reject(messages['error']);
                      }

                      handleClose();
                    });
            })}
              disabled={opsAreEmpty || !opsValid || invalid || submitting}
              className={"btn btn-primary unselectable" + (!opsAreEmpty && opsValid && valid ? ' green' : '')}>
              {' '}{formatMessage(messages['saveAndNew'])}
            </button>


          </div>

        </div>
      </Modal>
    );
  }

  _onClearRow = (rowIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.clearRow(this.props.formKey, rowIndex);
  };

  _addRows = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.addMoreRows(this.props.formKey);
  };

  _clearAll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.clearAllRows(this.props.formKey);
  };

  _setActiveRow = (rowIndex, e) => {
    e.preventDefault();
    e.stopPropagation();

    const {
      formKey,
      editing: {
        [formKey]: store,
      }
    } = this.props;

    if (store.getActiveRow() !== rowIndex) {
      this.props.setActiveRow(this.props.formKey, rowIndex);
    }
  };
}

class AccountCell extends Component {

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
    activeRow: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    open: false,
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
    // this._component && this._component.focus();
  }

  _renderEditor = ({rowIndex, accounts, onChange, store, props, styles}) => {

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
            loadOptions={async(input) => ({options: accounts})}
            // valueRenderer={ListItem}
            onChange={(item) => {
              logInfo('Account Changed');

              store.setAccount(rowIndex, item['code']);
              self.setState({
                value: item['code'],
              });
            }}
            onBlur={(e) => {
              logInfo('Account blurred');
              // setImmediate(() => onChange(rowIndex, self.state.value));
              store.setAccount(rowIndex, self.state.value);
            }}
            onFocus={(e) => {
              logInfo('Account focused');
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

    //return (
    //  <Cell {...props}>
    //    <div>
    //      <Combobox
    //        open={this.state.open}
    //        onToggle={e => {
    //          this.setState({open: !this.state.open})
    //        }}
    //        caseSensitive={false}
    //        minLength={1}
    //        filter='startsWith'
    //        suggest={true}
    //        valueField={'code'}
    //        textField={(item) => {
    //          return item['name'];
    //        }}
    //        defaultValue={accounts[0]}
    //        data={accounts}
    //        // itemComponent={ListItem}
    //        onChange={(value) => {
    //
    //        }}
    //        // groupBy={ item => item._groupCode }
    //        // groupComponent={Group}
    //        messages={{
    //          emptyFilter: formatMessage(messages.emptyFilter)
    //        }}
    //      />
    //    </div>
    //  </Cell>
    //);
  };

  render() {
    const {rowIndex, activeRow, store, styles, accounts, onChange, ...props} = this.props;

    if (rowIndex === activeRow) {
      return this._renderEditor({rowIndex, store, accounts, onChange, props, styles});
    }

    const accountCode = this.state.value;

    const index = accountCode && findIndex(accounts, ({code}) => code === accountCode);

    return (
      <Cell {...props}>
        {accountCode ? <div><b>{accounts[index].code.replace(/\./g, '')}</b><span style={{marginLeft: 10, display: 'inline', overflow: 'hidden', textOverflow: 'ellipsis',}} className="">{accounts[index].name}</span></div> : <div/>}
      </Cell>
    );
  }
}

class DebitCell extends Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    activeRow: PropTypes.number,
    onChange: PropTypes.func.isRequired,
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
              logInfo('Debit blurred');
              // setImmediate(() => onChange(rowIndex, !this.state.value.type || this.state.value.type === 'DEBIT' ? this.state.value.amount : undefined));
              store.setAmount(rowIndex, 'DEBIT', !this.state.value.type || this.state.value.type === 'DEBIT' ? this.state.value.amount : undefined);
            }}
            onFocus={(e) => {
              logInfo('Debit focused');
              //const amount = Number(e.target.value) || '';
              //this.setState({
              //  value: {type: 'DEBIT', amount}
              //}, () => store.setAmount(rowIndex, 'DEBIT', amount));
            }}
            onChange={(e) => {
              logInfo('Debit Changed');
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
    const {rowIndex, activeRow, styles, onChange, store, ...props} = this.props;

    if (rowIndex === activeRow) {
      return !type || type === 'DEBIT' ? this._renderEditor({rowIndex, onChange, store, props, styles}) : <div/>;
    }

    const {type, amount} = this.state.value;

    return (
      <Cell {...props}>
        {!type || type === 'DEBIT' ? <div>{amount}</div> : <div/>}
      </Cell>
    );
  }
}

class CreditCell extends Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    activeRow: PropTypes.number,
    onChange: PropTypes.func.isRequired,
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
              logInfo('Credit blurred');
              // setImmediate(() => onChange(rowIndex, !this.state.value.type || this.state.value.type === 'CREDIT' ? this.state.value.amount : undefined));
              store.setAmount(rowIndex, 'CREDIT', !this.state.value.type || this.state.value.type === 'CREDIT' ? this.state.value.amount : undefined);
            }}
            onFocus={(e) => {
              logInfo('Credit focused');
              //const amount = Number(e.target.value) || '';
              //this.setState({
              //  value: {type: 'CREDIT', amount}
              //}, () => store.setAmount(rowIndex, 'CREDIT', amount));
            }}
            onChange={(e) => {
              logInfo('Credit Changed');
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
    const {rowIndex, activeRow, styles, onChange, store, ...props} = this.props;

    if (rowIndex === activeRow) {
      return !type || type === 'CREDIT' ? this._renderEditor({rowIndex, onChange, store, props, styles}) : <div/>;
    }

    const {type, amount} = this.state.value;

    return (
      <Cell {...props}>
        {!type || type === 'CREDIT' ? <div>{amount}</div> : <div/>}
      </Cell>
    );
  }
}

class TextValueCell extends Component {

  static propTypes = {
    styles: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['name', 'description']).isRequired,
    store: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    activeRow: PropTypes.number,
    onChange: PropTypes.func.isRequired,
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

  _renderEditor = ({rowIndex, store, type, onChange, props, styles}) => {
    return (
      <Cell {...props}>
        <div className={''}>
          <input
            className={'form-control'}
            style={{}}
            type='text'
            value={this.state.value}
            onBlur={(e) => {
              logInfo(type, ' blurred');
              // setImmediate(() => onChange(rowIndex, this.state.value));
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
              logInfo(type, ' Changed');
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
      activeRow,
      styles,
      store,
      onChange,
      ...props
    } = this.props;

    if (rowIndex === activeRow) {
      return this._renderEditor({rowIndex, onChange, type, store, props, styles});
    }

    const value = this.state.value;

    return (
      <Cell {...props}>
        <div>{value}</div>
      </Cell>
    );
  }
}

function wrapWithC(Component, props) {
  class CWrapper extends React.Component {
    render() {
      return React.createElement(
        Component, {
          ...props,
          accounts: this.props.root.accounts,
        },
        this.props.children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {},

    fragments: {
      root: () => Relay.QL`
        fragment on Query {

          accounts{
            id,
            code,
            name,
            _classCode,
            _categoryCode,
            _groupCode,
            _parentCode,
          },

        }
      `,
    },
  });
}

module.exports = (props) => (
  <Relay.RootContainer
    Component={wrapWithC(TransactionForm, props)}
    route={new TransactionFormRoute()}
    renderLoading={function() {
      return (
        <Loading/>
      );
    }}
  />
);

function logInfo(...messages){
  return console.log(...messages);
}

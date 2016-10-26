import React, {Component, PropTypes} from 'react';

import styles from './Toolbar.scss';

import CSSModules from 'react-css-modules';

import stopEvent from '../../utils/stopEvent';

import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import FilterForm from './FilterForm';

import { Types, Statuses, Dates, } from './utils'

import find from 'lodash.findindex';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{
  static displayName = 'ExpensesToolbar';
  static propTypes = {

  };
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  state = {
    open: false,
  };
  _showFilterForm = () => {
    if(this.props.topLoading){
      return;
    }
    this.setState({
      open: true,
    })
  };
  _renderFilterForm(){
    if(this.state.open){
      return (
        <FilterForm
          filterArgs={{
            ...this.props.filterArgs,
            customer: this.props.filterArgs.customer ? { objectId: this.props.filterArgs.customer, } : null,
            payee: this.props.filterArgs.payee ? { objectId: this.props.filterArgs.payee, } : null,
          }}
          viewer={this.props.viewer}
          company={this.props.company}
          formKey={'FILTER-EXPENSES'}
          onCancel={this._close}
          onDone={this._onDone}
        />
      );
    }
  }
  _close = () => {
    this.setState({
      open: false,
    })
  };
  _onDone = ({ type, status, date, from, to, customer, payee, }) => {
    this.props.onFilter({
      type, status, date, from, to, customer, payee,
    });
  };
  render(){
    const self = this;
    const {intl,} = this.context;
    const { topLoading, } = this.props;
    const { type, status, date, from, to, customer, payee, } = this.props.filterArgs;
    let hasFilter = false;
    return (
      <div styleName={''}>

        <div styleName='filterBarContainer'>

          <Dropdown.Toggle
            title={'Filtrer'}
            styleName={'dijitDropDownButton filter-form-btn button unselectable'}
            open={this.state.open}
            onClick={e => { stopEvent(e); this._showFilterForm(); }}/>

          <div styleName='breadcrumbs breadcrumb'>
            <span>

              {date === 1
                ? intl.formatMessage(messages['last_x_days'], {days: 365})
                :  type === 'recent' ? null : function(){
                    hasFilter = true;
                    const dates = Dates(intl);
                    const index = find(dates, ({id}) => id === date);
                    return index === -1 ? null : renderLabel({
                        label: dates[index].name,
                        onClick: self._setFilterkeyValue.bind(this, 'date', 1),
                      })
                  }()}

              {type && type !== 'ALL'
                ? function(){
                  hasFilter = true;
                  const types = Types(intl);
                  const index = find(types, ({id}) => id === type);
                  return index === -1 ? null : renderLabel({
                      label: types[index].name,
                      onClick: self._setFilterkeyValue.bind(self, 'type', 'ALL')
                    })
                }()
                : null}

              {status && status !== 'ALL'
                ? type === 'recent' ? null : function(){
                  hasFilter = true;
                  const statuses = Statuses(intl)[type];
                  const index = find(statuses, ({id}) => id === status);
                  return index === -1 ? null : renderLabel({
                      label: statuses[index].name,
                      onClick: self._setFilterkeyValue.bind(self, 'status', 'ALL')
                    })
                }()
                : null}

              {customer && customer.objectId !== 'ALL'
                ? function(){
                  hasFilter = true;
                  const index = topLoading ? -1 : find(self.props.company.people.edges, ({node: {objectId}}) => objectId === customer.objectId);
                  return index === -1 ? null : renderLabel({
                      label: self.props.company.people.edges[index].node.displayName,
                      onClick: self._setFilterkeyValue.bind(self, 'customer', null)
                    })
                }()
                : null}

              {payee && payee.objectId !== 'ALL'
                ? function(){
                  hasFilter = true;
                  const index = topLoading ? -1 : find(self.props.company.people.edges, ({node: {objectId}}) => objectId === payee.objectId || objectId === payee);
                  return index === -1 ? null : renderLabel({
                      label: self.props.company.people.edges[index].node.displayName,
                      onClick: self._setFilterkeyValue.bind(self, 'payee', null)
                    })
                }()
                : null}

            </span>

            {hasFilter ? <a styleName='clearCrumbs' onClick={e => { stopEvent(e); this.props.onFilter({
              type: 'ALL',
              status: 'ALL',
              date: 1,
              from: undefined,
              to: undefined,
              customer: undefined,
            }); }}>{intl.formatMessage(messages['clear_filter'])}</a> : null}

          </div>

        </div>

        <div styleName='ugrid'>

          <div styleName='actions-bar'>

            <span styleName='actions-batch'>

              <i styleName='tertiary-sprite icon-arrow-left-down'></i>

              <Dropdown id={'batchActions'}>
                <Dropdown.Toggle styleName={'dijitDropDownButton button unselectable'} title={'Batch actions'}>{intl.formatMessage(messages['label_batch_actions'])}</Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem eventKey={1}>{intl.formatMessage(messages['menuitem_Print'])}</MenuItem>
                </Dropdown.Menu>
              </Dropdown>

            </span>

            <span styleName='actions-header'>
              <i tabIndex='0' data-action='refreshList' style={{ verticalAlign: 'middle', }} title='Refresh' className={'hi hi-refresh refreshList material-icons'} styleName=' actions  hide'>refresh</i>
              <i tabIndex='0' data-action='batchEdit' title='Batch edit' className={'hi hi-edit batchEdit material-icons'} styleName='hi actions  hide'>edit</i>
              <i tabIndex='0' data-action='printGrid' title='Print list' className={'hi hi-print printList material-icons'} styleName='hi actions '>print</i>
              <i tabIndex='0' data-action='exportToExcel' title='Export to Excel' className={'hi hi-export exportToExcel material-icons'} styleName='hi actions  hide'>import_export</i>
              <i tabIndex='0' data-action='showSettingsAction' title='Settings' className={'hi hi-settings-o settings material-icons'} styleName='hi actions  hide'>settings</i>
            </span>

          </div>

        </div>

        {this._renderFilterForm()}

      </div>
    );
  }

  _setFilterkeyValue = (key, value) => {
    this.props.onFilter({
      ...this.props.filterArgs,
      [key]: value,
    });
  };
}

function renderLabel({label, onClick}){
  return (
    <a style={{}} onClick={e => { stopEvent(e); onClick(); }}>
      {label}
      <span style={{float: 'none', marginLeft: 3, verticalAlign: 'sub'}} className={'close'}>&times;</span>
    </a>
  )
}

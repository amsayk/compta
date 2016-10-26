import React, {Component, PropTypes} from 'react';

import styles from './Toolbar.scss';

import CSSModules from 'react-css-modules';

import stopEvent from '../../../utils/stopEvent';

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
  static displayName = 'SalesToolbar';
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
          drawerOpen={this.props.drawerOpen}
          filterArgs={this.props.filterArgs}
          viewer={this.props.viewer}
          company={this.props.company}
          formKey={'CUSTOMER-FILTER-SALES'}
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
  _onDone = ({ type, status, date, from, to, }) => {
    this.props.onFilter({
      type, status, date, from, to,
    });
  };
  render(){
    const self = this;
    const {intl,} = this.context;
    const { type, status, date, from, to, } = this.props.filterArgs;
    let hasFilter = false;
    return (
      <div styleName={''}>

        <div styleName='ugrid'>

          <div styleName='actions-bar'>

            <span styleName='actions-batch'>

              <i styleName='tertiary-sprite icon-arrow-left-down'></i>

              <Dropdown id={'batchActions'}>
                <Dropdown.Toggle styleName={'dijitDropDownButton button unselectable'} title={'Batch actions'}>{intl.formatMessage(messages['label_batch_actions'])}</Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem eventKey={1}>{intl.formatMessage(messages['menuitem_Print'])}</MenuItem>
                  {/*<MenuItem eventKey={2}>{intl.formatMessage(messages['menuitem_Send'])}</MenuItem>*/}
                </Dropdown.Menu>
              </Dropdown>

            </span>

            <span styleName='filterBarContainer' style={{ marginLeft: 12, }}>

              <Dropdown.Toggle
                title={'Filtrer'}
                styleName={'dijitDropDownButton filter-form-btn button unselectable'}
                open={this.state.open}
                onClick={e => { stopEvent(e); this._showFilterForm(); }}/>

              <div styleName='breadcrumbs breadcrumb'>
                <span>

                  {type === 'recent' || date === 13 ? null : function(){
                      const dates = Dates(intl);
                      const index = find(dates, ({id}) => id === date);
                      index === -1 || (hasFilter = true);
                      return index === -1 ? null : function(){
                        const value = dates[index];
                        return renderLabel({
                            label: value.name,
                            onClick: self._setFilterkeyValues.bind(this, { 'date': 13, from: undefined, to: undefined, }),
                          });
                      }();
                    }()}

                  {type && type !== 'ALL'
                    ? function(){
                      const types = Types(intl);
                      const index = find(types, ({id}) => id === type);
                      index === -1 || (hasFilter = true);
                      return index === -1 ? null : renderLabel({
                          label: types[index].name,
                          onClick: self._setFilterkeyValue.bind(self, 'type', 'ALL')
                        });
                    }()
                    : null}

                </span>

                {hasFilter ? <a styleName='clearCrumbs' onClick={e => { stopEvent(e); this.props.onFilter({
                  type: 'ALL',
                  date: 13,
                  status: 'ALL',
                  from: undefined,
                  to: undefined,
                }); }}>{intl.formatMessage(messages['clear_filter'])}</a> : null}

              </div>

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

  _setFilterkeyValues = (values) => {
    this.props.onFilter({
      ...this.props.filterArgs,
      ...values,
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

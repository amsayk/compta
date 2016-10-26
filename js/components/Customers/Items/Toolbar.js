import React, {Component, PropTypes} from 'react';

import styles from './Toolbar.scss';

import CSSModules from 'react-css-modules';

import stopEvent from '../../../utils/stopEvent';

import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import find from 'lodash.findindex';

import SearchBox from './SearchBox';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{
  static displayName = 'CustomersSalesToolbar';
  static propTypes = {

  };
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  state = {
  };

  render(){
    const self = this;
    const {intl,} = this.context;
    const { type, status, date, from, to, customer, } = this.props.filterArgs;
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

            <SearchBox
              topLoading={this.props.topLoading}
              company={this.props.company}
              customers={this.props.topLoading ? { edges: [], } : this.props.company.customers}
            />

            <span styleName='actions-header'>
              <i tabIndex='0' data-action='refreshList' style={{ verticalAlign: 'middle', }} title='Refresh' className={'hi hi-refresh refreshList material-icons'} styleName=' actions  hide'>refresh</i>
              <i tabIndex='0' data-action='batchEdit' title='Batch edit' className={'hi hi-edit batchEdit material-icons'} styleName='hi actions  hide'>edit</i>
              <i tabIndex='0' data-action='printGrid' title='Print list' className={'hi hi-print printList material-icons'} styleName='hi actions '>print</i>
              <i tabIndex='0' data-action='exportToExcel' title='Export to Excel' className={'hi hi-export exportToExcel material-icons'} styleName='hi actions  hide'>import_export</i>
              <i tabIndex='0' data-action='showSettingsAction' title='Settings' className={'hi hi-settings-o settings material-icons'} styleName='hi actions  hide'>settings</i>
            </span>

          </div>

        </div>

      </div>
    );
  }
}

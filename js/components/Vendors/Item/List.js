import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './List.scss';

import stopEvent from '../../../utils/stopEvent';

import classnames from 'classnames';

import VendorForm from '../VendorForm/VendorForm';

import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import throttle from 'lodash.throttle';
import filter from 'lodash.filter';
import map from 'lodash.map';
import orderBy from 'lodash.orderby';

import {
  defineMessages,
  intlShape,
} from 'react-intl';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {
  static displayName = 'List';
  static contextTypes = {
    intl: intlShape.isRequired,
    router: PropTypes.object.isRequired,
  };
  constructor(props, context){
    super(props, context);

    this.state = {
      open: this.props.open,
      filterText: undefined,
      sortBy: localStorage.getItem('vendor.list.sortBy') || 'displayName',
      modalOpen: false,
    };
  }
  _openModal = () => {
    this.setState({
      modalOpen: true,
    });
  };
  _closeModal = () => {
    this.setState({
      modalOpen: false,
    });
  };
  _renderModal = () => {
    if(!this.state.modalOpen){
      return null;
    }

    return (
      <VendorForm
        viewer={this.props.viewer}
        company={this.props.company}
        formKey={'NEW'}
        onCancel={this._closeModal}
        onDone={({vendor}) => {
          setTimeout(() => { this.context.router.push(`/apps/${this.props.company.id}/vendor/${vendor.id}`); }, 10);
        }}
      />
    );
  };
  _onSort = (key) => {
    if(this.state.sortBy !== key){
      this.setState({
        sortBy: key,
      }, () => {
        localStorage.setItem('vendor.list.sortBy', key);
      });
    }
  };
  _onFilter = throttle((text) => {
    this.setState({
      filterText: text,
    });
  }, 150);
  componentWillReceiveProps(nextProps){
    if(this.state.open !== nextProps.open){
      this.setState({
        open: nextProps.open,
      });
    }
  }
  render(){
    const { intl, } = this.context;
    const { open, filterText, sortBy, } = this.state;
    const { company, loading, vendor, styles, onToggle, } = this.props

    const vendors = loading ? [] : loadData(company.vendors.edges, { filterText, sortBy, })

    return (
      <div styleName='directory-pane flex-fixed' style={{ position: 'absolute', height: '100%', }}>

        <div style={{ height: '100%', }}>

          <div styleName={classnames('directory', { showDirectory: open, hideDirectory: !open, })} style={open ? { height: '100%', } : {}}>

            {open ? <div style={{ height: '100%', }}>

              <div styleName='list-stage'>

                <div styleName='top-stage'>
                  <a styleName='back-link inlineBlock' onClick={e => { stopEvent(e); setTimeout(() => { this.context.router.push(`/apps/${company.id}/vendors`); }, 100); }}>
                    <div styleName='inlineBlock arrow-sprite backArrow'></div>
                    <span>Fournisseurs</span>
                  </a>
                  <div onClick={onToggle} styleName='pane-toggle-directory-button floatRight half-hamburger-left-arrow'></div>
                  <div styleName='hi addNew' onClick={this._openModal}>
                    <i className="material-icons">add</i>
                  </div>
                </div>

                <div className={'quickfill'} styleName='dijitSelect dijitInline searchBox dijitTextBox dijitComboBox ' role='combobox' aria-haspopup='true'>

                  <input
                    styleName='dijitReset dijitInputInner dijitButtonText'
                    type='text' autoComplete='off'
                    role='textbox'
                    tabIndex='0'
                    // placeholder='Rechercher par nom ou entreprise'
                    placeholder='Rechercher'
                    onChange={e => this._onFilter(e.target.value)}
                    value={this.state.filterText || ''}
                  />

                  <div styleName='dijitReset dijitButtonNode dijitArrowButton dijitDownArrowButton' role='presentation'>
                    <div styleName='dropDownImage'></div>
                  </div>

                </div>

                <div className='sort'>

                  <span styleName='actions-sort'>

                    {/*<button type='button' styleName='button dijitDownArrowButton dijitDropDownButton' style={{ WebkitUserSelect: 'none', }}>
                      <span>Trier par nom</span>
                      <span styleName='caret-up'></span>
                    </button>*/}

                    {renderActions(this, { intl, sortBy, styles, })}
                  </span>

                </div>

              </div>

              {/*<div styleName='progress-info' data-qbo-bind='visible: !isStoreLoaded' style='display: none;'>Chargement des données...</div>*/}

              <div styleName='directoryList list'>

                <div classname={'dgrid-list'} styleName='dgrid' role='grid' style={{ height: 52 * Math.min(13, vendors.length), }}>

                  {/*<div styleName='dgrid-header dgrid-header-row ui-widget-header dgrid-header-hidden'></div>*/}

                  <div styleName='dgrid-scroller' tabIndex='-1' style={{ WebkitUserSelect: 'none', marginTop: 0, marginBottom: 0, }}>

                    <div styleName='dgrid-content'>

                      {/*<div styleName='dgrid-preload' style='height: 0px;'></div>*/}

                      {map(vendors, ({ node: obj,}) => {
                        return (
                          <div className={classnames(styles['dgrid-row'], { [styles['dgrid-selected']]: obj.id === vendor.id, })} tabIndex='0'>

                            <div className={styles['directory-list-item']}>

                              <a className={styles['link']} onClick={e => { stopEvent(e); setTimeout(() => { this.context.router.push(`/apps/${company.id}/vendor/${obj.objectId}`); }, 100); }}>
                                <div className={styles['display-name']}>{obj.displayName}</div>
                                <div className={styles['balance']}>{intl.formatNumber(obj.expensesStatus.open.amount, { format: 'MAD', })}</div>
                              </a>

                            </div>

                          </div>
                        );
                      })}

                      {/*<div styleName='dgrid-preload' style='display: none;'></div>*/}

                    </div>

                  </div>

                  {/*<div styleName='dgrid-header dgrid-header-scroll dgrid-scrollbar-width ui-widget-header' style='height: 0px;'></div>*/}

                  {/*<div styleName='dgrid-footer dgrid-footer-hidden'></div>*/}

                </div>

              </div>

            </div> : null}

          </div>

          {open ? null : <div styleName={'pane-toggle'}>
            <div onClick={onToggle} styleName='half-hamburger-right-arrow pane-toggle-button'></div>
          </div>}

        </div>

        {loading ? null : this._renderModal()}

      </div>
    );
  }
}

function loadData(vendors, { filterText, sortBy, }){

  function getSortKey() {
    switch(sortBy){
      case 'displayName': return (obj) => obj.node.displayName;
      case 'openBalance': return (obj) => obj.node.expensesStatus.open.amount;
    }
  }

  if(typeof filterText !== 'undefined' && filterText !== null && filterText.length > 0){
    return orderBy(
      filter(vendors, ({ node: obj, }) => {
        return obj.displayName.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
      }),

      [ getSortKey() ],

      [ 'desc' ]
    );
  }

  return orderBy(
    vendors,

    [ getSortKey() ],

    [ 'desc' ]
  );
}

function renderActions(self, { intl, sortBy, styles, }){
  return (
      // <DropdownActions>
      //   <ul className={'dropdown-menu'} style={getActionsStyle()}>
      //     {ACTIONS.map(action => {
      //       return (
      //         <li rol='presentation'>
      //           <a onClick={self._onSort.bind(self, action)} role='menuitem' tabIndex='-1'>{intl.formatMessage(messages[`SortBy_${action}`])}</a>
      //         </li>
      //       );
      //     })}
      //   </ul>
      // </DropdownActions>

      <Dropdown>

        <Dropdown.Toggle className={`${styles['ddijitDropDownButton']} ${styles['bbutton']}  ${styles['unselectable']} `}>
          <span style={{
            display: 'inline-block',
            maxWidth: '90%',
            minWidth: '90%',
          }}>{intl.formatMessage(messages[`SortBy_${sortBy}`])}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <MenuItem onSelect={self._onSort.bind(self, 'displayName')} eventKey={1}>{intl.formatMessage(messages[`SortBy_displayName`])}</MenuItem>
          <MenuItem onSelect={self._onSort.bind(self, 'openBalance')} eventKey={2}>{intl.formatMessage(messages['SortBy_openBalance'])}</MenuItem>
        </Dropdown.Menu>

      </Dropdown>
  );
}

const messages = defineMessages({
  SortBy_displayName: {
    id: 'vendors-List.sort-by-display-name',
    defaultMessage: 'Trier par nom',
  },

  SortBy_openBalance: {
    id: 'vendors-List.sort-by-open-balance',
    defaultMessage: 'Trier par solde courant',
  }
})

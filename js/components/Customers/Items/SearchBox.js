import React, { Component, PropTypes, } from 'react';

import CSSModules from 'react-css-modules';

import styles from './SearchBox.scss';

import stopEvent from '../../../utils/stopEvent';

import classnames from 'classnames';

import filter from 'lodash.filter';
import throttle from 'lodash.throttle';

import DropdownMenu from 'react-bootstrap/lib/DropdownMenu';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  intlShape,
} from 'react-intl';

import enhanceWithClickOutside from '../../../utils/react-click-outside';

@enhanceWithClickOutside
class ClickOutsideWrapper extends Component {
  handleClickOutside = (e) => {
    this.props.onClickOutside(e);
  };

  render() {
    return (
      <div className={''} style={{ display: 'inline-block', }}>{this.props.children}</div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'SearchBox';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  state = {
    open: true,
  };
  static propTypes = {
    customers: PropTypes.object.isRequired,
  };
  _getResults = () => {
    if(!this.refs || !this.refs.textInput){
      return [];
    }

    const val = (this.refs.textInput.value || '').trim().toLowerCase();
    const customers = val.length === 0 ? [] : filter(
      this.props.customers.edges, ({ node: { displayName, company, }, }) => displayName.toLowerCase().indexOf(val) !== -1)
    return customers;
  }
  _onInput = e => {
    stopEvent(e);

    if(this.props.topLoading){
      return;
    }

    const doWork = (resolve) => {
      this.setState({ open: true, }, resolve);
    };

    if(this._promise){
      this._promise.then(doWork);
    }else{
      this._promise = new Promise(doWork);
    }
  };
  render(){
    const { open, } = this.state;
    return(
      <ClickOutsideWrapper
        onClickOutside={(e) => {
          this.setState({ open: false, });
        }}>

        <div className={'quickfill qfComboBox dijitValidationTextBox'} styleName='dijitInline searchBox dijitTextBox dijitComboBox' role='combobox'>

          <input
            ref={'textInput'}
            className={'dijitInputInner'}
            styleName='dijitReset button'
            type='text'
            autoComplete='off'
            role='textbox'
            tabIndex='0'
            placeholder='Rechercher un client ou une société'
            onChange={this._onInput}
            onFocus={(e) => { stopEvent(e); this.setState({ open: true, }); }}
          />

          <div className={'dijitDownArrowButton'} styleName='dijitReset dijitButtonNode dijitArrowButton '>
            <div styleName='dropDownImage'></div>
          </div>

          <SearchResults
            company={this.props.company}
            open={open}
            results={this._getResults()}
            ref={'results'}
          />

        </div>

      </ClickOutsideWrapper>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
class SearchResults extends Component{
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      results: this.props.results,
    };
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      results: nextProps.results,
    });
  }
  _onItem = (obj, e) => {
    stopEvent(e);

    this.context.router.push({
      pathname: `/apps/${this.props.company.id}/customer/${obj.objectId}`,
      state: {},
    });
  };
  render(){
    const { results, } = this.state;
    const open = results.length > 0 && this.props.open;
    return (
      <div className={classnames({open: open, })} styleName={'dropdown'}>
        <DropdownMenu open={open} onClose={() => {}}>
          {results.map(({ node: r, }) => {
            return (
              <MenuItem onClick={this._onItem.bind(this, r)} key={r.objectId} eventKey={r.objectId}>{r.displayName}
              </MenuItem>
            );
          })}
        </DropdownMenu>
      </div>
    )
  }
}

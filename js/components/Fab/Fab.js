import React, { Component, PropTypes, } from 'react';

import {
  Menu,
  MainButton,
  ChildButton,
} from '../utils/react-mfb/index';

import stopEvent from '../../utils/stopEvent';

import CSSModules from 'react-css-modules';

import styles from './Fab.scss';

import AppMenu from './items/AppMenu';
import Recent from './items/Recent';
import Search from './items/Search';

@CSSModules(styles, { allowMultiple: true, })
class Fab extends Component{
  static displayName = 'Fab';
  static propTypes = {};
  static contextTypes = {};

  state = {
    modalOpen: false,
    type: undefined,
  };

  _onModalOpen = (type, e) => {
    stopEvent(e);

    this.setState({
      modalOpen: true,
      type,
    });
  }
  _close = () => {
    this.setState({
      modalOpen: false,
      type: undefined,
    });
  }

  _renderModal = () => {
    if(!this.state.modalOpen){
      return null;
    }

    const { company, } = this.props;

    switch(this.state.type){
      case 'add':
        return (
          <AppMenu
            onClose={this._close}
            company={company}
          />
        );

      case 'search':
        return (
          <Search
            onClose={this._close}
            company={company}
          />
        );

      case 'history':
        return (
          <Recent
            onClose={this._close}
            company={company}
          />
        );
    }
  }

  render(){
    const { company, } = this.props;
    return (
      <div>

        <Menu effect='zoomin' position='br' method='hover'>

          <MainButton iconResting='edit' href={null} iconActive='close' />

          <ChildButton
            icon='add'
            label='Ajouter'
            onClick={this._onModalOpen.bind(this, 'add')}
          />

          <ChildButton
            icon='search'
            label='Rechercher'
            onClick={this._onModalOpen.bind(this, 'search')}
          />

          <ChildButton
            icon='history'
            label='Opérations récentes'
            onClick={this._onModalOpen.bind(this, 'history')}
          />

		    </Menu>

        {this._renderModal()}

			</div>
    );
  }
}

class S extends Component{
  shouldComponentUpdate(nextProps){
    return this.props.company.id !== nextProps.company.id;
  }
  componentWillReceiveProps(nextProps) {
  }
  render() {
    return <Fab {...this.props}/>;
  }
}

module.exports = S;

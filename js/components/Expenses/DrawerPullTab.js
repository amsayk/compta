import React, { Component, PropTypes, }  from 'react';

import CSSModules from 'react-css-modules';

import classnames from 'classnames';

import styles from './DrawerPullTab.scss';

@CSSModules(styles, { allowMultiple: true, })
export default class extends React.Component{
  static displayName = 'DrawerPullTab';
  static propTypes = {
    opened: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
  }
  state = {};
  constructor(props, context){
    super(props, context);
    this.state.opened = this.props.opened;
  }
  componentDidReceivedProps(nextProps){
    if(this.state.opened !== nextProps.opened){
      this.setState({
        opened: nextProps.opened,
      })
    }
  }
  // shouldComponentUpdate(nextProps, nextState){
  //   return this.state.opened !== nextState.opened || this.state.opened !== nextProps.opened;
  // }
  render(){
    const { opened, } = this.state;
    return (
      <div onClick={this.props.onToggle} styleName={classnames('drawerPulltab arrow-sprite', { opened, })}></div>
    );
  }
}

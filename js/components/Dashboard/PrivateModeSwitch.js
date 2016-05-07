import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './PrivateModeSwitch.scss';

import classnames from 'classnames';

@CSSModules(styles, {allowMultiple: true})
export default class PrivateModeSwitch extends Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      on: this.props.on,
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.state.on !== nextProps.on){
        this.setState({
          on: nextProps.on,
        });
    }
  }
  render(){
    const { on, } = this.state;
    const { loading, } = this.props;
    return (
      <div styleName='showHideSwitch'>
        <div styleName='label'>Mode privé{' '}</div>
        <div styleName={classnames('switch', { off: !on, })}>
          <div styleName={'switchToggle off'} onClick={this.props.onToggle}>
            <div styleName='sliderWrapper'>
              <div styleName='slider'>
                <div styleName='yes'>Oui</div>
                <div styleName='no'>Non</div>
              </div>
            </div>
            <div styleName='divider'></div>
          </div>
          <div styleName='switchDisable'></div>
        </div>
      </div>
    );
  }
}

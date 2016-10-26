'use strict';

var React = require('react');
var classnames = require('classnames');

var MainButton = React.createClass({
  getDefaultProps: function(){
    return {
      href: '#',
      onClick: function(){},
      iconResting: '',
      iconActive: '',
      label: null
    };
  },
  render: function(){
    var iconResting = classnames('mfb-component__main-icon--resting', 'material-icons');
    var iconActive = classnames('mfb-component__main-icon--active', 'material-icons');
    var mainClass = classnames('mfb-component__button--main', this.props.className);
    if(this.props.label){
      return (
        <a href={this.props.href} className={mainClass} onClick={this.props.onClick} data-mfb-label={this.props.label}>
          <i className={iconResting}>{this.props.iconResting}</i>
          <i className={iconActive}>{this.props.iconActive}</i>
        </a>
      );
    } else {
      return (
        <a href={this.props.href} className={mainClass} onClick={this.props.onClick}>
          <i className={iconResting}>{this.props.iconResting}</i>
          <i className={iconActive}>{this.props.iconActive}</i>
        </a>
      );
    }
  }
});

module.exports = MainButton;

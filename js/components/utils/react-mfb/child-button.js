'use strict';

var React = require('react');
var classnames = require('classnames');

var ChildButton = React.createClass({
  render: function(){
    var iconClass = classnames('mfb-component__child-icon', 'material-icons');
    var className = classnames('mfb-component__button--child', this.props.className);
    return (
      <li>
        <a href={this.props.href}
           data-mfb-label={this.props.label}
           onClick={this.props.onClick}
           className={className}>
          <i className={iconClass}>{this.props.icon}</i>
        </a>
      </li>
    );
  }
});

module.exports = ChildButton;

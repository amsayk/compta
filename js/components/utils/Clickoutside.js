import React, {Component, PropTypes} from 'react';

import enhanceWithClickOutside from '../../utils/react-click-outside';

@enhanceWithClickOutside
export default class extends React.Component {
  static displayName = 'Clickoutside';
  static propTypes = {
    onClickOutside: PropTypes.func.isRequired,
  };
  handleClickOutside = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    this.props.onClickOutside(e);
  };

  render() {
    return (
      <div className={''}>{this.props.children}</div>
    );
  }
}

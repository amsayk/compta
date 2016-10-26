import React, {Component, PropTypes} from 'react';

import NewItemListItem from './NewItemListItem';

export default class extends React.Component{
  static displayName = 'ProductListItem';
  static propTypes = {
    item: PropTypes.object.isRequired,
  };
  render(){
    const p = this.props.item;

    if(p.id === 'NEW'){
      return <NewItemListItem {...this.props}/>;
    }

    return (
      <span>
        <strong>{ p.displayName }</strong>
      </span>
    );
  }
}

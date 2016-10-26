import React, {Component, PropTypes} from 'react';

import NewItemListItem from './NewItemListItem';

export default class extends React.Component{
  static displayName = 'VendorListItem';
  static propTypes = {
    item: PropTypes.object.isRequired,
  };
  render(){
    const {item : person, ...props} = this.props;

    if(person.id === 'NEW'){
      return <NewItemListItem {...props}/>;
    }

    return (
      <span>
        <strong>{ person.displayName }</strong>
      </span>
    );
  }
}

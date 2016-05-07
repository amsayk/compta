import React, {Component, PropTypes} from 'react';

// import NewItemListItem from './NewItemListItem';

export default class extends Component{
  static displayName = 'CategoryListItem';
  static propTypes = {
    item: PropTypes.object.isRequired,
  };
  render(){
    const p = this.props.item;

    // if(p.id === 'NEW'){
    //   return <NewItemListItem {...this.props}/>;
    // }

    return (
      <span>{ p.name }
      </span>
    );
  }
}

import React, {Component, PropTypes} from 'react';

import getCategory from '../../../utils/getAccountCategory';

import NewItemListItem from './NewItemListItem';

import padEnd from 'lodash.padend';

export default class extends React.Component{
  static displayName = 'AccountListItem';
  static propTypes = {
    item: PropTypes.object.isRequired,
  };
  render(){
    const p = this.props.item;

    if(p.id === 'NEW'){
      return <NewItemListItem {...this.props}/>;
    }

    return (
      <div style={{ position: 'relative', }}>
        <span className={'accountCode'} style={{ marginRight: 5, }}>{padEnd(p.code.replace(/\./g, ''), 5, '0')}</span><strong>{ p.name }</strong> <span style={{ position: 'absolute', right: 0, paddingRight: 5, color: '#cccccc', fontStyle: 'italic', }}>{getCategory(p)}</span>
      </div>
    );
  }
}

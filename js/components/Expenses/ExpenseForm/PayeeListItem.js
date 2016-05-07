import React, {Component, PropTypes} from 'react';

import NewItemListItem from './NewItemListItem';

import { intlShape, defineMessages, } from 'react-intl';

function getPersonType(self, person){
  const {intl} = self.context;
  switch(person.type){
    case 'Vendor':   return intl.formatMessage(messages['Vendor']);
    case 'Customer': return intl.formatMessage(messages['Customer']);
    case 'Employee': return intl.formatMessage(messages['Employee']);
    default:         return '';
  }
}

const messages = defineMessages({
  Customer: {
    id: 'expense-payee-list-item-new-item-customer.title',
    defaultMessage: 'Client',
  },
  Vendor: {
    id: 'expense-payee-list-item-new-item-vendor.title',
    defaultMessage: 'Fournisseur',
  },
  Employee: {
    id: 'expense-payee-list-item-new-item-employee.title',
    defaultMessage: 'Employé',
  },
})

export default class extends Component{
  static displayName = 'PayeeListItem';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static propTypes = {
    item: PropTypes.object.isRequired,
  };
  render(){
    const {item : person, ...props} = this.props;

    if(person.id === 'NEW'){
      return <NewItemListItem {...props}/>;
    }

    return (
      <div style={{ position: 'relative', }}>
        <strong>{ person.displayName }</strong> <span style={{ position: 'absolute', right: 0, paddingRight: 5, color: '#cccccc', fontStyle: 'italic', }}>{getPersonType(this, person)}</span>
      </div>
    );
  }
}

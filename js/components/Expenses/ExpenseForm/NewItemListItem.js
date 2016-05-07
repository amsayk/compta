import React, {Component, PropTypes} from 'react';

import styles from './NewItemListItem.scss';

import CSSModules from 'react-css-modules';

import stopEvent from '../../../utils/stopEvent';

import { intlShape, defineMessages, } from 'react-intl';

const messages = defineMessages({
  addNew: {
    id: 'expense-list-item-new-item.title',
    defaultMessage: 'Ajouter',
  },
})

@CSSModules(styles, {allowMultiple: true})
export default class extends Component {
  static displayName = 'NewItemListItem';
  static propTypes = {};
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  _onClick = e => {
    stopEvent(e);
    this.props.onAddNew(e);
  };
  render() {
    const {intl} = this.context;
    return (
      <div onClick={e => { this._onClick(e) }} styleName='dijitMenuItem addNew' role='option'>
        <div styleName='comboboxRow hi'>
          <div styleName='comboboxAddNewLabel'>
            <i className={'material-icons'} style={{fontWeight: 'bolder', verticalAlign: 'middle'}}>add</i> {' '}
            {intl.formatMessage(messages['addNew'])}
          </div>
        </div>
      </div>
    );
  }
}

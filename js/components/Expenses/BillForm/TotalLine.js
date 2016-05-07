import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './BillForm.scss';

import CSSModules from 'react-css-modules';

import getFieldValue from '../../utils/getFieldValue';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static contextTypes = {
    intl: intlShape.isRequired
  };
  render(){
    const {intl,} = this.context;
    const {store, bill, fields: {},} = this.props;
    const total = store.subtotal;
    return (
      <div styleName='total-wrapper'>

        <div styleName='total'>

          <div styleName=''>

            <div styleName={'width_x'} className='row' style={{ paddingTop: 0, paddingBottom: 15, }}>

              <div styleName='subsection12TitleText' className='col-sm-8' style={{textAlign: 'right'}}>
                {intl.formatMessage(messages['Total'])}
              </div>

              <div style={{display: 'inline-block'}} className='col-sm-4 last-col' style={{textAlign: 'right'}}>
                <div styleName='amount'>{intl.formatNumber(total, {format: 'MAD'})}</div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}

import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './PaymentForm.scss';

import CSSModules from 'react-css-modules';

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
    return (
      <div styleName='memo-wrapper'>

        <div styleName='memo'>

          <div className='line-3' style={{minHeight: 50, padding: 0, marginTop: 50, marginBottom: 0, }}>

            <div styleName='subsection12TitleText' className='label-3' style={{marginBottom: '.5rem'}}>{intl.formatMessage(messages['memo'])}</div>

            <div className='memo'>
                    <textarea {...this.props.fields.memo} style={{ width: 'initial', borderRadius: 0, resize: 'none', }}
                                        className='form-control memo' cols='40' rows='5'/>
            </div>

          </div>

        </div>

      </div>
    );
  }
}

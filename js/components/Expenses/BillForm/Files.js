import React, {Component, PropTypes} from 'react';

import styles from './BillForm.scss';

import CSSModules from 'react-css-modules';

import Upload from '../../upload/items';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{

  static contextTypes = {
    intl: intlShape.isRequired
  };

  _onFiles = (id) => {
    //
  };

  render(){
    const {intl,} = this.context;
    return (
      <div styleName='files-wrapper'>

        <div styleName='files'>

          <div className='line-3' style={{minHeight: 50, padding: 0, marginTop: 50, marginBottom: 50, }}>

            {/* <div styleName='subsection12TitleText' className='label-3' style={{marginBottom: '.5rem'}}>{intl.formatMessage(messages['files'])}</div> */}

            <div className='memo'>
              <Upload accept={ACCEPT} onChange={this._onFiles}/>
            </div>

          </div>

        </div>

      </div>
    );
  }
}

const ACCEPT = [
  '.jpg',
  '.pdf',
  '.doc',
  '.docx',
  '.jpeg',
  '.png',
  '.gif'
];

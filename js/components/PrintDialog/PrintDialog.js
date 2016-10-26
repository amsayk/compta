import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import stopEvent from '../../utils/stopEvent';

import Modal from 'react-bootstrap/lib/Modal';

import Loading from '../Loading/Loading';

import Dialog, {Header, Body, Footer} from '../utils/Dialog';

import CSSModules from 'react-css-modules';

import classnames from 'classnames';

import styles from './PrintDialog.scss';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import requiredPropType from 'react-prop-types/lib/all';

@CSSModules(styles, {allowMultiple: true})
export default class PrintDialog extends React.Component {

  static displayName = 'PrintDialog';

  static propTypes = {
    url: requiredPropType(
      React.PropTypes.string,
      function(props, propName, componentName) {
        if (props.loading === false && !props.url) {
          return new Error('url required!');
        }
      }
    ),
    error: PropTypes.any,
    onCancel: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  componentDidMount() {
    ga('send', 'pageview', '/modal/app/transaction/print');
  }

  _handleClose = (e) => {
    if(e){
      stopEvent(e);
    }

    setImmediate(() => {
      this.props.onCancel();
    });
  };

  _handleRefresh = (e) => {
    if(e){
      stopEvent(e);
    }

    setImmediate(() => {
      this.props.onRefresh && this.props.onRefresh();
    });
  };

  render() {
    const self = this;

    const {
      styles,
      loading,
    } = this.props;

    const {intl,} = this.context;

    return (
      <Modal dialogClassName={`${styles['modal']} ${styles['mini']} print-dialog`}
             dialogComponentClass={Dialog}
             ref={ref => this._dialog = ref}
             animation={false}
             className={classnames({'print-dialog': true, [styles['print-dialog'] || '']: true, })}
             show={true} keyboard={true} backdrop={true} onHide={() => this._handleClose()} autoFocus enforceFocus>

        {/*<Header styleName={'modal-header'} closeButton>{intl.formatMessage(messages['Title'])}
        </Header>*/}

        <Modal.Header closeButton>
          <h3>
          {intl.formatMessage(messages['Title'])}
          </h3>

        </Modal.Header>

        <Body>

          <div styleName='table stretch'>

            <div styleName=''>

              <div>

                <div className='the-container table' style={{}}>

                  <div style={{}}>

                    <div style={{ margin: '15px 25px 0', }}>
                    {intl.formatMessage(messages['subtitle'])}
                    </div>

                    {loading ? <Loading/> : this._showPdf() }

                  </div>

                </div>

              </div>


            </div>

          </div>

        </Body>

        <Modal.Footer>

          <div styleName='' style={{}}>

            <div styleName="tableCell floatLeft">

            <button
              style={{minWidth: 70}}
              styleName='btn dark'
              onClick={e => this._handleClose()} className='unselectable'>{intl.formatMessage(messages['Done'])}</button>

              {' '}

            {process.env.NODE_ENV !== 'production' && <button
              style={{minWidth: 70}}
              styleName='btn dark'
              onClick={e => this._handleRefresh()} className='unselectable'>{intl.formatMessage(messages['Refresh'])}</button>}

            </div>


            <button
              style={{minWidth: 70}}
              styleName='btn primary floatRight'
              onClick={e => this._handlePrint()} className='unselectable'>{intl.formatMessage(messages['Print'])}</button>


          </div>

        </Modal.Footer>

      </Modal>
    );

  }

  _showPdf() {
    const { url, styles, } = this.props;
    return (
      <div className={styles['content']}>

        <iframe title={'Impression'} className={styles['pdfV']} src={url}></iframe>

    	</div>
    );
  }

  _handlePrint() {
    if(this.props.url){
      const [ _, base64, ] = this.props.url.split(/,/);
      // var blob = new Blob([base64ToUint8Array(base64)], {type: 'application/pdf;charset=utf-8'});

      require.ensure([], function (require) {
        const FileSaver = require('../../utils/file-saver'); // require('file-saver');
        // FileSaver.saveAs(blob, 'Download.pdf');
        FileSaver.saveAs([base64ToUint8Array(base64)], 'Download.pdf', 'application/pdf;charset=utf-8');
      }, 'FileSaver');
    }
  }
}

function base64ToUint8Array(base64) {
  var raw = atob(base64);
  var uint8Array = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return uint8Array;
}

import React, {Component, PropTypes} from 'react';

import messages from './messages';

import uid from '../../utils/uid';

import {intlShape,} from 'react-intl';

import stopEvent from '../../utils/stopEvent';
import readBlob from '../../utils/readBlob';

import DropZone from 'react-dropzone';

import concat from 'lodash.concat';
import uniqBy from 'lodash.uniqby';

import styles from './styles.scss';

import CSSModules from 'react-css-modules';

@CSSModules(styles, {allowMultiple: true,})
export default class extends React.Component{
  static displayName = 'uploads';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    accept: PropTypes.array,
    maxSize: PropTypes.number.isRequired,
  };
  static defaultProps = {maxSize: 15,};
  state = {
    files: [],
  };
  onDrop = (files) => {
    this._change(
      uniqBy(concat(files, this.state.files || []), (f) => f.name));
  };
  _onRemove = (i, e) => {
    stopEvent(e);
    this.state.files.splice(i, 1);
    this.setState({
      files: this.state.files,
    });
  };
  getFiles(id){
    const {id: localId, data} = image;
    return id === localId ? data : null;
  }
  _change = (files) => {
    this.setState({
      files,
    }, () => {
      const files = this.state.files.filter(f => f.size <= (this.props.maxSize * 1024 * 1024));
      if(files.length === 0){
        this.props.onChange(undefined);
      }else {
        Promise.all(files.map(readBlob)).then(results => {
          this.props.onChange(results);
        })
      }
    });
  };
  render(){
    const {intl,} = this.context;
    const {files,} = this.state;
    return (
      <div styleName='attachmentsInfo attachmentsWidget'>

        <a styleName='secondary-sprite fileInputWrapper'>
          <div styleName='fileInput'></div>
        </a>

        <span styleName='subsection12TitleText'>{intl.formatMessage(messages['Attachments'])}</span>

        <span styleName='attachprompt'>{intl.formatMessage(messages['UploadMaxSize'], {size: this.props.maxSize})}</span>

        <DropZone activeClassName={this.props.styles['dropZone-active']} style={{}} rejectClassName={this.props.styles['dropZone-reject']} ref={'dropZone'} onDrop={this.onDrop} accept={(this.props.accept || []).join(',')}>

          <div styleName='droppable fileList empty'>

            <div styleName='droppable dragDropPrompt'>
              {intl.formatMessage(messages['DropHint'])}
            </div>

          </div>

        </DropZone>

        <div style={{marginTop: 9}}>
        {this.state.files.length
          ? <div style={{}}>
          {this.state.files.map((file, i) => <div style={{}}><i style={{verticalAlign: 'bottom',}} className="material-icons">check_circle</i>{' '}<span className={this.props.styles['subsection12TitleText']} style={{ color: '#b8b8b8', }}>{file.name}</span>{' '}{' '}<button onClick={this._onRemove.bind(this, i)} style={{float: 'none'}} className="close">&times;</button> </div>)}
          </div>
          : null}
        </div>

      </div>
    );
  }
}

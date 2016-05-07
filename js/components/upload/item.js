import React, {Component, PropTypes} from 'react';

import messages from './messages';

import {intlShape,} from 'react-intl';

import styles from './styles.scss';

import CSSModules from 'react-css-modules';

import DropZone from 'react-dropzone';

import ImageLoader from 'react-imageloader';

import readBlob from '../../utils/readBlob';

function preloader(intl, styles, maxSize){
  return () => (
    <div style={{margin: '4em 1.5em',}}>
      <span className={styles['attachprompt']}>{intl.formatMessage(messages['UploadMaxSize'], {size: maxSize})}</span>
    </div>
  )
}

@CSSModules(styles, {allowMultiple: true,})
export default class extends Component{
  static displayName = 'upload';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    accept: PropTypes.array,
    maxSize: PropTypes.number.isRequired,
  };
  static defaultProps = {maxSize: 5};
  state = {
    file: undefined,
  };
  // constructor(props, context){
  //   super(props, context);
  //
  //   const file = this.props.value && new File(
  //     this.props.value,
  //   );
  //
  //   image = {id: uid.type('Upload--'), data: file};
  //
  //   const url = file && URL.createObjectURL(file);
  //
  //   this.state = {
  //     file,
  //     url,
  //   };
  // }
  _onLoad = (e) => {
  };
  _onError = (e) => {
    this._change(undefined);
  };
  getValue(id){
    const {id: localId, data} = image;
    return id === localId ? data : null;
  }
  _onChange = () => {
    const file = this.refs.input.files[0];
    this._change(file);
  };
  onDrop = (files) => {
    this._change(files[0]);
  };
  _change = (file) => {
    this.setState({
      file,
    }, () => {
      const blob = this.state.file;
      if(blob && blob.size <= (this.props.maxSize * 1024 * 1024)){
        readBlob(blob).then(bytes => this.props.onChange(bytes));
      }else{
        this.props.onChange(undefined);
      }
    });
  };
  _delete = () => {
    this.setState({
      file: undefined,
    }, () => {
      this.props.onChange(undefined);
    });
  };
  getUploadError(intl){
    return (
      <div className="text-danger">
        {intl.formatMessage(messages['UploadError'])}
      </div>
    )
  }
  onOpenClick = () => {
    this.refs.dropZone.open();
  };
  render(){
    const {intl,} = this.context;
    const {file,} = this.state;
    return (
      <div styleName='ImageUpload attachmentsInfo'>

        <DropZone activeClassName={this.props.styles['dropZone-active']} style={{}} rejectClassName={this.props.styles['dropZone-reject']} ref={'dropZone'} onDrop={this.onDrop} accept={(this.props.accept || []).join(',')}>

          <div styleName={'fileList'}>

            <ImageLoader
              imgProps={{
                width: '100%',
                height: '100%',
                style: {borderRadius: 5,},
              }}
              onLoad={this._onLoad}
              onError={this._onError}
              src={file && file.preview}
              preloader={preloader(intl, this.props.styles, this.props.maxSize)}
              wrapper={React.DOM.div}>{this.getUploadError(intl)}
            </ImageLoader>

          </div>

        </DropZone>

        <div styleName='actionButtons'>

          {/* If there's already an image uploaded, show the 'Replace' btn, else show 'Upload' btn */}
          <button onClick={this.onOpenClick} tabIndex={'0'} className='upload-btn' styleName={'upload-button'} type='button'>
          {file
            ? intl.formatMessage(messages['Replace'])
            : intl.formatMessage(messages['Upload'])}
          </button>

          {/*<span styleName='fileContainer' onClick={this.onOpenClick}>
            <input
              onChange={this._onChange}
              ref={'input'}
              type='file'
              accept={(this.props.accept || []).join(',')}
              styleName='file '
              className={'ie-file'}/>
          </span>*/}

          {file && <i onClick={this._delete} tabIndex={'0'} className={'material-icons'} styleName='hi delete-btn' style={{}}>delete</i>}

        </div>

      </div>
    );
  }
}

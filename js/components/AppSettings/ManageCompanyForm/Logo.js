import React from 'react';
import ReactDOM from 'react-dom';
import AvatarCropper from '../../utils/cropper/component';

import CSSModules from 'react-css-modules';

import styles from './Logo.scss';

import stopEvent from '../../../utils/stopEvent';

var App = React.createClass({
  getInitialState: function () {
    return {
      cropperOpen: false,
      img: null,
      croppedImg: this.props.value ? this.props.value.url || this.props.value : null,
    };
  },
  handleFileChange: function (dataURI, metadata) {
    this.setState({
      img: dataURI,
      croppedImg: null, // this.state.croppedImg,
      cropperOpen: true,
      metadata,
    });
  },
  handleCrop: function (dataURI) {
    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: dataURI,
    }, () => {
      this.props.onChange({ ...this.state.metadata,  url: this.state.croppedImg, });
    });
  },
  _handleCrop: function (dataURI, metadata) {
    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: dataURI,
      metadata,
    }, () => {
      this.props.onChange({ ...this.state.metadata,  url: this.state.croppedImg, });
    });
  },
  handleRequestHide: function () {
    this.setState({
      cropperOpen: false
    });
  },

  _delete: function(){
    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: null
    }, () => {
      this.props.onChange(null);
    });
  },

  render () {
    // return (
    //   <div>
    //     <div styleName='avatar-photo'>
    //       <FileUpload handleFileChange={this.handleFileChange} />
    //       <div styleName='avatar-edit'>
    //         <span styleName={'help'}>Cliquer pour choisir l'image</span>
    //         <i className='material-icons '>photo_camera</i>
    //       </div>
    //       <img src={this.state.croppedImg} />
    //     </div>
    //     {this.state.cropperOpen &&
    //     <AvatarCropper
    //       onRequestHide={this.handleRequestHide}
    //       cropperOpen={this.state.cropperOpen}
    //       onCrop={this.handleCrop}
    //       image={this.state.img}
    //       width={400}
    //       height={400}
    //     />
    //     }
    //   </div>
    // );

    return (
      <div styleName='inlineBlock logoContainer'>

        <div styleName="tableCell" style={{ position: 'relative', }}>

          {/*<FileUpload handleFileChange={this.handleFileChange} />*/}
          <FileUpload handleFileChange={this._handleCrop} />

          <span styleName='logoPlaceHolder inlineBlock'>{this.state.croppedImg && <img height='150px' src={this.state.croppedImg}/>}</span>
          {/*<span styleName='logoPlaceHolder inlineBlock'>{this.state.croppedImg && <img width="128px" height='128px' src={this.state.croppedImg}/>}</span>*/}

          <div styleName='avatar-edit'>
            <i className='material-icons '>photo_camera</i>
          </div>

          {this.state.cropperOpen &&
          <AvatarCropper
            onRequestHide={this.handleRequestHide}
            cropperOpen={this.state.cropperOpen}
            onCrop={this.handleCrop}
            image={this.state.img}
            width={512}
            height={512}
          />
          }

        </div>

        {this.state.croppedImg && <div styleName="tableCell">
          <i onClick={this._delete} tabIndex={'0'} className={'material-icons'} styleName='hi delete-btn' style={{}}>delete</i>
        </div>}

      </div>
    );
  }
});

export default CSSModules(App, styles, {
  allowMultiple: true,
});

var FileUpload = React.createClass({

  // componentDidMount: function(){
  //   ReactDOM.findDOMNode(this.refs.in).addEventListener('change', this.handleFile, false);
  // },
  //
  // componentWillUnmount: function(){
  //   ReactDOM.findDOMNode(this.refs.in).remmoveEventListener('change', this.handleFile, false);
  // },

  handleFile: function (e) {
    var file = e.target.files[0];

    if (!file) {
      this.props.handleFileChange(null);
      return;
    }

    var reader = new FileReader();
    reader.onload = function (img) {
      ReactDOM.findDOMNode(this.refs.in).value = '';
      this.props.handleFileChange(img.target.result, {
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }.bind(this);
    reader.readAsDataURL(file);
  },

  render: function () {
    return (
      <input ref='in' type='file' accept='image/*' onChange={this.handleFile}/>
    );
  }
});

import React from 'react';
import ReactDom from 'react-dom';
import AvatarCropper from '../../utils/cropper/component';

import CSSModules from 'react-css-modules';

import styles from './item.scss';

var App = React.createClass({
  getInitialState: function() {
    return {
      cropperOpen: false,
      img: null,
      croppedImg: null
    };
  },
  handleFileChange: function(dataURI) {
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      cropperOpen: true
    });
  },
  handleCrop: function(dataURI) {
    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: dataURI
    });
  },
  handleRequestHide: function() {
    this.setState({
      cropperOpen: false
    });
  },
  render () {
    return (
      <div>
        <div styleName='avatar-photo'>
          <FileUpload handleFileChange={this.handleFileChange} />
          <div styleName='avatar-edit'>
            <span styleName={'help'}>Cliquer pour choisir l'image</span>
            <i className='material-icons '>photo_camera</i>
          </div>
          <img src={this.state.croppedImg} />
        </div>
        {this.state.cropperOpen &&
        <AvatarCropper
          onRequestHide={this.handleRequestHide}
          cropperOpen={this.state.cropperOpen}
          onCrop={this.handleCrop}
          image={this.state.img}
          width={400}
          height={400}
        />
        }
      </div>
    );
  }
});

export default CSSModules(App, styles, {
  allowMultiple: true,
});

var FileUpload = React.createClass({

  handleFile: function(e) {
    var file = e.target.files[0];

    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(img) {
      ReactDom.findDOMNode(this.refs.in).value = '';
      this.props.handleFileChange(img.target.result, {
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }.bind(this);
    reader.readAsDataURL(file);
  },

  render: function() {
    return (
      <input ref='in' type='file' accept='image/*' onChange={this.handleFile} />
    );
  }
});

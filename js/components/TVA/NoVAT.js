import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import { editStart, editStop, } from '../../redux/modules/vat';

import styles from './NoVAT.scss';

import VATForm from './TVAForm/TVAForm';

@CSSModules(styles, {allowMultiple: true})
export default class NoVAT extends React.Component{

  state = {
    modalOpen: false,
  };

  _close = () => {

    editStop('ConfigureVAT');

    this.setState({
      modalOpen: false,
    });
  };

   _onConfigureVAT = () => {

    editStart('ConfigureVAT');

    this.setState({
      modalOpen: true,
    })
  };

  _renderVATForm = () => {
    if(!this.state.modalOpen){
      return null;
    }

    return (
      <VATForm viewer={this.props.viewer} company={this.props.company} formKey={'ConfigureVAT'} onRest={this._close}/>
    ) ;
  };

  render(){
    return (
      <div styleName={'table'}>

        <div styleName={''}>


          <span styleName='text'>&nbsp;Utilisez-vous la TVA?&nbsp;</span>

          <a onClick={this._onConfigureVAT} styleName='setupVAT-link text'>Configurer la TVA</a>

        </div>

        {this._renderVATForm()}

      </div>
    );
  }
}

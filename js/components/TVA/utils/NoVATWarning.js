import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './Warning.scss';

@CSSModules(styles, {allowMultiple: true})
export default class Warning extends React.Component{
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  state = {
    hidden: function () {
      const hiddenVal = localStorage.getItem('VATSettings.warning.no-VAT.hidden');
      return hiddenVal === null ? false : hiddenVal;
    }(),
  };
  _onHide = () => {
    localStorage.setItem('VATSettings.warning.no-VAT.hidden', true);
    this.forceUpdate();
  };
  _onGoToVAT = () => {
    this.context.router.push({
      pathname: `/apps/${this.props.company.id}/vat`,
      state: {},
    });
  };
  render(){
    const { hidden, } = this.state;
    return hidden ? null : (
      <div>

        <div styleName='divContent'>

          <div styleName='showVATContainer'>

            <div styleName='ipd-VATFrance launchPluginView'>
              <div styleName='secondary-color-sprite message-icon'></div>

              <span styleName='text title'>TVA non activée&nbsp;:</span>

              <span styleName='text'>&nbsp;Si vous souhaitez appliquer la TVA à vos factures, vous devez préalablement la paramétrer.&nbsp;</span>

              <a onClick={this._onGoToVAT} styleName='setupVAT-link text'>Cliquez ici pour activer la TVA</a>

              <button onClick={this._onHide} styleName='close-sprite closeIcon floatRight'></button>
            </div>

          </div>

        </div>

      </div>
    )
  }
}

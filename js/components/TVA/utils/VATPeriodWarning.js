import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './Warning.scss';

@CSSModules(styles, {allowMultiple: true})
export default class Warning extends React.Component{
  render(){
    return (
      <div>

        <div styleName='divContent'>

          <div styleName='showVATContainer'>

            <div styleName='ipd-VATFrance launchPluginView' style={{ border: '1px solid #f0ad4e', }}>
              <div styleName='secondary-color-sprite message-icon' style={{ backgroundPosition: '0px -440px', }}></div>

              <span styleName='text title'>Avertissement&nbsp;:</span>

              <span styleName='text'>&nbsp;La période choisie est pas dans la période de déclaration de TVA en cours.&nbsp;</span>

            </div>

          </div>

        </div>

      </div>
    )
  }
}

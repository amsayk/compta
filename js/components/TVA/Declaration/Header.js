import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import moment from 'moment';

import CSSModules from 'react-css-modules';

import styles from './Declaration.scss';

import {
  intlShape,
} from 'react-intl';
import stopEvent from "../../../utils/stopEvent";

import HeaderActions from './HeaderActions';

const Title = (company) => company.displayName;

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{

  static displayName = 'TVAMainPageHeader';

  static propTypes = {
    bodyWidth: PropTypes.number.isRequired,
    topLoading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  _onBack = (e) => {
    stopEvent(e);

    this.context.router.push({
      pathname: `/apps/${this.props.company.id}/vat`,
      state: {},
    });
  };

  render(){
    const { declaration, company, viewer, topLoading: loading, styles, filterArgs, } = this.props;

    const {intl,} = this.context;

    return (
      <div styleName='top' style={{width: Math.max(this.props.bodyWidth - 165, 956),}}>

        <div styleName='toolbar'>

          <div styleName='title'>

            <div styleName='section' style={{ marginLeft: 14, }}>{loading || Title(company)}</div>

            <div styleName="top-stage">

              <a styleName="back-link inlineBlock" onClick={this._onBack} style={{ lineHeight: '35px', }}>

                {/*<div styleName="inlineBlock arrow-sprite backArrow"></div>*/}
                <i className="material-icons" style={{ verticalAlign: 'bottom', fontSize: '2.2rem', }}>chevron_left</i>

                Centre TVA

              </a>

            </div>

            {/*<div>
             <span styleName='subsection'>{intl.formatMessage(messages.Subtitle)}</span>
             <span styleName='details'></span>
             </div>*/}

          </div>

          <div styleName='declaration' style={{ textAlign: 'center', }}>

            <div>Résumé de la TVA</div>
            {loading || <div>{getPeriod(declaration)}, {getRegime(declaration)}</div>}

          </div>

          <div styleName='actions'>

            {loading || <HeaderActions
              topLoading={loading}
              declaration={declaration}
              company={company}
              viewer={viewer}
              styles={styles}
            />}

          </div>

        </div>

      </div>
    );
  }
}

function getPeriod(VATDeclaration) {
  const {
    settings: { frequency, },
    periodStart,
  } = VATDeclaration;

  const date = moment(periodStart);

  switch (frequency){
    case 'MONTHLY':

      return `Mois ${date.month() + 1} ${date.year()}`;

    case 'QUARTERLY':

      return `Trimestre ${date.quarter()} ${date.year()}`;
  }
}

function getRegime(VATDeclaration) {
  const {
    settings: { regime, },
    periodStart,
  } = VATDeclaration;

  switch (regime){
    case 1:
    case 'Standard':

      return `Regime d'encaissement`;

    case 2:
    case 'Debit':

      return `Regime de débit`;
  }
}

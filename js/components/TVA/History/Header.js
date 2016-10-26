import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import CSSModules from 'react-css-modules';

import styles from './History.scss';

import {
  intlShape,
} from 'react-intl';
import stopEvent from "../../../utils/stopEvent";

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
    const { topLoading: loading, filterArgs, } = this.props;

    const {intl,} = this.context;

    return (
      <div styleName='top' style={{width: Math.max(this.props.bodyWidth - 165, 956),}}>

        <div styleName='toolbar'>

          <div styleName='title'>

            <div styleName='section' style={{ marginLeft: 14, }}>{loading || Title(this.props.company)}</div>

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

          <div styleName='history'>
            Historique TVA
          </div>

          <div styleName='actions'>

          </div>

        </div>

      </div>
    );
  }
}

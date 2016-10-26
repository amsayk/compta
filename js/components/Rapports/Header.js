import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import CSSModules from 'react-css-modules';

import styles from './Rapports.scss';

import {
  intlShape,
} from 'react-intl';

import HeaderReports from './HeaderReports';

const Title = (company) => company.displayName;

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{

  static displayName = 'ReportsHeader';

  static propTypes = {
    bodyWidth: PropTypes.number.isRequired,
    topLoading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  render(){
    const { topLoading: loading, } = this.props;

    const {intl,} = this.context;

    return (
      <div styleName='top' style={{width: Math.max(this.props.bodyWidth - 165, 956),}}>

        <div styleName='toolbar'>

          <div styleName='title'>
            <div styleName='section'>{loading || Title(this.props.company)}</div>

            <div>
              <div style={{ display: 'inline-block', }} styleName='subsection'>{intl.formatMessage(messages.Subtitle)}</div>
              <div style={{ display: 'inline-block', lineHeight: '42px', }} styleName='details'>Compte de résultat</div>
            </div>

          </div>

          <div styleName='actions'>


          </div>

        </div>

        <div styleName='reports-bar'>

          <HeaderReports
            topLoading={loading}
            company={this.props.company}
            viewer={this.props.viewer}
            styles={this.props.styles}
          />

        </div>

      </div>
    );
  }
}

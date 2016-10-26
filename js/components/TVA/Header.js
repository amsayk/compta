import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import CSSModules from 'react-css-modules';

import styles from './TVA.scss';

import {
  intlShape,
} from 'react-intl';

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
  };

  render(){
    const { topLoading: loading, filterArgs, } = this.props;

    const {intl,} = this.context;

    return (
      <div styleName='top' style={{width: Math.max(this.props.bodyWidth - 165, 956),}}>

        <div styleName='toolbar'>

          <div styleName='title'>
            <div styleName='section'>{loading || Title(this.props.company)}</div>

            <div>
              <span styleName='subsection'>{intl.formatMessage(messages.Subtitle)}</span>
              <span styleName='details'></span>
            </div>

          </div>

          <div styleName='actions'>

          </div>

        </div>

      </div>
    );
  }
}

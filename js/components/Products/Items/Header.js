import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import CSSModules from 'react-css-modules';

import styles from './Items.scss';

import {
  intlShape,
} from 'react-intl';

import HeaderActions from './HeaderActions';

const Title = (company) => company.displayName;

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{

  static displayName = 'ProductsExpensesHeader';

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
      <div styleName='top' style={{width: Math.max(this.props.bodyWidth, 956),}}>

        <div styleName='toolbar'>

          <div styleName='title'>
            <div styleName='section'>{loading || Title(this.props.company)}</div>

            <div>
              <span styleName='subsection'>{intl.formatMessage(messages.Subtitle)}</span>
              <span styleName='details'></span>
            </div>

          </div>

          <div styleName='actions'>

            <HeaderActions
              topLoading={loading}
              company={this.props.company}
              viewer={this.props.viewer}
              styles={this.props.styles}
              filterArgs={filterArgs}
            />

          </div>

        </div>

      </div>
    );
  }
}

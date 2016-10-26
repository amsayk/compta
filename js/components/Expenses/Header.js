import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import CSSModules from 'react-css-modules';

import styles from './Expenses.scss';


import {
  intlShape,
} from 'react-intl';

import HeaderActions from './HeaderActions';

const Title = (company) => company.displayName;

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{

  static displayName = 'ExpensesHeader';

  static propTypes = {
    topLoading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  render(){
    const loading = this.props.topLoading;

    const {intl,} = this.context;

    return (
      <div styleName='top'>

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
              filterArgs={this.props.filterArgs}
              depositsAccounts={this.props.depositsAccounts}
              expensesAccounts={this.props.expensesAccounts}
              vendorOpenBills={this.props.vendorOpenBills}
              onPaymentVendorSelected={this.props.onPaymentVendorSelected}
              onReceivePayment={this.props.onReceivePayment}
              styles={this.props.styles}
            />

          </div>

        </div>

      </div>
    );
  }
}

import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import CSSModules from 'react-css-modules';

import styles from './Item.scss';

import {
  intlShape,
} from 'react-intl';

import HeaderActions from './HeaderActions';

import HeaderReports from './HeaderReports';

const Title = (company) => company.displayName;

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{

  static displayName = 'CustomerSalesHeader';

  static propTypes = {
    bodyWidth: PropTypes.any.isRequired,
    topLoading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  render(){
    const { customer, topLoading: loading, filterArgs, } = this.props;

    const {intl,} = this.context;

    return (
      <div styleName='top' style={{ width: this.props.bodyWidth, }}>

        <div styleName='toolbar'>

          <div styleName='title'>
            {/*<div styleName='section'>{loading || Title(this.props.company)}</div>*/}

            <div>
              <span styleName='subsection'>{loading || Title(this.props.customer)}</span>
              <span styleName='details'></span>
            </div>

          </div>

          <div styleName='actions'>

            <HeaderActions
              topLoading={loading}
              company={this.props.company}
              viewer={this.props.viewer}
              styles={this.props.styles}
              onPaymentCustomerSelected={this.props.onPaymentCustomerSelected}
              onReceivePayment={this.props.onReceivePayment}
              salesAccounts={this.props.salesAccounts}
              depositsAccounts={this.props.depositsAccounts}
              customerOpenInvoices={this.props.customerOpenInvoices}
              customer={customer}
              filterArgs={filterArgs}
            />

          </div>

        </div>

        <div styleName='reports-bar' style={{ height: 120, }}>

          <HeaderReports
            salesStatus={this.props.salesStatus}
            filterArgs={filterArgs}
            topLoading={loading}
            company={this.props.company}
            viewer={this.props.viewer}
            styles={this.props.styles}
            customer={customer}
          />

        </div>

      </div>
    );
  }
}

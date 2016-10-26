import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import CSSModules from 'react-css-modules';

import styles from './Items.scss';

import stopEvent from '../../../utils/stopEvent';

import {
  intlShape,
} from 'react-intl';

import HeaderActions from './HeaderActions';

import HeaderReports from './HeaderReports';

const Title = (company) => company.displayName;

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component{

  static displayName = 'CustomersSalesHeader';

  static propTypes = {
    bodyWidth: PropTypes.number.isRequired,
    topLoading: PropTypes.bool.isRequired,
    onTealChanged: PropTypes.func.isRequired,
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
              <span styleName='subsection'>{intl.formatMessage(messages.Subtitle)} {filterArgs.type !== 'ALL' ? <span styleName='clearAll'><a onClick={e => { stopEvent(e); this.props.onFilter({
                type: 'ALL',
                status: 'ALL',
                date: 1,
                from: undefined,
                to: undefined,
              }); }} styleName='clearCrumbs'>Annuler filtrage/Tout afficher</a></span> : null}</span>
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
              salesAccounts={this.props.salesAccounts}
              depositsAccounts={this.props.depositsAccounts}
              customerOpenInvoices={this.props.customerOpenInvoices}
              filterArgs={filterArgs}
            />

          </div>

        </div>

        <div styleName='reports-bar'>

          <HeaderReports
            salesStatus={this.props.salesStatus}
            filterArgs={filterArgs}
            onTealChanged={this.props.onTealChanged}
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

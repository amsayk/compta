import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './Income.scss';

import classnames from 'classnames';

import {
  intlShape,
} from 'react-intl';

import messages from '../messages';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

@CSSModules(styles, {allowMultiple: true})
export default class Income extends Component {
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render() {
    const {intl,} = this.context;
    const { styles, privateMode, loading, company, viewer, } = this.props;

    const isLoading = typeof this.__onReadyStateChange === 'undefined' ? loading : true;
    const {
      open : {
        totalCount: openCount,
        amount: openAmount,
      },
      overdue : {
        totalCount: overdueCount,
        amount: overdueAmount,
      },
      closed : {
        totalCount: closedCount,
        amount: closedAmount,
      },
    } = isLoading ? {
      open : {
        totalCount: 0,
        amount: 0.0,
      },
      overdue : {
        totalCount: 0,
        amount: 0.0,
      },
      closed : {
        totalCount: 0,
        amount: 0.0,
      },
    } : company.salesStatus;
    return (
      <div styleName={classnames('module income', {loading: isLoading})}>

        <div styleName='header'>
          <div styleName='title inlineBlock'>{intl.formatMessage(messages['IncomeTitle'])}</div>
          <div styleName='floatRight fancyText'>{intl.formatMessage(messages['LastXDays'], {days: 365})}</div>
          {/*<button styleName='ftuMessage' className='btn btn-link' role='button' tabIndex='0'>{intl.formatMessage(messages['EnterInvoice'])}</button>*/}
          <div styleName='clear'></div>
        </div>

        <div styleName='moduleContent'>

          <div styleName='subContainer incomeCategories'>

            <div styleName='chartContainer'>

              <div styleName='chart'>

                <div styleName='barsContainer'>

                  <div styleName='open invoiceBar'>

                    <div id='openInvoices' styleName='insightTooltipDiv'>

                      {/*<OverlayTrigger overlay={<Tooltip positionLeft={0} positionTop={0} placement={'top'}><span><div className={styles['moneySection']}>
                        <div styleName='fancyMoney'>{openCount}</div>
                        <div styleName='fancyText upperCase'>{intl.formatMessage(messages['x_open_invoices'], {invoices: openCount})}</div>
                      </div></span></Tooltip>}>*/}


                          <div styleName='insightTooltipInnerDiv openInvoicesTooltipDiv'
                          id='openInvoicesInner'></div>


                      {/*</OverlayTrigger>*/}

                    </div>

                    <div styleName='moneySection floatLeft'>
                      {privateMode ? <div styleName='fancyMoney'>{openCount}</div> : <div styleName='fancyMoney'>{intl.formatNumber(openAmount, {format: 'MAD'})}</div>}
                      <div styleName='fancyText upperCase'>{intl.formatMessage(messages['x_open_invoices'], {invoices: openCount})}</div>
                    </div>

                    <div styleName='overdue invoiceBar'>

                      <div styleName='insightTooltipDiv' id='overdueInvoices'>

                      {/*<OverlayTrigger overlay={<Tooltip positionLeft={0} positionTop={0} placement={'top'}><span><div className={styles['moneySection']}>
                        <div styleName='fancyMoney'>{overdueCount}</div>
                        <div styleName='fancyText upperCase'>{intl.formatMessage(messages['x_overdue'], {invoices: overdueCount})}</div>
                      </div></span></Tooltip>}>*/}

                        <div styleName='insightTooltipInnerDiv' id='overdueInvoicesInner'></div>

                        {/*</OverlayTrigger>*/}


                      </div>

                      <div styleName='moneySection floatLeft'>
                        {privateMode ? <div styleName='fancyMoney'>{overdueCount}</div> : <div styleName='fancyMoney'>{intl.formatNumber(overdueAmount, {format: 'MAD'})}</div>}
                        <div styleName='fancyText upperCase'>{intl.formatMessage(messages['x_overdue'], {invoices: overdueCount})}</div>
                      </div>

                    </div>

                  </div>

                  <div styleName='paid invoiceBar'>

                    <div styleName='insightTooltipDiv' id='paidInvoices'>

                    {/*<OverlayTrigger overlay={<Tooltip positionLeft={0} positionTop={0} placement={'top'}><span><div className={styles['moneySection']}>
                      <div styleName='fancyMoney'>{closedCount}</div>
                      <div styleName='fancyText upperCase'>{intl.formatMessage(messages['paid_last_x_days'], {invoices: closedCount, days: 30})}</div>
                    </div></span></Tooltip>}>*/}

                      <div styleName='insightTooltipInnerDiv' id='paidInvoicesInner'></div>

                      {/*</OverlayTrigger>*/}

                    </div>

                    <div styleName='moneySection floatLeft'>
                      {privateMode ? <div styleName='fancyMoney'>{closedCount}</div> : <div styleName='fancyMoney'>{intl.formatNumber(closedAmount, {format: 'MAD'})}</div>}
                      <div styleName='fancyText upperCase'>{intl.formatMessage(messages['paid_last_x_days'], { invoices: closedCount, days: 30, })}</div>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}

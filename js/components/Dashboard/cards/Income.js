import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './Income.scss';

import classnames from 'classnames';

import {
  intlShape,
} from 'react-intl';

import messages from '../messages';

// import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
// import Tooltip from 'react-bootstrap/lib/Tooltip';

import Tooltip from 'react-tooltip';
import stopEvent from "../../../utils/stopEvent";

@CSSModules(styles, {allowMultiple: true})
export default class Income extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    router: PropTypes.object.isRequired,
  };

  go = (to) => {
    const { company, } = this.props;
    const { router, } = this.context;

    switch (to){
      case 'open':

        localStorage.setItem('sales.type', 'invoices');
        localStorage.setItem('sales.status', 'open');
        localStorage.setItem('sales.date', 1);

        router.push({
          pathname: `/apps/${company.id}/sales`,
          state: {},
        });
        break;

      case 'overdue':

        localStorage.setItem('sales.type', 'invoices');
        localStorage.setItem('sales.status', 'overdue');
        localStorage.setItem('sales.date', 12);

        router.push({
          pathname: `/apps/${company.id}/sales`,
          state: {},
        });
        break;

      case 'closed':

        localStorage.setItem('sales.type', 'recent');
        localStorage.setItem('sales.status', 'closed');
        localStorage.setItem('sales.date', 1);

        router.push({
          pathname: `/apps/${company.id}/sales`,
          state: {},
        });
        break;
    }
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

                    <a onClick={e => { stopEvent(e); this.go('open') }} data-for='open' data-tip={`<p style="text-align:left;margin: 20px auto;"><div class="${styles['fancyMoney']}" style="color:#fff;">${openCount}</div><div class="${styles['fancyText']}">${intl.formatMessage(messages['x_open_invoices'], {invoices: openCount})}</div></p>`}>

                      <div id='openInvoices' styleName='insightTooltipDiv'>

                        <div styleName='insightTooltipInnerDiv openInvoicesTooltipDiv'
                        id='openInvoicesInner'></div>

                      </div>


                    </a>

                    {loading || <Tooltip id='open' place={'top'} html={true} type={'dark'} effect={'float'}/>}
                    {loading || <Tooltip id='overdue' place={'top'} html={true} type={'dark'} effect={'float'}/>}
                    {loading || <Tooltip id='paid' place={'top'} html={true} type={'dark'} effect={'float'}/>}


                    <div styleName='moneySection floatLeft'>
                      {privateMode ? <div styleName='fancyMoney'>{openCount}</div> : <div styleName='fancyMoney'>{intl.formatNumber(openAmount, {format: 'MAD'})}</div>}
                      <div styleName='fancyText upperCase'>{intl.formatMessage(messages['x_open_invoices'], {invoices: openCount})}</div>
                    </div>


                    <div styleName='overdue invoiceBar'>

                      <a onClick={e => { stopEvent(e); this.go('overdue') }} data-for='overdue' data-tip={`<p style="width:200px;text-align:left;margin: 20px auto;"><div class="${styles['fancyMoney']}" style="color:#fff;">${overdueCount}</div><div class="${styles['fancyText']}">${intl.formatMessage(messages['x_overdue'], {invoices: overdueCount})}</div></p>`}>

                        <div styleName='insightTooltipDiv' id='overdueInvoices'>

                          <div styleName='insightTooltipInnerDiv' id='overdueInvoicesInner'></div>

                        </div>
                      </a>

                      <div styleName='moneySection floatLeft'>
                        {privateMode ? <div styleName='fancyMoney'>{overdueCount}</div> : <div styleName='fancyMoney'>{intl.formatNumber(overdueAmount, {format: 'MAD'})}</div>}
                        <div styleName='fancyText upperCase'>{intl.formatMessage(messages['x_overdue'], {invoices: overdueCount})}</div>
                      </div>

                    </div>

                  </div>

                  <div styleName='paid invoiceBar' onClick={e => { stopEvent(e); this.go('closed') }}>

                    <a data-for='paid' data-tip={`<p style="text-align:left;margin: 20px auto;"><div class="${styles['fancyMoney']}" style="color:#fff;">${closedCount}</div><div class="${styles['fancyText']}">${intl.formatMessage(messages['paid_last_x_days'], {invoices: closedCount, days: 30, })}</div></p>`}>

                      <div styleName='insightTooltipDiv' id='paidInvoices'>

                        <div styleName='insightTooltipInnerDiv' id='paidInvoicesInner'></div>
                      </div>

                    </a>

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

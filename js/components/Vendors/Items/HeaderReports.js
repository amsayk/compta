import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../../utils/stopEvent';

import {
  intlShape,
} from 'react-intl';

export default class extends React.Component{
  static displayName = 'VendorsExpensesHeaderReports';

  static propTypes = {
    topLoading: PropTypes.bool.isRequired,
    onTealChanged: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  constructor(props, context){
    super(props, context);

    const {
      type,
      status,
    } = this.props.filterArgs;

    this.state = {
      selected: {
        unpaid: type === 'bills' && status === 'open',
        paid: (type === 'bills' && status === 'closed') || type === 'recent',
        overdue: type === 'bills' && status === 'overdue',
      },
      over: undefined,
      topLoading: this.props.topLoading,
    };
  }

  componentWillReceiveProps(nextProps){
    const {
      type,
      status,
    } = nextProps.filterArgs;

    this.setState({
      selected: {
        unpaid: type === 'bills' && status === 'open',
        paid: (type === 'bills' && status === 'closed') || type === 'recent',
        overdue: type === 'bills' && status === 'overdue',
      },
      over: undefined,
      topLoading: nextProps.topLoading,
    });
  }

  onMouseOver(key, e) {
    stopEvent(e);

    if (this.state.over !== key) {
      this.setState({
        over: key,
      });
    }
  }

  onMouseOut(key, e) {
    stopEvent(e);

    if (this.state.over === key) {
      this.setState({
        over: undefined,
      });
    }
  }

  _onReadyStateChange = ({ done, }) => {
    this._readyStateDone = done;
  };

  shouldComponentUpdate(){
    if(typeof this._readyStateDone !== 'undefined'){
      return this._readyStateDone;
    }

    return true;
  }

_onTealClicked = (key, e) => {
    stopEvent(e);

    this.setState({
      selected: {
        ...Object.keys(this.state.selected).reduce((obj, key) => ({ ...obj, [key]: false, }), {}),
        [key]: !this.state.selected[key]
      },
    }, () => {
      this.props.onTealChanged(this.state.selected, this._onReadyStateChange);
    });
  };

  isSelected(key){
    return this.state.selected[key] === true;
  }

  isOver(key){
    return this.state.over === key;
  }

  render(){
    const {intl,} = this.context;
    const {styles} = this.props;
    const topLoading = this.props.topLoading;
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
    } = topLoading ? {
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
    } : this.props.expensesStatus;
    return (
      <div className={styles['stage-content']}>

        <div className={`${styles['table']} ${styles['moneyBar']}`}>

          <div className={styles['tableRow']}>

            <div className={`${styles['tableCell']} unpaid_tab`}>

              <div className={`${styles['bucket']} unpaid_tab`}>

                <div className={styles['header']}>{intl.formatMessage(messages['unpaid_last_x_days'], {days: 365})}</div>

                <div className={styles['table']}>
                  <div className={styles['tableRow']}>
                    <div className={styles['tableCell']}>
                      <div className={`${styles['box']} ${this.state.over === 'unpaid' ? styles['hover'] : ''} ${this.state.selected['unpaid'] ? styles['selected'] : ''} ${styles['unpaid']}`} onMouseOver={this.onMouseOver.bind(this, 'unpaid')} onMouseOut={this.onMouseOut.bind(this, 'unpaid')} onClick={this._onTealClicked.bind(this, 'unpaid')}>
                        <div className={styles['subbox']}>
                          <span className={styles['amount']}>{intl.formatNumber(openAmount, {format: 'MAD'})}</span>&nbsp;
                          <div>
                            <span>{openCount}&nbsp;</span>
                            <span>{intl.formatMessage(messages['x_open_bills'], {bills: openCount})}</span>
                          </div>
                        </div>

                        <div className={styles['subStatuses']}>
                          <div className={`${styles['box']} ${this.state.over === 'overdue' ? styles['hover'] : ''} ${this.state.selected['overdue'] ? styles['selected'] : ''} ${styles['overdue']}`} onMouseOver={this.onMouseOver.bind(this, 'overdue')} onMouseOut={this.onMouseOut.bind(this, 'overdue')} onClick={this._onTealClicked.bind(this, 'overdue')}>
                            <div className={styles['subbox']}>
                              <span className={styles['amount']}>{intl.formatNumber(overdueAmount, {format: 'MAD'})}</span>&nbsp;
                              <div>
                                <span>{overdueCount}&nbsp;</span>
                                <span>{intl.formatMessage(messages['x_overdue'], {bills: overdueCount})}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <div className={`${styles['tableCell']} paid_tab`}>
              <div className={`${styles['bucket']} paid_tab`}>
                <div className={styles['header']}>{intl.formatMessage(messages['bill_status_Paid'])}</div>
                <div className={styles['table']}>
                  <div className={styles['tableRow']}>
                    <div className={styles['tableCell']}>
                      <div className={`${styles['box']} ${this.state.over === 'paid' ? styles['hover'] : ''} ${this.state.selected['paid'] ? styles['selected'] : ''} ${styles['paid']}`} onMouseOver={this.onMouseOver.bind(this, 'paid')} onMouseOut={this.onMouseOut.bind(this, 'paid')} onClick={this._onTealClicked.bind(this, 'paid')}>
                        <div className={styles['subbox']}>
                          <span className={styles['amount']}>{intl.formatNumber(closedAmount, {format: 'MAD'})}</span>&nbsp;
                          <div>
                            <span>{closedCount}&nbsp;</span>
                            <span>{intl.formatMessage(messages['paid_last_x_days'], {days: 30})}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    )
  }
}

import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../../utils/stopEvent';

import {
  intlShape,
} from 'react-intl';

import NotesEditor from './NotesEditor';

import CSSModules from 'react-css-modules';

import styles from './Item.scss';

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'VendorsExpensesHeaderReports';

  static propTypes = {
    topLoading: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      topLoading: this.props.topLoading,
    };
  }

  componentWillReceiveProps(nextProps){
    if(this.state.topLoading !== nextProps.topLoading){
      this.setState({
        topLoading: nextProps.topLoading,
      });
    }
  }

  onMouseOver(key, e) {
    stopEvent(e);

    if (this.state.over !== key) {
      this.setState({
        over: key,
      });
    }
  }

  render(){
    const {intl,} = this.context;
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

    } = topLoading ? {
      open : {
        totalCount: 0,
        amount: 0.0,
      },
      overdue : {
        totalCount: 0,
        amount: 0.0,
      },

    } : this.props.expensesStatus;
    return (
      <div className={'stage-content'}>

        <div styleName='stage__insights notes floatLeft'>

          {topLoading || <NotesEditor viewer={this.props.viewer} company={this.props.company} payee={this.props.payee}/>}

        </div>

        <div styleName='stage__insights floatRight' style={{ marginRight: 50, }}>

          <div styleName='padding-bottom-20px'>
            <div styleName='stage__insight--open padding-left-10px'>
              <div styleName='insights__amount-text'>{intl.formatNumber(openAmount, { format: 'MAD', })}</div>
              <div styleName='insights__label-text'>EN COURS</div>
            </div>
          </div>

          <div styleName='padding-bottom-20px'>
            <div styleName='stage__insight--overdue padding-left-10px'>
              <div styleName='insights__amount-text'>{intl.formatNumber(overdueAmount, { format: 'MAD', })}</div>
              <div styleName='insights__label-text'>EN RETARD</div>
            </div>
          </div>

        </div>

      </div>
    )
  }
}

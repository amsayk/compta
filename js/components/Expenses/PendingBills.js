import React, {Component, PropTypes} from 'react';

import stopEvent from '../../utils/stopEvent';

import moment from 'moment';

import styles from './PendingBills.scss';

import CSSModules from 'react-css-modules';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

function alwaysTrue(){ return true; }

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'PendingBills';
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  render(){
    const {intl,} = this.context;
    const { vendorOpenBills, bodyHeight, addOnlyIf = alwaysTrue, } = this.props;
    return (
      <div styleName='openBills scroller flex-fixed' style={{ height: bodyHeight, }}>

        <div className={''} styleName='drawerContent'>

          <div styleName='drawerHeader'>
            <div styleName='drawerTitle'>Ajouter à&nbsp;: Achat comptant</div>
            <div styleName='drawerSubTitle' style={{ display: 'none', }}></div>
          </div>

          <button onClick={e => { stopEvent(e); this._onAddAll(); }} type='button' styleName='button addAll'>Ajouter tout</button>

          <div styleName='dgrid'>

            <div styleName='dgrid-scroller'>

                <div className={'ui-widget-content'} styleName='dgrid-content '>

                  {vendorOpenBills.edges.filter(addOnlyIf).map(({ node: bill, }) => {
                    return (
                      <Row onOpen={this._onOpen.bind(this, bill)} onAdd={this._onAdd.bind(this, bill)} bill={bill}/>
                    );
                  })}

                </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  _onOpen = (bill) => {
    this.props.onOpen(bill);
  };
  _onAdd = (bill) => {
    this.props.onAdd([bill]);
  };

  _onAddAll = () => {
    const { onAdd, vendorOpenBills, addOnlyIf = alwaysTrue,  } = this.props;
    const bills = vendorOpenBills.edges
      .filter(addOnlyIf)
      .map(({node}) => node);
    onAdd(
      bills);
  };
}

@CSSModules(styles, {allowMultiple: true})
class Row extends Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  render(){
    const {intl,} = this.context;
    const { onAdd, onOpen, bill : { date, dueDate, itemsConnection, paymentsConnection,  } } = this.props;
    const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;
    const status = calcBillStatus({ dueDate, balanceDue, });
    return (
      <div className={'dgrid-row-even ui-state-default'} styleName=' dgrid-row'>

        <div styleName='headerLabel'>Facture fournisseur </div>

        <div styleName='table width100Percent'>
          <div styleName='tableRow'>
            <div styleName='tableCell'>
              <div styleName='dateLabel'>{moment(date).format('ll')}</div>
            </div>
            <div className={'openSection clickable'} styleName='  tableCell'>
            </div>
          </div>
        </div>

        <div styleName='amountLabel'>{intl.formatNumber(balanceDue, { format: 'MAD', })}</div>

        <div className={'clickable'} styleName='itemFooter  table width100Percent'>
          <div styleName='tableRow'>

            <div styleName='tableCell addSection bold'>
              <a onClick={e => { stopEvent(e); onAdd(); }} className={'text'} styleName=''>
                <div styleName='addIcon secondary-color-sprite inlineBlock'></div>
                Ajouter
              </a>
            </div>

            <div className={'openSection'} styleName='tableCell'>
              <a  onClick={e => { stopEvent(e); onOpen(); }} className={'text'} styleName={`field-status ${status.toLowerCase()}`}>
                {intl.formatMessage(messages[`BillStatus${status}`])}
              </a>
            </div>

          </div>
        </div>

      </div>
    );
  }
}

// En cours

function calcBillStatus({ dueDate, balanceDue, }) {
  const _dueDate = moment(dueDate);
  const now = moment();

  const isPaidInFull = balanceDue === 0.0;

  if(isPaidInFull){
    return 'Closed';
  }

  if(_dueDate.isBefore(now)){
    return 'Overdue';
  }

  return 'Open';
}

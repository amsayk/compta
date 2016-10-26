import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import classnames from 'classnames';

import stopEvent from '../../utils/stopEvent';

import {Table, Column, Cell,} from '../../../fixed-data-table';

import {
  intlShape,
} from 'react-intl';

import requiredPropType from 'react-prop-types/lib/all';

import { Modes as SelectionModes, } from '../../redux/modules/selection';

export default class SalesTotals extends React.Component{

  static displayName = 'SalesTotals';

  static propTypes = {
    page: PropTypes.number.isRequired,
    company: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.topLoading === false && !props.company) {
          return new Error('company required!');
        }
      }
    ),
    bodyWidth: PropTypes.number.isRequired,
    styles: PropTypes.object.isRequired,
    selection: PropTypes.objectOf(PropTypes.shape({
      mode: PropTypes.oneOf(Object.keys(SelectionModes).map(key => SelectionModes[key])).isRequired,
      keys: PropTypes.objectOf(
        PropTypes.bool.isRequired
      ).isRequired,
    })).isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){

  }

  _renderMoneyOnly(VATEnabled){ // Sales + Payments
    const self = this;

    const { styles, company, page, selection, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const rowsCount = 1;
    const tableHeight = 0 + (rowsCount * 30) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 165 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 165 - 60, 956);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    const isSelected = (key) => sel.mode === SelectionModes.All || sel.keys[key];

    // let _totalTTC = undefined;
    // const totalTTC = () => {
    //
    //   if(_totalTTC === undefined){
    //     _totalTTC = calcSumOfTotals();
    //   }
    //
    //   return _totalTTC;
    // };
    //
    // let _totalHT = undefined;
    // const totalHT = () => {
    //   if(_totalHT === undefined){
    //     _totalHT = calcSumOfTotals__HT();
    //   }
    //
    //   return _totalHT;
    // };
    //
    // let _totalVAT = undefined;
    // const totalVAT = () => {
    //   if(_totalTTC === undefined){
    //     _totalTTC = calcSumOfTotals();
    //   }
    //
    //   if(_totalHT === undefined){
    //     _totalHT = calcSumOfTotals__HT();
    //   }
    //
    //   return _totalTTC - _totalHT;
    // };

    const calcSumOfBalances = () => {
      const resl = sel.mode === SelectionModes.None
        ? company.sales.paymentsSumOfCredits + company.sales.invoicesSumOfBalances
        : company.sales.edges.reduce((result, {node : { id, __opType : type, invoiceItemsConnection, discountType, discountValue, invoicePaymentsConnection, amountReceived, paymentItemsConnection, }}) => {

          switch(type){
            case 'Invoice':

              return result + (isSelected(id)
                ? getTotal(invoiceItemsConnection, { discountType, discountValue, })  - invoicePaymentsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0)
                : 0.0);

            case 'PaymentOfInvoices':

              return result + (isSelected(id)
                ?  amountReceived - paymentItemsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0)
                : 0.0);

            default: return result;
          }

          // return result + ((type === 'PaymentOfInvoices' || type === 'Invoice') && isSelected(id)
          //   ? amountReceived - itemsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0)
          //   : 0.0);
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MONEY', });
    };
    const calcSumOfTotals = () => {
      // const paymentsResl = sel.mode === SelectionModes.None
      //   ? company.sales.paymentsSumOfTotals
      //   : company.sales.edges.reduce((result, {node : { id, __opType : type, amountReceived, }}) => {
      //     return result + (type === 'PaymentOfInvoices' && isSelected(id)
      //       ? amountReceived
      //       : 0.0);
      //   }, 0.0);
      // const salesResl = sel.mode === SelectionModes.None
      //   ? company.sales.salesSumOfTotals
      //   : company.sales.edges.reduce((result, {node : { id, __opType : type, itemsConnection, discountType, discountValue, }}) => {
      //     return result + (type === 'Sale' && isSelected(id)
      //       ? getTotal(itemsConnection, { discountType, discountValue, })
      //       : 0.0);
      //   }, 0.0);
      //
      // return intl.formatNumber(salesResl + paymentsResl, { format: 'MONEY', });

      const res = sel.mode === SelectionModes.None
        ? company.sales.invoicesSumOfTotals + company.sales.salesSumOfTotals + company.sales.paymentsSumOfTotals
        : company.sales.edges.reduce((result, {node : { id, __opType : type, invoiceItemsConnection, saleItemsConnection, discountType, discountValue, amountReceived, }}) => {

          switch(type){
            case 'Sale':

              return result + (isSelected(id)
                ? getTotal(saleItemsConnection, { discountType, discountValue, })
                : 0.0);

            case 'Invoice':

              return result + (isSelected(id)
                ? getTotal(invoiceItemsConnection, { discountType, discountValue, })
                : 0.0);

            case 'PaymentOfInvoices':

              return result + (isSelected(id)
                ?  amountReceived
                : 0.0);

            default: return result;
          }

          // return result + (type === 'Sale' && isSelected(id)
          //   ? getTotal(itemsConnection, { discountType, discountValue, })
          //   : 0.0);
        }, 0.0);

        return intl.formatNumber(res, { format: 'MONEY', });
    };
    // const calcSumOfTotals__HT = () => {
    //   const res = sel.mode === SelectionModes.None
    //     ? company.sales.invoicesSumOfTotals + company.sales.salesSumOfTotals + company.sales.paymentsSumOfTotals
    //     : company.sales.edges.reduce((result, {node : { id, __opType : type, invoiceItemsConnection, saleItemsConnection, discountType, discountValue, amountReceived, }}) => {
    //
    //       switch(type){
    //         case 'Sale':
    //
    //           return result + (isSelected(id)
    //             ? getTotal(saleItemsConnection, { discountType, discountValue, })
    //             : 0.0);
    //
    //         case 'Invoice':
    //
    //           return result + (isSelected(id)
    //             ? getTotal(invoiceItemsConnection, { discountType, discountValue, })
    //             : 0.0);
    //
    //         case 'PaymentOfInvoices':
    //
    //           return result + (isSelected(id)
    //             ?  amountReceived
    //             : 0.0);
    //
    //         default: return result;
    //       }
    //
    //       // return result + (type === 'Sale' && isSelected(id)
    //       //   ? getTotal(itemsConnection, { discountType, discountValue, })
    //       //   : 0.0);
    //     }, 0.0);
    //
    //     return intl.formatNumber(res, { format: 'MONEY', });
    // };

    return (
      isEmpty ? null : <div className={classnames({[styles['sales-totals-table-wrapper'] || '']: true, [styles['table']]: true, })}>

        <div style={{}}>

          <Table
            renderRow={(Component, rowIndex, {style, className}) => {
              return (
               <div>
                  <Component
                    style={{...style, zIndex: 0}}
                    className={`${className} ${styles['table-row-container'] || ''}`}/>
                </div>
              );
            }}
            rowClassNameGetter={(rowIndex) => {
              return classnames(` table-row`);
            }}
            rowHeight={30}
            rowsCount={rowsCount}
            height={tableHeight}
            width={tableWidth}
            headerHeight={0}>

            {/* selected */}
            <Column
              columnKey={'selection'}
              align={'center'}
              header={null}
              cell={({rowIndex, ...props}) => {
                return (
                 <Cell {...props}>
                   <div></div>
                 </Cell>
               );
              }}
              width={40}
            />

            {/* date */}
            <Column
              columnKey={'date'}
              align={'center'}
              header={null}

              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={90}
            />

            {/* type */}
            <Column
              columnKey={'type'}
              align={'left'}
              header={null}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />

            {/* No */}
            <Column
              columnKey={'refNo'}
              align={'center'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={70}
            />

            {/* Totals label */}
            <Column
              columnKey={'totals'}
              align={'left'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{intl.formatMessage(messages['Totals_Label'])}({sel.mode === SelectionModes.None ? intl.formatMessage(messages['Totals_All'])  : intl.formatMessage(messages['Totals_Selected'])})</div>
             </Cell>
           )}
              width={100}
              flexGrow={1}
            />

            {/* Bal */}
            <Column
              columnKey={'balanceDue'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{calcSumOfBalances()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* totalHT */}
            {VATEnabled && <Column
              columnKey={'totalHT'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* VAT */}
            {VATEnabled && <Column
              columnKey={'VAT'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* Total */}
            <Column
              columnKey={'total'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{calcSumOfTotals()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* LATEST PAYMENT */}
            <Column
              columnKey={'latestPayment'}
              align={'left'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={90}
              // flexGrow={1}
            />

            {/* Status */}
            <Column
              columnKey={'status'}
              align={'left'}
              header={null}
              cell={({rowIndex, ...props}) => {
                return (
                 <Cell {...props}>
                  <div className={``}>
                  </div>
                 </Cell>
               )
              }}
              width={85}
            />

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
              <div>
              </div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

          </Table>

        </div>

      </div>
    );
  }

  _renderInvoicesOnly(VATEnabled){
    const self = this;
    const { styles, company, page, selection, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const rowsCount = 1;
    const tableHeight = 0 + (rowsCount * 30) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 165 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 165 - 60, 956);
    const tableWidth = bodyWidth - 1;

    const isEmpty = rowsCount === 0;

    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    const isSelected = (key) => sel.mode === SelectionModes.All || sel.keys[key];

    const calcSumOfBalances = () => {
      const resl = sel.mode === SelectionModes.None
        ? company.sales.invoicesSumOfBalances
        : company.sales.edges.reduce((result, {node : { id, __opType : type, invoiceItemsConnection : itemsConnection, invoicePaymentsConnection : paymentsConnection, discountType, discountValue, }}) => {
          return result + (type === 'Invoice' && isSelected(id)
            ? (getTotal(itemsConnection, { discountType, discountValue, }) - paymentsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0))
            : 0.0)
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MONEY', });
    };
    const calcSumOfTotals = () => {
      const resl = sel.mode === SelectionModes.None
        ? company.sales.invoicesSumOfTotals
        : company.sales.edges.reduce((result, {node : { id, __opType : type, invoiceItemsConnection : itemsConnection, discountType, discountValue, }}) => {
          return result + (type === 'Invoice' && isSelected(id)
            ? getTotal(itemsConnection, { discountType, discountValue, })
            : 0.0)
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MONEY', });
    };

    return (
      isEmpty ? null : <div className={classnames({ [styles['sales-totals-table-wrapper'] || '']: true, [styles['table']]: true, })}>

        <div style={{}}>

          <Table
            renderRow={(Component, rowIndex, {style, className}) => {
              return (
               <div>
                  <Component
                    style={{...style, zIndex: 0}}
                    className={`${className} ${styles['table-row-container'] || ''}`}/>
                </div>
              );
            }}
            rowClassNameGetter={(rowIndex) => {
              return classnames(` table-row`);
            }}
            rowHeight={30}
            rowsCount={rowsCount}
            height={tableHeight}
            width={tableWidth}
            headerHeight={0}>

            {/* selected */}
            <Column
              columnKey={'selection'}
              align={'center'}
              header={null}
              cell={({rowIndex, ...props}) => {
                return (
                 <Cell {...props}>
                   <div></div>
                 </Cell>
               );
              }}
              width={40}
            />

            {/* date */}
            <Column
              columnKey={'date'}
              align={'center'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={90}
            />

            {/* No */}
            <Column
              columnKey={'refNo'}
              align={'center'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={70}
            />

            {/* Totals label */}
            <Column
              columnKey={'totals'}
              align={'left'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{intl.formatMessage(messages['Totals_Label'])}({sel.mode === SelectionModes.None ? intl.formatMessage(messages['Totals_All'])  : intl.formatMessage(messages['Totals_Selected'])})</div>
             </Cell>
           )}
              width={100}
              flexGrow={1}
            />

            {/* dueDate */}
            <Column
              columnKey={'dueDate'}
              align={'left'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Age */}
            <Column
              columnKey={'age'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Bal */}
            <Column
              columnKey={'balanceDue'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{calcSumOfBalances()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* totalHT */}
            {VATEnabled && <Column
              columnKey={'totalHT'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* VAT */}
            {VATEnabled && <Column
              columnKey={'VAT'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />}

            {/* Total */}
            <Column
              columnKey={'total'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{calcSumOfTotals()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

            {/* Status */}
            <Column
              columnKey={'status'}
              align={'left'}
              header={null}
              cell={({rowIndex, ...props}) => {
                return (
                 <Cell {...props}>
                  <div>
                  </div>
                 </Cell>
               )
              }}
              width={85}
            />

            {/* Actions */}
            <Column
              columnKey={'actions'}
              align={'right'}
              header={null}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
              <div style={{zIndex: 2}} className={'row-actions'}>
              </div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />

          </Table>

        </div>

      </div>
    );
  }

  render(){
    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    const VATEnabled = this.props.topLoading ? false : this.props.company.VATSettings.enabled;

    const isOnlyPayments =  type === 'recent' || type === 'money' || type === 'payments' || type === 'sales';
    if(isOnlyPayments){
      return this._renderMoneyOnly(VATEnabled);
    }

    const isOnlyInvoices = type === 'invoices';
    if(isOnlyInvoices){
      return this._renderInvoicesOnly(VATEnabled);
    }

    return null;
  }

}

// function getTotal(itemsConnection, { discountType, discountValue, }){
//   const completedLines = itemsConnection.edges;
//
//   const subtotal = completedLines
//     .reduce((sum, { node: { qty, rate, }, }) => sum + (qty * rate), 0.0);
//   const totalDiscount = getTotalDiscount(subtotal, { type: discountType, value: discountValue, });
//   const taxableSubtotal = completedLines
//     .reduce((sum, { node: { qty, rate, discountPart : itemDiscountPart, }, }) => {
//       const amount = qty * rate;
//       const itemDiscount = itemGetDiscount(amount, itemDiscountPart);
//       const amountPercentage = (amount * 100 / subtotal);
//       const discountPart = amountPercentage / 100 * totalDiscount;
//       return sum + (amount - discountPart) - itemDiscount;
//     }, 0.0);
//
//   const total = subtotal - totalDiscount;
//
//   const taxAmount = 0; // getTaxAmount(taxableSubtotal, {});
//   return total + taxAmount;
// }

function getTotal(itemsConnection, { discountType, discountValue, }){
  const completedLines = itemsConnection.edges;

  const subtotalHT = completedLines
    .reduce((sum, { node: { qty, rate, VATPart : itemVATPart, }, }) => sum + itemGetAmount__HT(qty * rate, itemVATPart), 0.0);

  const itemsTotalDiscount = completedLines
    .reduce((sum, { node: { qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart, }, }) => {

      const entryValue = qty * rate;

      const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

      const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

      return sum + itemDiscount;
    }, 0.0);

  const totalDiscount = getTotalDiscount(subtotalHT - itemsTotalDiscount, { type: discountType, value: discountValue, });

  const totalHT = subtotalHT - totalDiscount - itemsTotalDiscount;

  const totalTaxAmount = completedLines
    .reduce((sum, { node: { qty, rate, discountPart : itemDiscountPart, VATPart : itemVATPart, }, }) => {

      const entryValue = qty * rate;

      const amountHT__BeforeDiscount = itemGetAmount__HT(entryValue, itemVATPart);

      const itemTotalDiscount = itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart);

      const amountHT = amountHT__BeforeDiscount - itemTotalDiscount;

      function itemGetTotalDiscountPart(amountHT__BeforeDiscount, itemDiscountPart) {
        const itemDiscount = itemGetDiscount(amountHT__BeforeDiscount, itemDiscountPart);

        const amountPercentage = (amountHT__BeforeDiscount * 100 / subtotalHT);

        const discountPart = amountPercentage / 100 * totalDiscount;

        return itemDiscount + discountPart;
      }

      const taxableAmount = amountHT; // - itemTotalDiscount;

      return sum + itemGeVATPart__Amount(taxableAmount, itemVATPart);
    }, 0.0);

  return totalHT + totalTaxAmount;
}

function itemGetDiscount(total, {type, value}){
  switch (type) {
    case 'Value':    return value || 0.0;
    case 1:          return value || 0.0;

    case 'Percent':  return total * ((value||0.0)/100);
    case 2:          return total * ((value||0.0)/100);
  }
}
function getTotalDiscount(subtotal, {type, value}){
  switch (type) {
    case 'Value':    return value || 0.0;
    case 1:          return value || 0.0;

    case 'Percent':  return subtotal * ((value||0.0)/100);
    case 2:          return subtotal * ((value||0.0)/100);
  }
}

const VAT_ID_TO_VALUE = {
  Value_20: 0.20,
  Value_14: 0.14,
  Value_10: 0.1,
  Value_Exempt: 0.0,
  Value_7: 0.07,

  1: 0.20,
  2: 0.14,
  3: 0.1,
  4: 0.0,
  5: 0.07,
};

const VAT_NAME_TO_ID = {
  Value_20: 1,
  Value_14: 2,
  Value_10: 3,
  Value_Exempt: 4,
  Value_7: 5,
};

function itemGeVATPart__Amount(taxableAmount /* ALWAYS HT */, itemVATPart) {

  if(itemVATPart){
    const { inputType, value = 'Value_Exempt', } = itemVATPart;

    // taxableAmount is HT: VAT = %VAT * taxableAmountHT
    return function () {
      const VAT_percentage = value ? VAT_ID_TO_VALUE[value] : 0.0;

      const taxableAmountHT = taxableAmount;

      const VAT_amount = VAT_percentage * taxableAmountHT;

      return VAT_amount;
    }();

  }

  return 0;
}

function itemGetAmount__TTC(entryValue, itemVATPart) {
  if(itemVATPart){
    const { inputType, value = 'Value_Exempt', } = itemVATPart;

    switch (inputType){
      case 1:
      case 'HT':

        // entryValue is HT: TTC = (1 + %VAT) * entryValueHT;
        return (1 + VAT_ID_TO_VALUE[value]) * entryValue;

      case 2:
      case 'TTC':

        // entryValue is TTC: TTC = entryValueTTC;
        return entryValue;

      case 3:
      case 'NO_VAT':

        return entryValue;

      default:

        throw new Error(`itemGetAmount__TTC: Invalid inputType`, inputType);
    }
  }

  return entryValue;
}

function itemGetAmount__HT(entryValue, itemVATPart) {
  if(itemVATPart){
    const { inputType, value = 'Value_Exempt', } = itemVATPart;

    switch (inputType){
      case 1:
      case 'HT':

        // entryValue is HT: HT = entryValueHT;
        return entryValue;

      case 2:
      case 'TTC':

        // entryValue is TTC: HT =  entryValueTTC / (1 + %VAT);
        return entryValue / (1 + VAT_ID_TO_VALUE[value]);

      case 3:
      case 'NO_VAT':

        return entryValue;

      default:

        throw new Error(`itemGetAmount__HT: Invalid inputType`, inputType);
    }
  }

  return entryValue;
}

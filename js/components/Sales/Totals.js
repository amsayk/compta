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

export default class SalesTotals extends Component{

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

  _renderMoneyOnly(){
    const self = this;

    const { styles, company, page, selection, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const rowsCount = 1;
    const tableHeight = 0 + (rowsCount * 30) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 225 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 225 - 60, 956);
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
        ? company.payments.sumOfCredits
        : company.payments.edges.reduce((result, {node : { id, amountReceived, itemsConnection, }}) => {
          return result + (isSelected(id)
            ? amountReceived - itemsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0)
            : 0.0);
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MAD', });
    };
    const calcSumOfTotals = () => {
      const paymentsResl = sel.mode === SelectionModes.None
        ? company.payments.sumOfTotals
        : company.payments.edges.reduce((result, {node : { id, amountReceived, }}) => {
          return result + (isSelected(id)
            ? amountReceived
            : 0.0);
        }, 0.0);
      const salesResl = sel.mode === SelectionModes.None
        ? company.sales.sumOfTotals
        : company.sales.edges.reduce((result, {node : { id, itemsConnection, discountType, discountValue, }}) => {
          return result + (isSelected(id)
            ? getTotal(itemsConnection, { discountType, discountValue, })
            : 0.0);
        }, 0.0);

      return intl.formatNumber(salesResl + paymentsResl, { format: 'MAD', });
    };

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
              width={100}
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
              width={40}
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
              width={80}
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
                  <div className={``}>
                  </div>
                 </Cell>
               )
              }}
              width={100}
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

  _renderInvoicesOnly(){
    const self = this;
    const { styles, company, page, selection, } = this.props;
    const sel = selection[page] || { mode: SelectionModes.None, keys: {}, };
    const { intl, } = this.context;

    const rowsCount = 1;
    const tableHeight = 0 + (rowsCount * 30) + 2;
    // const bodyWidth = Math.max(956,
    //   this.props.bodyWidth - 225 - 60
    // )
    // ;
    const bodyWidth = Math.max(this.props.bodyWidth - 225 - 60, 956);
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
        ? company.invoices.sumOfBalances
        : company.invoices.edges.reduce((result, {node : { id, itemsConnection, paymentsConnection, discountType, discountValue, }}) => {
          return result + (isSelected(id)
            ? (getTotal(itemsConnection, { discountType, discountValue, }) - paymentsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0))
            : 0.0)
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MAD', });
    };
    const calcSumOfTotals = () => {
      const resl = sel.mode === SelectionModes.None
        ? company.invoices.sumOfTotals
        : company.invoices.edges.reduce((result, {node : { id, itemsConnection, discountType, discountValue, }}) => {
          return result + (isSelected(id)
            ? getTotal(itemsConnection, { discountType, discountValue, })
            : 0.0)
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MAD', });
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
              width={100}
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
              width={40}
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
              width={100}
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

    const isOnlyPayments =  type === 'recent' || type === 'money' || type === 'payments' || type === 'sales';
    if(isOnlyPayments){
      return this._renderMoneyOnly();
    }

    const isOnlyInvoices = type === 'invoices';
    if(isOnlyInvoices){
      return this._renderInvoicesOnly();
    }

    return null;
  }

}

function getTotal(itemsConnection, { discountType, discountValue, }){
  const completedLines = itemsConnection.edges;

  const subtotal = completedLines
    .reduce((sum, { node: { qty, rate, }, }) => sum + (qty * rate), 0.0);
  const totalDiscount = getTotalDiscount(subtotal, { type: discountType, value: discountValue, });
  const taxableSubtotal = completedLines
    .reduce((sum, { node: { qty, rate, discountPart : itemDiscountPart, }, }) => {
      const amount = qty * rate;
      const itemDiscount = itemGetDiscount(amount, itemDiscountPart);
      const amountPercentage = (amount * 100 / subtotal);
      const discountPart = amountPercentage / 100 * totalDiscount;
      return sum + (amount - discountPart) - itemDiscount;
    }, 0.0);

  const total = subtotal - totalDiscount;

  const taxAmount = 0; // getTaxAmount(taxableSubtotal, {});
  return total + taxAmount;
}

function itemGetDiscount(total, {type, value}){
  switch (type) {
    case 'Value':    return value || 0.0;
    case 'Percent':  return total * ((value||0.0)/100);
  }
}
function getTotalDiscount(subtotal, {type, value}){
  switch (type) {
    case 'Value':    return value || 0.0;
    case 'Percent':  return subtotal * ((value||0.0)/100);
  }
}

// function getTaxAmount(taxableSubtotal, {taxPercent}){
//   return taxableSubtotal * ((taxPercent || 0.0) / 100);
// }

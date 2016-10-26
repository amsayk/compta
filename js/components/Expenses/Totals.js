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

export default class ExpensesTotals extends React.Component{

  static displayName = 'ExpensesTotals';

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

  render(){
    const {
      type,
      status,
      limit,
      sortKey, sortDir,
    } = this.props.filterArgs;

    const VATEnabled = this.props.topLoading ? false : this.props.company.VATSettings.enabled;

    const isOnlyPayments =  type === 'recent' || type === 'money' || type === 'payments' || type === 'expenses';
    if(isOnlyPayments){
      return this._renderMoneyOnly(VATEnabled);
    }

    const isOnlyBills = type === 'bills';
    if(isOnlyBills){
      return this._renderBillsOnly(VATEnabled);
    }

    return null;
  }

  _renderMoneyOnly(VATEnabled){
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

    // const calcSumOfTotals = () => {
    //   const paymentsResl = sel.mode === SelectionModes.None
    //     ? company.payments.sumOfTotals
    //     : company.payments.edges.reduce((result, {node : { id, amountReceived, }}) => {
    //       return result + (isSelected(id)
    //         ? amountReceived
    //         : 0.0);
    //     }, 0.0);
    //   const expensesResl = sel.mode === SelectionModes.None
    //     ? company.expenses.sumOfTotals
    //     : company.expenses.edges.reduce((result, {node : { id, itemsConnection, }}) => {
    //       return result + (isSelected(id)
    //         ? getTotal(itemsConnection)
    //         : 0.0);
    //     }, 0.0);

    //   return intl.formatNumber(expensesResl + paymentsResl, { format: 'MAD', });
    // };

    // const calcSumOfBalances = () => {
    //   const resl = sel.mode === SelectionModes.None
    //     ? company.expenses.paymentsSumOfCredits + company.expenses.billsSumOfBalances
    //     : company.expenses.edges.reduce((result, {node : { id, __opType : type, billItemsConnection, discountType, discountValue, billPaymentsConnection, amountReceived, paymentItemsConnection, }}) => {

    //       switch(type){
    //         case 'Bill':

    //           return result + (isSelected(id)
    //             ? getTotal(billItemsConnection)  - billPaymentsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0)
    //             : 0.0);

    //         case 'PaymentOfBills':

    //           return result + (isSelected(id)
    //             ?  amountReceived - paymentItemsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0)
    //             : 0.0);

    //         default: return result;
    //       }

    //       // return result + ((type === 'PaymentOfBills' || type === 'Bill') && isSelected(id)
    //       //   ? amountReceived - itemsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0)
    //       //   : 0.0);
    //     }, 0.0);

    //   return intl.formatNumber(resl, { format: 'MONEY', });
    // };
    const calcSumOfTotals = () => {
      // const paymentsResl = sel.mode === SelectionModes.None
      //   ? company.expenses.paymentsSumOfTotals
      //   : company.expenses.edges.reduce((result, {node : { id, __opType : type, amountReceived, }}) => {
      //     return result + (type === 'PaymentOfBills' && isSelected(id)
      //       ? amountReceived
      //       : 0.0);
      //   }, 0.0);
      // const expensesResl = sel.mode === SelectionModes.None
      //   ? company.expenses.expensesSumOfTotals
      //   : company.expenses.edges.reduce((result, {node : { id, __opType : type, itemsConnection, discountType, discountValue, }}) => {
      //     return result + (type === 'Expense' && isSelected(id)
      //       ? getTotal(itemsConnection)
      //       : 0.0);
      //   }, 0.0);
      //
      // return intl.formatNumber(expensesResl + paymentsResl, { format: 'MONEY', });

      const res = sel.mode === SelectionModes.None
        ? company.expenses.expensesSumOfTotals + company.expenses.paymentsSumOfTotals
        : company.expenses.edges.reduce((result, {node : { id, __opType : type, billItemsConnection, expenseItemsConnection, discountType, discountValue, }}) => {

          switch(type){
            case 'Expense':

              return result + (isSelected(id)
                ? getTotal(expenseItemsConnection)
                : 0.0);

            case 'PaymentOfBills':

              return result + (isSelected(id)
                ?  amountReceived
                : 0.0);

            default: return result;
          }

          // return result + (type === 'Expense' && isSelected(id)
          //   ? getTotal(itemsConnection)
          //   : 0.0);
        }, 0.0);

        return intl.formatNumber(res, { format: 'MONEY', });
    };

    return (
      isEmpty ? null : <div className={classnames({[styles['expenses-table-wrapper'] || '']: true, [styles['table']]: true, })}>

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
            rowHeight={50}
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
              width={60}
            />

            {/* Payee */}
            {/*<Column
              columnKey={'payee'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_PAYEE'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div></div>
             </Cell>
           )}
              width={40}
              flexGrow={1}
            />*/}

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

            {/* category */}
            {/*<Column
              columnKey={'category'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Category'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return 'Cetegory';
                 case 'Expense': return 'Cetegory';
                 case 'Payment': return null;
               }
             }()}</div>
             </Cell>
           )}
              width={180}
            />*/}

            {/* dueDate */}
            {/*<Column
              columnKey={'dueDate'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_DueDate'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return moment(obj.dueDate).format('ll');
                 case 'Payment': return moment(obj.date).format('ll');
                 default:        return '';
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />*/}

            {/* Bal */}
            {/*<Column
              columnKey={'balanceDue'}
              align={'right'}
              // header={<Cell>{intl.formatMessage(messages['Table_Title_Balance'])}</Cell>}
              header={(
                <SortHeaderCell
                  key={'balanceDue'}
                  styles={styles}
                  className={sortKey === 'balanceDue' ? `${styles['sort-key']} ${styles[sortDir === -1 ? 'sort-dir-desc' : 'sort-dir-asc']}` : styles['sort-key']}
                  columnKey={'balanceDue'}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSortChange={this._onSortChange}>{intl.formatMessage(messages['Table_Title_Balance'])}
                </SortHeaderCell>
              )}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':     return intl.formatNumber(obj.balanceDue, {format: 'MAD'});
                 case 'Expense':  return intl.formatNumber(0.0, {format: 'MAD'});
                 case 'Payment':  return intl.formatNumber(obj.balanceDue, {format: 'MAD'});
                //  case 'Payment':  return obj.balanceDue > 0 ? '(' + intl.formatNumber(obj.balanceDue, {format: 'MAD'}) + ')' : intl.formatNumber(obj.balanceDue, {format: 'MAD'});
               }
             }()}</div>
             </Cell>
           )}
              width={50}
              flexGrow={1}
            />*/}

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
            {/*<Column
              columnKey={'status'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Status'])}</Cell>}
              cell={({rowIndex, ...props}) => {
                const obj = loading ? null : store.getObjectAt(rowIndex);
                return (
                 <Cell {...props}>
                  <div
                    className={`${styles['field-status']} ${styles[loading || obj.status.toLowerCase()] || ''}`}>
                    {loading || function(){
                      const obj = store.getObjectAt(rowIndex);
                      switch(obj.type){
                        case 'Bill': return intl.formatMessage(messages[`BillStatus${obj.status}`]);
                        case 'Payment': return intl.formatMessage(messages[`PaymentStatus${obj.status}`]);
                        case 'Expense':    return intl.formatMessage(messages[`SaleStatus${obj.status}`]);
                      }
                    }()}
                  </div>
                 </Cell>
               )
              }}
              width={50}
              flexGrow={1}
            />*/}

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

  _renderBillsOnly(VATEnabled){
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

    // const calcSumOfBalances = () => {
    //   const resl = sel.mode === SelectionModes.None
    //     ? company.bills.sumOfBalances
    //     : company.bills.edges.reduce((result, {node : { id, itemsConnection, paymentsConnection, }}) => {
    //       return result + (isSelected(id)
    //         ? (getTotal(itemsConnection) - paymentsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0))
    //         : 0.0)
    //     }, 0.0);

    //   return intl.formatNumber(resl, { format: 'MAD', });
    // };
    // const calcSumOfTotals = () => {
    //   const resl = sel.mode === SelectionModes.None
    //     ? company.bills.sumOfTotals
    //     : company.bills.edges.reduce((result, {node : { id, itemsConnection, }}) => {
    //       return result + (isSelected(id)
    //         ? getTotal(itemsConnection)
    //         : 0.0)
    //     }, 0.0);

    //   return intl.formatNumber(resl, { format: 'MAD', });
    // };

    const calcSumOfBalances = () => {
      const resl = sel.mode === SelectionModes.None
        ? company.expenses.billsSumOfBalances
        : company.expenses.edges.reduce((result, {node : { id, __opType : type, billItemsConnection : itemsConnection, billPaymentsConnection : paymentsConnection, discountType, discountValue, }}) => {
          return result + (type === 'Bill' && isSelected(id)
            ? (getTotal(itemsConnection) - paymentsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0))
            : 0.0)
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MONEY', });
    };
    const calcSumOfTotals = () => {
      const resl = sel.mode === SelectionModes.None
        ? company.expenses.billsSumOfTotals
        : company.expenses.edges.reduce((result, {node : { id, __opType : type, billItemsConnection : itemsConnection, discountType, discountValue, }}) => {
          return result + (type === 'Bill' && isSelected(id)
            ? getTotal(itemsConnection)
            : 0.0)
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MONEY', });
    };

    return (
      isEmpty ? null : <div className={classnames({[styles['expenses-table-wrapper'] || '']: true, [styles['table']]: true, })}>

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
            rowHeight={50}
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
            {/*<Column
              columnKey={'type'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Type'])}</Cell>}
              cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {loading || intl.formatMessage(messages[`${store.getObjectAt(rowIndex).type}Type`])}
                </div>
               </Cell>
             )}
              width={50}
              flexGrow={1}
            />*/}

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
              width={60}
            />

            {/* Payee */}
            {/*<Column
              columnKey={'payee'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_PAYEE'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return obj.payee ? obj.payee.displayName : '';
                 case 'Expense': return obj.payee ? obj.payee.displayName : '';
                 case 'Payment': return obj.payee ? obj.payee.displayName : '';
               }
             }()}</div>
             </Cell>
           )}
              width={40}
              flexGrow={1}
            />*/}

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

            {/* category */}
            {/*<Column
              columnKey={'category'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Category'])}</Cell>}
              cell={({rowIndex, ...props}) => (
             <Cell {...props}>
             <div>{loading || function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.type){
                 case 'Bill':    return 'Cetegory';
                 case 'Expense': return 'Cetegory';
                 case 'Payment': return null;
               }
             }()}</div>
             </Cell>
           )}
              width={180}
            />*/}

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
            {/*<Column
              columnKey={'status'}
              align={'left'}
              header={<Cell>{intl.formatMessage(messages['Table_Title_Status'])}</Cell>}
              cell={({rowIndex, ...props}) => {
                const obj = loading ? null : store.getObjectAt(rowIndex);
                return (
                 <Cell {...props}>
                  <div
                    className={`${styles['field-status']} ${styles[loading || obj.status.toLowerCase()] || ''}`}>
                    {loading || function(){
                      const obj = store.getObjectAt(rowIndex);
                      switch(obj.type){
                        case 'Bill': return intl.formatMessage(messages[`BillStatus${obj.status}`]);
                        case 'Payment': return intl.formatMessage(messages[`PaymentStatus${obj.status}`]);
                        case 'Expense':    return intl.formatMessage(messages[`SaleStatus${obj.status}`]);
                      }
                    }()}
                  </div>
                 </Cell>
               )
              }}
              width={50}
              flexGrow={1}
            />*/}

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

}

// function getTotal(itemsConnection){
//   const completedLines = itemsConnection.edges;

//   return completedLines
//     .reduce((sum, { node: { amount, }, }) => sum + amount, 0.0);
// }

function getTotal(itemsConnection){
  const completedLines = itemsConnection.edges;

  const subtotalHT = completedLines
    .reduce((sum, { node: { amount, VATPart : itemVATPart, }, }) => sum + itemGetAmount__HT(amount, itemVATPart), 0.0);


  const totalHT = subtotalHT;

  const totalTaxAmount = completedLines
    .reduce((sum, { node: { amount, VATPart : itemVATPart, }, }) => {

      const entryValue = amount;

      const amountHT = itemGetAmount__HT(entryValue, itemVATPart);

      const taxableAmount = amountHT;

      return sum + itemGeVATPart__Amount(taxableAmount, itemVATPart);
    }, 0.0);

  return totalHT + totalTaxAmount;
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


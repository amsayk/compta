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

export default class ExpensesTotals extends Component{

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

    const isOnlyPayments =  type === 'recent' || type === 'money' || type === 'payments' || type === 'expenses';
    if(isOnlyPayments){
      return this._renderMoneyOnly();
    }

    const isOnlyBills = type === 'bills';
    if(isOnlyBills){
      return this._renderBillsOnly();
    }

    return null;
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

    const calcSumOfTotals = () => {
      const paymentsResl = sel.mode === SelectionModes.None
        ? company.payments.sumOfTotals
        : company.payments.edges.reduce((result, {node : { id, amountReceived, }}) => {
          return result + (isSelected(id)
            ? amountReceived
            : 0.0);
        }, 0.0);
      const expensesResl = sel.mode === SelectionModes.None
        ? company.expenses.sumOfTotals
        : company.expenses.edges.reduce((result, {node : { id, itemsConnection, }}) => {
          return result + (isSelected(id)
            ? getTotal(itemsConnection)
            : 0.0);
        }, 0.0);

      return intl.formatNumber(expensesResl + paymentsResl, { format: 'MAD', });
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

  _renderBillsOnly(){
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
        ? company.bills.sumOfBalances
        : company.bills.edges.reduce((result, {node : { id, itemsConnection, paymentsConnection, }}) => {
          return result + (isSelected(id)
            ? (getTotal(itemsConnection) - paymentsConnection.edges.reduce((sum, {node : { amount, }}) => sum + amount, 0.0))
            : 0.0)
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MAD', });
    };
    const calcSumOfTotals = () => {
      const resl = sel.mode === SelectionModes.None
        ? company.bills.sumOfTotals
        : company.bills.edges.reduce((result, {node : { id, itemsConnection, }}) => {
          return result + (isSelected(id)
            ? getTotal(itemsConnection)
            : 0.0)
        }, 0.0);

      return intl.formatNumber(resl, { format: 'MAD', });
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

function getTotal(itemsConnection){
  const completedLines = itemsConnection.edges;

  return completedLines
    .reduce((sum, { node: { amount, }, }) => sum + amount, 0.0);
}

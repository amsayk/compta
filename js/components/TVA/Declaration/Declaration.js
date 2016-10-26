import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import Sidebar from '../../Sidebar/AppSidebar';

import LazyCache from 'react-lazy-cache';

import moment from 'moment';

import Loading from '../../Loading/Loading';

import group from 'lodash.groupby';
import map from 'lodash.map';

import CSSModules from 'react-css-modules';

import styles from './Declaration.scss';

import classnames from 'classnames';

import RelayRoute from '../../../routes/TVADeclarationRoute';

import { getBodyWidth, } from '../../../utils/dimensions';

import Revision from '../../../utils/revision';

import {Table, Column, Cell,} from '../../../../fixed-data-table';

import {
  intlShape,
} from 'react-intl';

import OperationDataListStore from './OperationDataListStore';

import stopEvent from "../../../utils/stopEvent";

import Header from './Header';
import getAccountName from "../../../utils/getAccountName";

@CSSModules(styles, {allowMultiple: true})
class TVADeclaration extends React.Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props, context){
    super(props, context);

    this.state = {
      modalOpen: false,

      selectedKey: localStorage.getItem('VATDeclaration.selectedKey') !== null ? JSON.parse(localStorage.getItem('VATDeclaration.selectedKey')) : 1,

      loading: this.props.loading,

      sales: // new OperationDataListStore(
        this.props.loading ? [] : getSales(this.props.viewer),
      // ),

      expenses: // new OperationDataListStore(
        this.props.loading ? [] : getExpenses(this.props.viewer),
      // ),

    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      loading: nextProps.loading,

      sales: // new OperationDataListStore(
        nextProps.loading ? [] : getSales(nextProps.viewer),
      //),

      expenses: //new OperationDataListStore(
        nextProps.loading ? [] : getExpenses(nextProps.viewer),
      //),

    });

  }

  _onTab = (selectedKey, e) => {
    stopEvent(e);

    this.setState({
      selectedKey,
    }, function () {
      localStorage.setItem('VATDeclaration.selectedKey', selectedKey);
    });
  };

  componentWillUnmount() {
  }

  componentDidMount(){
  }

  render() {
    const { route, stale, loading, viewer, root, company, companies, } = this.props;

    const bodyWidth = getBodyWidth();

    return (
      <div className={'height100Percent'} styleName={''}>

        <Sidebar
          route={route}
          bodyWidth={bodyWidth}
          viewer={viewer}
          company={company}
          companies={companies.edges.map(({ node: company, }) => company)}
          root={root}
          page='/vat'
        />

        <div className='content'>

          <div styleName='page'>

            <Header
              bodyWidth={bodyWidth}
              company={company}
              declaration={loading ? null : viewer.VATDeclaration}
              viewer={viewer}
              topLoading={loading}
            />

            <div styleName='index' style={{
              /*minHeight: 794Math.max(minHeight, 794, minHeight),*/
              background: '#fff',
              position: 'absolute',
              top: 97,
              paddingBottom: 50,
            }}>

              {loading || stale ? <Loading/> : <div>{this._renderDeclaration()}</div>}

            </div>

          </div>

        </div>

      </div>
    );
  }

  _renderDeclaration = () => {
    const self = this;

    const {
      styles,
    } = this.props;

    return (

      <div>

        <div className='tabs'>

          <ul className={styles['tab-content']}>

            <li onClick={self._onTab.bind(self, 1)} className={classnames(styles['tab-pane'], { [styles['selected']]: self.state.selectedKey === 1})}>Ventes</li>

            <li onClick={self._onTab.bind(self, 2)} className={classnames(styles['tab-pane'], { [styles['selected']]: self.state.selectedKey === 2})}>Dépenses</li>

          </ul>

        </div>

        {function(self){

          switch (self.state.selectedKey) {
            case 1:

              return self._renderSales();

            case 2:

              return self._renderExpenses();
          }

          }(this)}

      </div>
    );
  };

  _renderSales = () => {

    const { sales, } = this.state;

    const {
      styles = {},
    } = this.props;

    const isEmpty = sales.length === 0;

    if(isEmpty){
      return (
        <div style={{ margin: '3em 2em', }} className={classnames(styles['vat-ops-table'], {[styles['table']]: true})}>

          <div style={{}}>Aucunes ventes à afficher.</div>

        </div>
      );
    }

    const groups = {};

    map(group(sales, op => op.saleItem.VATPart.inputType === 3 || op.saleItem.VATPart.inputType === 'NO_VAT' ? 'HT' : 'TTC'), (items, key) => {
        const store = new OperationDataListStore(
          items
        );

        groups[key] = store;
      });

    const bodyWidth = Math.max(getBodyWidth() - 165 - 60 - 30, 956);
    const tableWidth = bodyWidth - 1;

    const {
      intl,
    } = this.context;

    const renderHTGroup = (store) => {

      // const { sales : store, } = this.state;
      const rowsCount = store.getSize();
      const tableHeight = 36 + (rowsCount * 50) + 2;

      const isEmpty = rowsCount === 0;

      if(isEmpty){
        return (
          null
        );
      }

      const total = store.totalHT;

      return (
        <div className={classnames(styles['vat-ops-table'], {[styles['table']]: true})} style={{ padding: '0 15px', marginTop: 33, }}>

          <div className={`${styles['part-header']}`} style={{}}>
            CA HT
          </div>

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
              onHeaderClick={(e) => {}}
              onRowClick={(e, rowIndex) => this._openItem(store.getObjectAt(rowIndex), e)}
              rowClassNameGetter={(rowIndex) => {
              // const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
              });
            }}
              rowHeight={50}
              rowsCount={rowsCount}
              height={tableHeight}
              width={tableWidth}
              headerHeight={36}>

              {/* date */}
              <Column
                columnKey={'date'}
                align={'left'}
                header={<Cell>{'Date'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return moment(obj.sale.date).format('ll');
             }()}
                </div>
               </Cell>
             )}
                width={90}
              />

              {/* refNo */}
              <Column
                columnKey={'refNo'}
                align={'left'}
                header={<Cell>{'Nº'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.refNo;
             }()}
                </div>
               </Cell>
             )}
                width={70}
              />

              {/* customer */}
              <Column
                columnKey={'customer'}
                align={'left'}
                header={<Cell>{'Client'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.sale.customer ? obj.sale.customer.displayName : '';
             }()}
                </div>
               </Cell>
             )}
                width={100}
                flexGrow={1}
              />

              {/* address */}
              <Column
                columnKey={'address'}
                align={'left'}
                header={<Cell>{'Adresse'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.sale.customer ? obj.sale.customer.billingAddress : null;
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* if */}
              <Column
                columnKey={'if'}
                align={'left'}
                header={<Cell>{'I.F'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.sale.customer ? obj.sale.customer.if : null;
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />


              {/* item */}
              <Column
                columnKey={'item'}
                align={'left'}
                header={<Cell>{'Désignation'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return getProductItem(obj.saleItem);
             }()}
                </div>
               </Cell>
             )}
                width={100}
                flexGrow={1}
              />

              {/* totalHT */}
              <Column
                columnKey={'totalHT'}
                align={'right'}
                header={<Cell>{'Montant HT'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return intl.formatNumber(obj.amount, {format: 'MONEY'})
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* datePaid */}
              <Column
                columnKey={'latestPayment'}
                align={'left'}
                header={<Cell>{'Date Règl.'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.sale.type){
                 case 'Invoice': return moment(obj.sale.paymentsConnection.latestPayment.date).format('ll');
                 case 'Sale':    return moment(obj.sale.date).format('ll');
               }
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* paymentMethod */}
              <Column
                columnKey={'paymentMethod'}
                align={'left'}
                header={<Cell>{'Mode Règl.'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
              switch(obj.sale.type){
                case 'Invoice': return paymentMethod[obj.sale.paymentsConnection.latestPayment.payment.paymentMethod];
                case 'Sale':    return paymentMethod[obj.sale.paymentMethod];
              }
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

            </Table>

          </div>

          <div className={`${styles['part-footer']}`} style={{}}>

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
              // const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
              });
            }}
                rowHeight={50}
                rowsCount={1}
                height={50 + 2}
                width={tableWidth}
                headerHeight={0}>

                {/* date */}
                <Column
                  columnKey={'date'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
                  width={90}
                />

                {/* refNo */}
                <Column
                  columnKey={'refNo'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
                  width={70}
                />

                {/* customer */}
                <Column
                  columnKey={'customer'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
                  width={100}
                  flexGrow={1}
                />

                {/* address */}
                <Column
                  columnKey={'address'}
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

                {/* if */}
                <Column
                  columnKey={'if'}
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


                {/* item */}
                <Column
                  columnKey={'item'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {'TOTAL HT'}
                </div>
               </Cell>
             )}
                  width={100}
                  flexGrow={1}
                />


                {/* total */}
                <Column
                  columnKey={'total'}
                  align={'right'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(total, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                  width={50}
                  flexGrow={1}
                />

                {/* datePaid */}
                <Column
                  columnKey={'latestPayment'}
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

                {/* paymentMethod */}
                <Column
                  columnKey={'paymentMethod'}
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

              </Table>

            </div>

          </div>

        </div>
      );
    };

    const renderTTCGroup = (store) => {

      // const { sales : store, } = this.state;
      const rowsCount = store.getSize();
      const tableHeight = 36 + (rowsCount * 50) + 2;

      const isEmpty = rowsCount === 0;

      if(isEmpty){
        return (
          null
        );
      }

      const totalHT = store.totalHT;
      const totalVAT = store.totalVAT;

      return (
        <div className={classnames(styles['vat-ops-table'], { [styles['table']]: true, })} style={{ padding: '0 15px', marginTop: 33, }}>

          <div className={`${styles['part-header']}`} style={{}}>
            CA TTC
          </div>

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
              onHeaderClick={(e) => {}}
              onRowClick={(e, rowIndex) => this._openItem(store.getObjectAt(rowIndex), e)}
              rowClassNameGetter={(rowIndex) => {
              // const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
              });
            }}
              rowHeight={50}
              rowsCount={rowsCount}
              height={tableHeight}
              width={tableWidth}
              headerHeight={36}>

              {/* date */}
              <Column
                columnKey={'date'}
                align={'left'}
                header={<Cell>{'Date'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return moment(obj.sale.date).format('ll');
             }()}
                </div>
               </Cell>
             )}
                width={90}
              />

              {/* refNo */}
              <Column
                columnKey={'refNo'}
                align={'left'}
                header={<Cell>{'Nº'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.refNo;
             }()}
                </div>
               </Cell>
             )}
                width={70}
              />

              {/* customer */}
              <Column
                columnKey={'customer'}
                align={'left'}
                header={<Cell>{'Client'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.sale.customer ? obj.sale.customer.displayName : '';
             }()}
                </div>
               </Cell>
             )}
                width={100}
                flexGrow={1}
              />

              {/* address */}
              <Column
                columnKey={'address'}
                align={'left'}
                header={<Cell>{'Adresse'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.sale.customer ? obj.sale.customer.billingAddress : null;
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* if */}
              <Column
                columnKey={'if'}
                align={'left'}
                header={<Cell>{'I.F'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.sale.customer ? obj.sale.customer.if : null;
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />


              {/* item */}
              <Column
                columnKey={'item'}
                align={'left'}
                header={<Cell>{'Désignation'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return getProductItem(obj.saleItem);
             }()}
                </div>
               </Cell>
             )}
                width={100}
                flexGrow={1}
              />

              {/* totalHT */}
              <Column
                columnKey={'totalHT'}
                align={'right'}
                header={<Cell>{'Montant HT'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return intl.formatNumber(obj.amount, {format: 'MONEY'})
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* VAT_percentage */}
              <Column
                columnKey={'VAT_percentage'}
                align={'right'}
                header={<Cell>{'TVA'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
                return obj.saleItem.VATPart && obj.saleItem.VATPart.value
                ? VAT_VALUE_FORMATTED[obj.saleItem.VATPart.value]
                : 'Exonéré';
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />


              {/* VAT */}
              <Column
                columnKey={'VAT'}
                align={'right'}
                header={<Cell>{'Montant TVA'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return intl.formatNumber(obj.VAT, {format: 'MONEY'});
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* total */}
              <Column
                columnKey={'total'}
                align={'right'}
                header={<Cell>{'Montant TTC'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return intl.formatNumber(obj.amount + obj.VAT, {format: 'MONEY'})
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* datePaid */}
              <Column
                columnKey={'latestPayment'}
                align={'left'}
                header={<Cell>{'Date Règl.'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.sale.type){
                 case 'Invoice': return moment(obj.sale.paymentsConnection.latestPayment.date).format('ll');
                 case 'Sale':    return moment(obj.sale.date).format('ll');
               }
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* paymentMethod */}
              <Column
                columnKey={'paymentMethod'}
                align={'left'}
                header={<Cell>{'Mode Règl.'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
              switch(obj.sale.type){
                case 'Invoice': return paymentMethod[obj.sale.paymentsConnection.latestPayment.payment.paymentMethod];
                case 'Sale':    return paymentMethod[obj.sale.paymentMethod];
              }
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

            </Table>

          </div>

          <div className={`${styles['part-footer']}`} style={{}}>

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
              // const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
              });
            }}
                rowHeight={50}
                rowsCount={1}
                height={50 + 2}
                width={tableWidth}
                headerHeight={0}>

                {/* date */}
                <Column
                  columnKey={'date'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
                  width={90}
                />

                {/* refNo */}
                <Column
                  columnKey={'refNo'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
                  width={70}
                />

                {/* customer */}
                <Column
                  columnKey={'customer'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
                  width={100}
                  flexGrow={1}
                />

                {/* address */}
                <Column
                  columnKey={'address'}
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

                {/* if */}
                <Column
                  columnKey={'if'}
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


                {/* item */}
                <Column
                  columnKey={'item'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {'TOTAL TTC'}
                </div>
               </Cell>
             )}
                  width={100}
                  flexGrow={1}
                />

                {/* totalHT */}
                <Column
                  columnKey={'totalHT'}
                  align={'right'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalHT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                  width={50}
                  flexGrow={1}
                />

                {/* VAT_percentage */}
                <Column
                  columnKey={'VAT_percentage'}
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


                {/* VAT */}
                <Column
                  columnKey={'VAT'}
                  align={'right'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalVAT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                  width={50}
                  flexGrow={1}
                />

                {/* total */}
                <Column
                  columnKey={'total'}
                  align={'right'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalHT + totalVAT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                  width={50}
                  flexGrow={1}
                />

                {/* datePaid */}
                <Column
                  columnKey={'latestPayment'}
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

                {/* paymentMethod */}
                <Column
                  columnKey={'paymentMethod'}
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

              </Table>

            </div>

          </div>

        </div>
      );
    };

    const renderTotal = () => {
      const ht = groups['HT'];
      const ttc = groups['TTC'];

      if(!ht && !ttc){
        return null;
      }

      const totalHT = (ht ? ht.totalHT : 0.0) + (ttc ? ttc.totalHT : 0.0);
      const totalVAT = (ht ? ht.totalVAT : 0.0) + (ttc ? ttc.totalVAT : 0.0);

      return (
        <div className={styles['totals-table']} style={{ margin: '30px 0', }}>

          <div className={`${styles['part-header']}`} style={{ padding: '0 15px', }}>
            Totaux
          </div>

          <div style={{ padding: '0 15px', }}>

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
              // const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
              });
            }}
              rowHeight={50}
              rowsCount={1}
              height={36 + 50 + 2}
              width={tableWidth * 0.60}
              headerHeight={36}>


              {/* totalHT */}
              <Column
                columnKey={'totalHT'}
                align={'left'}
                header={<Cell>{'TOTAL HT'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalHT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />


              {/* VAT */}
              <Column
                columnKey={'VAT'}
                align={'right'}
                header={<Cell>{'TOTAL TVA'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalVAT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* total */}
              <Column
                columnKey={'total'}
                align={'right'}
                header={<Cell>{'TOTAL TTC'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalHT + totalVAT, { format: 'MONEY', })}
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

    };

    return (
      <div className="" style={{}}>

        {renderTotal()}

        {groups['TTC'] && renderTTCGroup(groups['TTC'])}

        {groups['HT'] && renderHTGroup(groups['HT'])}

      </div>
    );

  };

  _renderExpenses = () => {

    const {
      styles = {},
    } = this.props;

    const { expenses, } = this.state;

    const isEmpty = expenses.length === 0;

    if(isEmpty){
      return (
        <div style={{ margin: '3em 2em', }} className={classnames(styles['vat-ops-table'], {[styles['table']]: true})}>

          <div style={{}}>Aucuns achats à afficher.</div>

        </div>
      );
    }

    const {
      intl,
    } = this.context;

    const bodyWidth = Math.max(getBodyWidth() - 165 - 60 - 30, 956);
    const tableWidth = bodyWidth - 1;

    const renderTotal = () => {

      const keys = Object.keys(groups);

      if(keys.every(key => !groups[key])){
        return null;
      }

      const totalHT = keys.reduce(function(sum, nextKey){
        return key_hasVAT[nextKey] ? sum + groups[nextKey].totalHT : sum;
      }, 0.0);

      const totalVAT = keys.reduce(function(sum, nextKey){
        return key_hasVAT[nextKey] ? sum + groups[nextKey].totalVAT : sum;
      }, 0.0);

      return (
        <div className={styles['totals-table']} style={{ margin: '30px 0', }}>

          <div className={`${styles['part-header']}`} style={{ padding: '0 15px', }}>
            Totaux
          </div>

          <div style={{ padding: '0 15px', }}>

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
              // const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
              });
            }}
              rowHeight={50}
              rowsCount={1}
              height={36 + 50 + 2}
              width={tableWidth * 0.60}
              headerHeight={36}>


              {/* totalHT */}
              <Column
                columnKey={'totalHT'}
                align={'left'}
                header={<Cell>{'TOTAL HT'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalHT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />


              {/* VAT */}
              <Column
                columnKey={'VAT'}
                align={'right'}
                header={<Cell>{'TOTAL TVA'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalVAT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* total */}
              <Column
                columnKey={'total'}
                align={'right'}
                header={<Cell>{'TOTAL TTC'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalHT + totalVAT, { format: 'MONEY', })}
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

    };

    const groups = {};

    map(group(expenses, op => op.expenseItem.VATPart && op.expenseItem.VATPart.value ? op.expenseItem.VATPart.value : 'Value_Exempt'), (items, key) => {
      const store = new OperationDataListStore(
        items
      );

      groups[key] = store;
    });

    const renderGroup = (store, key) => {
      const hasVAT = key_hasVAT[key];

      // const { expenses : store, } = this.state;
      const rowsCount = store.getSize();
      const tableHeight = 36 + (rowsCount * 50) + 2;

      const totalHT = store.totalHT;
      const totalVAT = hasVAT ? store.totalVAT : null;

      return (
        <div className={classnames(styles['vat-ops-table'], { [styles['table']]: true, })} style={{ padding: '0 15px', marginTop: 33, }}>

          <div className={`${styles['part-header']}`} style={{}}>
            {titleExpenses[key]}
          </div>

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
              onHeaderClick={(e) => {}}
              onRowClick={(e, rowIndex) => this._openItem(store.getObjectAt(rowIndex), e)}
              rowClassNameGetter={(rowIndex) => {
              // const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
              });
            }}
              rowHeight={50}
              rowsCount={rowsCount}
              height={tableHeight}
              width={tableWidth}
              headerHeight={36}>

              {/* date */}
              <Column
                columnKey={'date'}
                align={'left'}
                header={<Cell>{'Date'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return moment(obj.expense.date).format('ll');
             }()}
                </div>
               </Cell>
             )}
                width={90}
              />

              {/* refNo */}
              <Column
                columnKey={'refNo'}
                align={'left'}
                header={<Cell>{'Nº'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.refNo;
             }()}
                </div>
               </Cell>
             )}
                width={70}
              />

              {/* payee */}
              <Column
                columnKey={'payee'}
                align={'left'}
                header={<Cell>{'Fournisseur'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.expense.payee ? obj.expense.payee.displayName : '';
             }()}
                </div>
               </Cell>
             )}
                width={100}
                flexGrow={1}
              />

              {/* address */}
              <Column
                columnKey={'address'}
                align={'left'}
                header={<Cell>{'Adresse'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.expense.payee ? obj.expense.mailingAddress : null;
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* if */}
              <Column
                columnKey={'if'}
                align={'left'}
                header={<Cell>{'I.F'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.expense.payee ? obj.expense.payee.if : null;
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />


              {/* item */}
              <Column
                columnKey={'item'}
                align={'left'}
                header={<Cell>{'Désignation'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return getExpenseItem(obj.expenseItem);
             }()}
                </div>
               </Cell>
             )}
                width={100}
                flexGrow={1}
              />

              {/* totalHT */}
              <Column
                columnKey={'totalHT'}
                align={'right'}
                header={<Cell>{'Montant HT'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return intl.formatNumber(obj.amount, {format: 'MONEY'})
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* VAT_percentage */}
              {hasVAT && <Column
                columnKey={'VAT_percentage'}
                align={'right'}
                header={<Cell>{'TVA'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return obj.expenseItem.VATPart && obj.expenseItem.VATPart.value
                ? VAT_VALUE_FORMATTED[obj.expenseItem.VATPart.value]
                : 'Exonéré';
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />}


              {/* VAT */}
              {hasVAT && <Column
                columnKey={'VAT'}
                align={'right'}
                header={<Cell>{'Montant TVA'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return intl.formatNumber(obj.VAT, {format: 'MONEY'});
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />}

              {/* total */}
              {hasVAT && <Column
                columnKey={'total'}
                align={'right'}
                header={<Cell>{'Montant TTC'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               return intl.formatNumber(obj.amount + obj.VAT, {format: 'MONEY'})
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />}

              {/* datePaid */}
              <Column
                columnKey={'latestPayment'}
                align={'left'}
                header={<Cell>{'Date Règl.'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
               switch(obj.expense.type){
                 case 'Bill': return moment(obj.expense.paymentsConnection.latestPayment.date).format('ll');
                 case 'Expense':    return moment(obj.expense.date).format('ll');
               }
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

              {/* paymentMethod */}
              <Column
                columnKey={'paymentMethod'}
                align={'left'}
                header={<Cell>{'Mode Règl.'}</Cell>}
                cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {function(){
               const obj = store.getObjectAt(rowIndex);
              switch(obj.expense.type){
                case 'Bill': return null;
                case 'Expense':    return paymentMethod[obj.expense.paymentMethod];
              }
             }()}
                </div>
               </Cell>
             )}
                width={50}
                flexGrow={1}
              />

            </Table>

          </div>

          <div className={`${styles['part-footer']}`} style={{}}>

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
              // const obj = store.getObjectAt(rowIndex);
              return classnames(`${styles.row} table-row`, {
                [styles['first-row'] || '']: rowIndex === 0,
              });
            }}
                rowHeight={50}
                rowsCount={1}
                height={50 + 2}
                width={tableWidth}
                headerHeight={0}>

                {/* date */}
                <Column
                  columnKey={'date'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
                  width={90}
                />

                {/* refNo */}
                <Column
                  columnKey={'refNo'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
                  width={70}
                />

                {/* payee */}
                <Column
                  columnKey={'payee'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                </div>
               </Cell>
             )}
                  width={100}
                  flexGrow={1}
                />

                {/* address */}
                <Column
                  columnKey={'address'}
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

                {/* if */}
                <Column
                  columnKey={'if'}
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


                {/* item */}
                <Column
                  columnKey={'item'}
                  align={'left'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {expenses_key_totals[key]}
                </div>
               </Cell>
             )}
                  width={100}
                  flexGrow={1}
                />

                {/* totalHT */}
                <Column
                  columnKey={'totalHT'}
                  align={'right'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalHT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                  width={50}
                  flexGrow={1}
                />

                {/* VAT_percentage */}
                {hasVAT && <Column
                  columnKey={'VAT_percentage'}
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
                />}


                {/* VAT */}
                {hasVAT && <Column
                  columnKey={'VAT'}
                  align={'right'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalVAT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                  width={50}
                  flexGrow={1}
                />}

                {/* total */}
                {hasVAT && <Column
                  columnKey={'total'}
                  align={'right'}
                  header={null}
                  cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                <div>
                  {intl.formatNumber(totalHT + totalVAT, { format: 'MONEY', })}
                </div>
               </Cell>
             )}
                  width={50}
                  flexGrow={1}
                />}

                {/* datePaid */}
                <Column
                  columnKey={'latestPayment'}
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

                {/* paymentMethod */}
                <Column
                  columnKey={'paymentMethod'}
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

              </Table>

            </div>

          </div>

        </div>
      );
    };

    return (
      <div className="" style={{}}>

        {renderTotal()}

        {groups['Value_20'] && renderGroup(groups['Value_20'], 'Value_20')}
        {groups['Value_14'] && renderGroup(groups['Value_14'], 'Value_14')}
        {groups['Value_10'] && renderGroup(groups['Value_10'], 'Value_10')}
        {groups['Value_7'] && renderGroup(groups['Value_7'], 'Value_7')}
        {groups['Value_Exempt'] && renderGroup(groups['Value_Exempt'], 'Value_Exempt')}

      </div>
    );
  };

}

function wrapWithC(MyComponent, props) {

  class CWrapper extends React.Component {

    static propTypes = {
      loading: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      loading: false,
      stale: false,
    };

    render() {
      const { stale, loading, viewer : root, relay, children, } = this.props;
      return React.createElement(
        MyComponent, {
          ...props,
          stale: stale,
          loading: loading,
          companies: root.companies,
          company: root.company,
          root: root,
          viewer: root,
          relay: relay,
        },
        children
      );
    }
  }

  return Relay.createContainer(CWrapper, {
    initialVariables: {
      companyId: props.params.app,
      declarationId: props.params.declarationId,
    },

    fragments: {
      viewer: () => Relay.QL`
          fragment on User {

            objectId,
            id,
            displayName,
            username,
            email,
            createdAt,
            updatedAt,
            sessionToken,

            VATDeclaration: getVATDeclaration(companyId: $companyId, id: $declarationId){

              ... on VATDeclaration{

                settings{
                  agency,
                  startDate,
                  IF,
                  frequency,
                  regime,
                  percentages{ value, },
                },

                id,
                objectId,
                periodStart,
                periodEnd,

                sales: _sales(first: 100000){
                  totalCount,
                  total,
                  totalHT,
                  totalVAT,

                  edges{
                    node{

                      id,
                      objectId,
                      refNo,
                      accountCode,
                      type,
                      __opType : operationType,
                      saleItem{
                        index,
                        date,

                        ... on Node{
                          ... on InvoiceItem{
                              item{
                                className,
                                objectId,
                                id,
                                displayName,
                                createdAt,
                              },
                          }
                        },
                        ... on Node{
                          ... on SaleItem{
                              item{
                                className,
                                objectId,
                                id,
                                displayName,
                                createdAt,
                              },
                          }
                        },

                        description,
                        qty,
                        rate,
                        discountPart{
                          type,
                          value,
                        },
                        VATPart{
                          inputType,
                          value,
                        },
                      },

                      sale{
                        ... on Node {

                          ... on Invoice{

                            __opType: __typename,
                            createdAt,
                            objectId,
                            id,
                            customer{
                              className,
                              type: __typename,
                              objectId,
                              id,
                              displayName,
                              image,
                              title,
                              givenName,
                              middleName,
                              familyName,
                              affiliation,
                              emails,
                              phone,
                              mobile,
                              fax,
                              if,
                              billing_streetAddress,
                              billing_cityTown,
                              billing_stateProvince,
                              billing_postalCode,
                              billing_country,
                              notes,
                              updatedAt,
                              createdAt,
                            },
                            billingAddress,
                            terms,
                            date,
                            dueDate,
                            memo,
                            files,
                            refNo,

                            totalHT,
                            VAT,

                            inputType,

                            invoiceItemsConnection{
                              totalCount,
                              totalAmount,
                              edges{
                                node{

                                  objectId,
                                  id,
                                  index,
                                  date,
                                  item{
                                    className,
                                    objectId,
                                    id,
                                    displayName,
                                    createdAt,
                                  },
                                  description,
                                  qty,
                                  rate,
                                  discountPart{
                                    type,
                                    value,
                                  },

                                  VATPart{
                                    inputType,
                                    value,
                                  },

                                }
                              }
                            },
                            invoicePaymentsConnection{
                              totalCount,
                              totalAmountReceived,
                              latestPayment{
                                objectId,
                                id,
                                date,
                                amount,
                                payment {
                                  id,
                                  objectId,
                                  paymentMethod,
                                },
                              },
                              edges{
                                node{
                                  className,
                                  objectId,
                                  id,
                                  date,
                                  amount,
                                }
                              }
                            },
                            discountType,
                            discountValue,

                          },

                          ... on Sale{

                            __opType: __typename,
                            createdAt,
                            objectId,
                            id,
                            customer{
                              className,
                              type: __typename,
                              objectId,
                              id,
                              displayName,
                              createdAt,
                              if,
                            },
                            billingAddress,
                            date,
                            paymentMethod,
                            depositToAccountCode,
                            discountType,
                            discountValue,
                            memo,
                            files,
                            refNo,

                            totalHT,
                            VAT,

                            inputType,

                            saleItemsConnection{
                              totalCount,
                              amountReceived,
                              edges{
                                node{

                                  objectId,
                                  id,
                                  index,
                                  date,
                                  item{
                                    className,
                                    objectId,
                                    id,
                                    displayName,
                                    createdAt,
                                  },
                                  description,
                                  qty,
                                  rate,
                                  discountPart{
                                    type,
                                    value,
                                  },

                                  VATPart{
                                    inputType,
                                    value,
                                  },

                                }

                              }
                            }

                          },

                        },
                      },
                      amount,
                      VAT,
                      date,
                      memo,

                    }
                  }
                },

                expenses: _expenses(first: 100000){
                  totalCount,
                  total,
                  totalHT,
                  totalVAT,

                  edges{
                    node{

                      id,
                      objectId,
                      refNo,
                      accountCode,
                      type,
                      __opType : operationType,
                      expenseItem{
                        index,
                        accountCode,
                        amount,
                        VATPart{
                          inputType,
                          value,
                        },
                      },
                      expense{
                        ... on Node {

                          ... on Expense {

                            __opType: __typename,
                            createdAt,
                            id,
                            objectId,
                            payee{

                              ... on Node{

                                ... on Vendor{
                                  className,
                                  type: __typename,
                                  objectId,
                                  id,
                                  displayName,
                                  if,
                                },

                              },

                            },
                            creditToAccountCode,
                            date,
                            paymentRef,
                            paymentMethod,
                            memo,
                            files,

                            totalHT,
                            VAT,

                            inputType,

                            expenseItemsConnection{
                              totalCount,
                              amountPaid,
                              edges{
                                node{
                                  className,
                                  objectId,
                                  id,
                                  index,
                                  accountCode,
                                  description,
                                  amount,

                                  VATPart{
                                    inputType,
                                    value,
                                  },

                                },
                              }
                            },

                          },

                          ... on Bill {

                            __opType: __typename,
                            createdAt,
                            objectId,
                            id,
                            payee{
                              className,
                              type: __typename,
                              objectId,
                              id,
                              displayName,
                              image,
                              title,
                              givenName,
                              middleName,
                              familyName,
                              affiliation,
                              emails,
                              phone,
                              mobile,
                              fax,
                              mailing_streetAddress,
                              mailing_cityTown,
                              mailing_stateProvince,
                              mailing_postalCode,
                              mailing_country,
                              notes,
                              updatedAt,
                              createdAt,
                            },
                            mailingAddress,
                            terms,
                            paymentRef,
                            date,
                            dueDate,
                            memo,
                            files,

                            totalHT,
                            VAT,

                            inputType,

                            billItemsConnection{
                              totalCount,
                              totalAmount,
                              edges{
                                node{
                                  className,
                                  objectId,
                                  id,
                                  index,
                                  accountCode,
                                  description,
                                  amount,

                                  VATPart{
                                    inputType,
                                    value,
                                  },

                                }
                              }
                            },
                            billPaymentsConnection{
                              totalCount,
                              totalAmountPaid,
                              latestPayment{
                                objectId,
                                id,
                                date,
                                amount,
                              },
                              edges{
                                node{
                                  className,
                                  objectId,
                                  id,
                                  date,
                                  amount,
                                }
                              }
                            },

                          },

                        },
                      },
                      amount,
                      VAT,
                      date,
                      memo,

                    }
                  }
                },

              }

            },

            company(id: $companyId) {

              VATSettings{
                enabled,
                agency,
                startDate,
                IF,
                frequency,
                regime,
                percentages{ value, },
              },

              VATDeclaration{
                id,
                objectId,
                periodStart,
                periodEnd,

                settings{
                  agency,
                  startDate,
                  IF,
                  frequency,
                  regime,
                  percentages{ value, },
                },

              },

              objectId,

              id,
              displayName,
              periodType,
              lastTransactionIndex, lastPaymentsTransactionIndex,

              createdAt,
              updatedAt,

              settings {
                periodType,
                closureEnabled,
                closureDate,
              },
              salesSettings {
                defaultDepositToAccountCode,
                preferredInvoiceTerms,
                enableCustomTransactionNumbers,
                enableServiceDate,
                discountEnabled,

                showProducts,
                showRates,
                trackInventory,
                defaultIncomeAccountCode,
              },
              expensesSettings {
                defaultExpenseAccountCode,
                preferredPaymentMethod,
              },
              paymentsSettings {
                defaultDepositToAccountCode,
                preferredPaymentMethod,
              },

            },

            companies(first: 100000){
              edges{
                node{
                  objectId,
                  id,
                  displayName,
                  periodType,
                  lastTransactionIndex, lastPaymentsTransactionIndex,
                  createdAt,
                  updatedAt,
                }
              }
            },

          }
      `,
    },
  });
}

function createContainer({ viewer, params, company, companies, }){
  const Route = new RelayRoute({ companyId: params.app, declarationId: params.declarationId, });
  const MyComponent = wrapWithC(TVADeclaration, { params, route: Route, });

  class Container extends React.Component{
    shouldComponentUpdate(){
      return false;
    }
    render(){
      return (
        <Relay.RootContainer
          Component={MyComponent}
          forceFetch={true}
          route={Route}
          renderFetched={function(data, readyState){
            return (
              <MyComponent
                {...data}
                stale={readyState.stale}
              />
            );
          }}
          renderLoading={function() {
            return (
              <MyComponent
                {...{viewer: {
                  ...viewer,
                  company: company,
                  companies: companies || { edges: [], },
                }}}
                loading={true}
              />
            );
          }}
        />
      );
    }
  }

  return () => Container;
}

class S extends React.Component{
  constructor(props) {
    super(props);
    this.cache = new LazyCache(this, {
      Component: {
        params: [
          // props that effect how redux-form connects to the redux store
        ],
        fn: createContainer(props),
      }
    });
  }
  shouldComponentUpdate(){
    return false;
  }
  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
  }
  render() {
    const {Component} = this.cache;
    return <Component {...this.props}/>;
  }
}

module.exports = S;


function decorateExpense({ objectId, __dataID__, totalHT, VAT, inputType, id, payee, paymentRef, creditToAccountCode, paymentMethod, mailingAddress, date, expenseItemsConnection : itemsConnection, memo, files, }) {
  return {
    __dataID__,
    id,
    date,
    mailingAddress,
    paymentMethod,
    paymentRef,
    creditToAccountCode,
    type: 'Expense',
    payee,
    balanceDue: 0.0,
    total: itemsConnection.amountPaid,
    totalAmountPaid: itemsConnection.amountPaid,
    status: 'Closed',
    memo,
    files,
    totalHT, VAT, inputType,
    itemsConnection,
    objectId,
    dueDate: date,
  };
}

function decorateBill({ objectId, __dataID__, totalHT, VAT, inputType, id, payee, paymentRef, mailingAddress, terms, date, dueDate, billItemsConnection : itemsConnection, billPaymentsConnection : paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountPaid;

  function calcBillStatus() {
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

  return {
    __dataID__,
    id,
    terms,
    date,
    paymentRef,
    mailingAddress,
    type: 'Bill',
    payee,
    dueDate,
    totalAmount: itemsConnection.totalAmount,
    balanceDue,
    total: itemsConnection.totalAmount,
    totalAmountPaid: paymentsConnection.totalAmountPaid,
    status: calcBillStatus(),
    memo, files,
    totalHT, VAT, inputType,
    itemsConnection,
    paymentsConnection,
    objectId,
  };
}

function decorateSale({
  objectId, __dataID__, totalHT, VAT, id, refNo, customer, paymentRef, inputType, depositToAccountCode, paymentMethod, billingAddress, date, discountType, discountValue, saleItemsConnection : itemsConnection, memo, files, }) {
  return {
    __dataID__,
    id,
    date,
    billingAddress,
    paymentMethod,
    paymentRef,
    depositToAccountCode,
    type: 'Sale',
    refNo: parseInt(refNo),
    customer,
    discountType, discountValue,
    balanceDue: 0.0,
    total: itemsConnection.amountReceived,
    totalAmountReceived: itemsConnection.amountReceived,
    status: 'Closed',
    memo,
    files,
    totalHT, VAT,
    inputType,
    itemsConnection,
    objectId,
    dueDate: date,
  };
}

function decorateInvoice({ objectId, __dataID__, totalHT, VAT, id, refNo, customer, inputType, billingAddress, terms, date, dueDate, discountType, discountValue, invoiceItemsConnection : itemsConnection, invoicePaymentsConnection: paymentsConnection, memo, files, }) {
  const balanceDue = itemsConnection.totalAmount - paymentsConnection.totalAmountReceived;

  function calcInvoiceStatus() {
    // const _date = moment(date);
    const _dueDate = moment(dueDate);
    const now = moment();

    const isPaidInFull = balanceDue === 0.0;

    if(isPaidInFull){
      return 'Closed';
    }

    if(_dueDate.isBefore(now)){
      return 'Overdue';
    }

    // const hasPayment = paymentsConnection.totalAmountReceived !== 0;
    //
    // if(hasPayment){
    //   return 'Partial';
    // }

    return 'Open';
  }

  return {
    __dataID__,
    id,
    terms,
    date,
    billingAddress,
    type: 'Invoice',
    refNo: parseInt(refNo),
    customer,
    dueDate,
    discountType, discountValue,
    totalAmount: itemsConnection.totalAmount,
    balanceDue,
    total: itemsConnection.totalAmount,
    totalAmountReceived: paymentsConnection.totalAmountReceived,
    status: calcInvoiceStatus(),
    memo, files,
    totalHT, VAT,
    inputType,
    itemsConnection,
    paymentsConnection,
    objectId,
  };
}

function getSales({ VATDeclaration, }) {
  const sales = VATDeclaration.sales.edges;

  const list = [];

  for(let i = 0; i < sales.length; i++){
    const el = sales[i].node;

    list.push(decorateOp(el));
  }

  return list;
}


function getExpenses({ VATDeclaration, }) {
  const expenses = VATDeclaration.expenses.edges;

  const list = [];

  for(let i = 0; i < expenses.length; i++){
    const el = expenses[i].node;

    list.push(decorateOp(el));

  }

  return list;
}

function getProductItem(obj){
  // if(obj.itemsConnection.totalCount === 1){
  //   return obj.itemsConnection.edges[0].node.item.displayName;
  // }
  // return obj.memo;

  return obj.item.displayName;
}

function getExpenseItem(obj){
  // if(obj.itemsConnection.totalCount === 1){
  //   return getAccountName(obj.itemsConnection.edges[0].node.accountCode);
  // }
  // return obj.memo;

  return getAccountName(obj.accountCode)
}

const paymentMethod = {
  Cash:       'Espèces',
  Check:      'Chèque',
  Creditcard: 'Carte bancaire',
};

function decorateOp(el){
  switch (el.__opType) {
    case 'Bill':     return { ...el, expense: decorateBill(el.expense), };
    case 'Expense':  return { ...el, expense: decorateExpense(el.expense), };

    case 'Sale':     return { ...el, sale: decorateSale(el.sale), };
    case 'Invoice':  return { ...el, sale: decorateInvoice(el.sale), };
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


const VAT_VALUE_FORMATTED = {
  Value_20: '20%',
  Value_14: '14%',
  Value_10: '10%',
  Value_7: '7%',
  Value_Exempt: 'Exonéré',
};

const titleExpenses = {
  Value_20: 'TVA 20%',
  Value_14: 'TVA 14%',
  Value_10: 'TVA 10%',
  Value_7: 'TVA 7%',
  Value_Exempt: 'TVA Exonéré',
};

const key_hasVAT = {
  Value_20: true,
  Value_14: true,
  Value_10: true,
  Value_7: true,
  Value_Exempt: false,
};

const expenses_key_totals = {
  Value_20: 'TOTAL TVA 20%',
  Value_14: 'TOTAL TVA 14%',
  Value_10: 'TOTAL TVA 10%',
  Value_7: 'TOTAL TVA 7%',
  Value_Exempt: 'TOTAL TVA Exonéré',
};

import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './ProfitLoss.scss';

import classnames from 'classnames';

import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import find from 'lodash.findindex';

import Chart from '../../utils/highcharts/highcharts';

import uniq from 'lodash.uniq';

import { Dates, } from './utils';

import {
  intlShape,
} from 'react-intl';

import messages from '../messages';

import moment from 'moment';

const CHART_COLORS = [
  '#b9e88b',
  '#fac786',
  '#80eeef',
  '#dfb3eb',
  '#fd9fb0'
];

const MONOCHROME_COLORS = [
  '#3b2c48',
  '#e0e0ea'
];

@CSSModules(styles, {allowMultiple: true})
export default class ProfitLoss extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  constructor(props, context){
    super(props, context);

    this.dates = Dates(this.context.intl);
    this.state = {
      date: this.props.date,
      ...(function(self){
        const index = find(self.dates, ({id}) => id === self.props.date);
        const d = self.dates[index];
        return { ...d.getValue(), id: d.id, name: d.name, };
      }(this)),
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.state.date !== nextProps.date){
      this.setState({
        date: nextProps.date,
        ...(function(self){
          const index = find(self.dates, ({id}) => id === nextProps.date);
          const d = self.dates[index];
          return { ...d.getValue(), id: d.id, name: d.name, };
        }(this)),
      });
    }
  }
  _onDate = ({ id, from, to, }) => {
    this.props.onDate({ date: id, from, to, }, this._onReadyStateChange);
  };
  _onReadyStateChange = ({done}) => {
    this.__onReadyStateChange = done;
  };
  shouldComponentUpdate(){
    if(typeof this.__onReadyStateChange !== 'undefined'){
      return this.__onReadyStateChange;
    }

    return true;
  }
  render() {
    const { date, id, name, from, to, } = this.state;
    const { styles, loading, company, viewer, } = this.props;
    const {intl,} = this.context;

    const isLoading = typeof this.__onReadyStateChange === 'undefined' ? loading : !this.__onReadyStateChange;

    const {
      categories,
      totalExpenses,
      totalSales,
      sales,
      expenses,
      result,
    } = isLoading ? { categories: [], totalExpenses: 0, totalSales: 0, sales: [],
    expenses: [],
    result: [] , } : getTotal(intl, company);

    return (
      <div styleName={classnames('module profitLoss', {loading: isLoading})}>

        <div>

          <div styleName='reportlist'>

            <div>

              <div styleName='stage stage-default'>

                <div styleName='stage-header'>

                  <span styleName='page-title'>{intl.formatMessage(messages['ProfitLossTitle'])}</span>

                  {/*<button type='button' styleName='button dijitDropDownButton dateSelector'
                          style={{WebkitUserSelect: 'none', display: 'none'}}>
                    <span>{intl.formatMessage(messages['LastXDays'], {days: 30})}</span>
                    <span styleName='caret'></span>
                  </button>*/}

                  {renderActions(this, { intl, styles, date: { date, id, name, from, to, }, })}

                </div>

                <div styleName='stage-content reportsStage'>

                  <div styleName='chartTable'>

                    <div styleName='floatLeft reportChartNumbers'>

                      <div styleName='reportChartDescription '>
                        <div styleName='netProfitValue'>{intl.formatNumber(totalSales - totalExpenses, { format: 'MAD', })}</div>
                        <div styleName='netProfitText'>{intl.formatMessage(messages['NetIncomeTitle'])}&nbsp;&nbsp;&nbsp;</div>
                      </div>

                      <div styleName='reportChartDescription incomeExpenseChart'>
                        <div styleName='totalIncomeSection'>
                          <div styleName='incomeValue'>{intl.formatNumber(totalSales, { format: 'MAD', })}</div>
                          <div styleName='incomeText'>{intl.formatMessage(messages['IncomeTitle'])}</div>
                        </div>
                        <div styleName='totalExpensesSection'>
                          <div styleName='expensesValue'>{intl.formatNumber(totalExpenses, { format: 'MAD', })}</div>
                          <div styleName='expensesText'>{intl.formatMessage(messages['ExpensesTitle'])}</div>
                        </div>
                      </div>

                    </div>

                    <div styleName='rightAligned reportChartTD floatLeft '>

                      <div styleName='mainChartContainer'>

                        <div styleName='highcharts-container'
                             style={{}}>

                          {isLoading || company.dashboard__Result.edges.length === 0 ? null : <Chart
                            config={{
                              chart: {
                                width: 600,
                                height: 200,
                              },
                              title: {
                                  text: null,
                              },
                              xAxis: [{
                                categories,
                                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                //     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                crosshair: [ false, false, true],

                                lineWidth: 0,
                                minorGridLineWidth: 0,
                                lineColor: 'transparent',

                                minorTickLength: 0,
                                tickLength: 0,
                              }],
                              yAxis: [{ // Primary yAxis
                                  labels: {
                                      // format: '{value}k',
                                      formatter: function(){
                                        // return intl.formatNumber(this.value, { format: 'MONEY', });
                                        return (this.value / 1000) + 'k';
                                      },
                                      style: {
                                          color: Highcharts.getOptions().colors[1]
                                      }
                                  },
                                  title: {
                                      text: null,
                                  }
                              }, {
                              opposite: true,
                              title: {
                                      text: null,
                                  }
                              }],
                              credits: {
                                enabled: false
                              },
                              // tooltip: {
                              //     // shared: true
                              // },
                              legend: {
                                  enabled: false,
                              },
                              plotOptions: {
                                  series: {
                                      stacking: 'normal'
                                  }
                              },
                              series: [{
                                  name: 'Chiffres d\'affaires',
                                  type: 'column',
                                  data: sales, // [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                                  tooltip: {
                                    enabled: false,
                                  },
                              }, {
                                  name: 'Dépenses',
                                  type: 'column',
                                  data: expenses, // [-7.0, -6.9, -9.5, -14.5, -18.2, -21.5, -25.2, -26.5, -23.3, -18.3, -13.9, -9.6],
                                  tooltip: {
                                    enabled: false,
                                  },
                              }, {
                                  name: 'Résultat',
                                  type: 'line',
                                  color: '#000',
                                  data: result, // [7.0, -6.9, 9.5, -14.5, 18.2, -21.5, -25.2, 26.5, -23.3, 18.3, 13.9, -9.6],
                                  tooltip: {
                                    useHTML: true,
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    borderColor: 'black',
                                    borderRadius: 0,
                                    borderWidth: 0,
                                    formatter: function() {
                                      return [
                                        '<div style="display: table;padding:30px;z-index:1;">',
                                          '<div style="display: table-row;color: #fff;">' + intl.formatNumber(this.y, { format: 'MAD', }) + '</div>',
                                          '<br/>',
                                          '<div style="display: table-row;color: #fff;">' + this.point.name + '</div>',
                                        '</div>'
                                      ].join('');
                                    }
                                  },
                              }]
                            }}
                          />}

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
    );
  }
}

function renderActions(self, { intl, styles, date: { name, }, }){
  return (
      <Dropdown className={styles['floatRight']}>

        <Dropdown.Toggle title={name} className={`${styles['fancyText']} ${styles['ddijitDropDownButton']} ${styles['bbutton']}  ${styles['unselectable']} `}/>

        <Dropdown.Menu>
          {self.dates.map(({ id, getValue, name}) => {
            return (
              <MenuItem
                onSelect={() => self._onDate({ id, name, ...getValue(), })}
                eventKey={id}>{name}</MenuItem>
            );
          })}
        </Dropdown.Menu>

      </Dropdown>
  );
}

function getTotal(intl,{ dashboard__Result, }){
  let totalDEBIT_Expenses = 0;
  let totalCREDIT_Expenses = 0;

  let totalDEBIT_Sales = 0;
  let totalCREDIT_Sales = 0;

  const categories = [];
  const sales = {};
  const expenses = {};
  const result = {};

  const now = moment().year();

  dashboard__Result.edges.forEach(({ node: { date, categoryCode, type, amount, }, }) => {

    const key = function(){
      const mDate = moment(date);
      return mDate.year() === now ? mDate.format('ll').replace(` ${mDate.year()}`, '') : mDate.format('ll');
    }();

    categories.push(
      key
    );

    if(categoryCode === '6.1'){

      if(!expenses[key]){
        expenses[key] = {
            name: key,
            y: 0.0,
        };
      }

      if(!result[key]){
        result[key] = {
            name: key,
            y: 0.0,
        };
      }

      switch(type){
        case 'DEBIT':
          totalDEBIT_Expenses += amount;
          expenses[key].y += amount;
          result[key].y -= amount;
          break;

        case 'CREDIT':
          totalCREDIT_Expenses += amount;
          expenses[key].y -= amount;
          result[key].y += amount;
          break;
      }
      return;
    }

    if(categoryCode === '7.1'){

      if(!sales[key]){
        sales[key] = {
            name: key,
            y: 0.0,
        };
      }

      if(!result[key]){
        result[key] = {
            name: key,
            y: 0.0,
        };
      }

      switch(type){
        case 'DEBIT':
          totalDEBIT_Sales += amount;
          sales[key].y += amount;
          result[key].y -= amount;
          break;

        case 'CREDIT':
          totalCREDIT_Sales += amount;
          sales[key].y -= amount;
          result[key].y += amount;
          break;
      }

      return;
    }

    throw 'Invalid categoryCode';
  });

  return {
    categories: uniq(categories),
    totalExpenses: totalDEBIT_Expenses - totalCREDIT_Expenses,
    totalSales: totalCREDIT_Sales - totalDEBIT_Sales,
    expenses: Object.keys(expenses).map(key => ({ ...expenses[key], y: -1 * expenses[key].y, })),
    sales: Object.keys(sales).map(key => ({ ...sales[key], y: -1 * sales[key].y, })),
    result: Object.keys(result).map(key => result[key]),
  };
}

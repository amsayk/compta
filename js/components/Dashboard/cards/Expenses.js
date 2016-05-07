import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './Expenses.scss';

import classnames from 'classnames';

import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import find from 'lodash.findindex';

import getAccountName from '../../../utils/getAccountName';

import Chart from '../../utils/highcharts/highcharts';

import padEnd from 'lodash.padend';

import {
  intlShape,
} from 'react-intl';

import messages from '../messages';

import { Dates, } from './utils';

@CSSModules(styles, {allowMultiple: true})
export default class Expenses extends Component {
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
    const { styles, privateMode, loading, company, viewer, } = this.props;
    const {intl,} = this.context;

    const isLoading = typeof this.__onReadyStateChange === 'undefined' ? loading : !this.__onReadyStateChange;

    const { total, data, } = isLoading ? { total: 0, data: [], } : getTotal(company);

    return (
      <div styleName={classnames('module expenses', {loading: isLoading})}>

        <div styleName='header'>

          <div styleName='title inlineBlock'>{intl.formatMessage(messages['ExpensesTitle'])}</div>

          {/*<div styleName='floatRight fancyText' style={{display: 'none'}}>{intl.formatMessage(messages['LastXDays'], {days: 365})}</div>*/}

          {/*<button styleName='ftuMessage' className='btn btn-link' role='button' tabIndex='0'>{intl.formatMessage(messages['EnterExpense'])}</button>*/}
          {privateMode ? null : renderActions(this, { intl, styles, date: { date, id, name, from, to, }, })}

          <div styleName='clear'></div>

        </div>

        <div styleName='moduleContent'>

          <div styleName='subContainer expenseValues'>
            <div styleName='moneySection' className='paid'>
              {privateMode ? null : <div styleName='fancyMoney'>{intl.formatNumber(total, { format: 'MAD', })}</div>}
              <div styleName='fancyText upperCase'>{name}</div>
            </div>
          </div>

          <div styleName='subContainer expenseCategories' style={{ marginTop: -45, }}>

            <div styleName='chartContainer' style={{}}>

              <div styleName='chart inlineBlock' style={{}}>

                  <div styleName='highcharts-container'>

                      {isLoading || company.dashboard__Expenses.edges.length === 0 ? null : <Chart
                        config={{
                          chart: {
                              plotBackgroundColor: null,
                              plotBorderWidth: null,
                              plotShadow: false,
                              type: 'pie',

                              width: 600,
                              height: 200,
                          },
                          credits: {
                            enabled: false
                          },
                          legend: {
                              enabled: true,
                              layout: 'vertical',
                              align: 'left',
                              verticalAlign: 'middle',
                              useHTML: true,
                              labelFormatter: function() {
                                return [
                                  '<div style="width:350px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">',
                                    '<span title="'+this.name+'" style="vertical-align:middle;float:left;width:200px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + this.name + '</span>',
                                    '<span style="vertical-align:middle;float:right;padding-left:12px;width:150px;max-width:150px;min-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (privateMode ? padEnd(intl.formatNumber(this.percentage / 100, { style: 'percent', }), 3) : intl.formatNumber(this.y, { format: 'MAD', })) + '</span>',
                                  '</div>'
                                ].join('');
                      				},
                          },
                          title:{text: null},
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
                                  '<div style="display: table-row;color: #fff;">' + (privateMode ? intl.formatNumber(this.percentage / 100, { style: 'percent', }) : intl.formatNumber(this.y, { format: 'MAD', })) + '</div>',
                                  '<br/>',
                                  '<div style="display: table-row;color: #fff;">' + this.point.name + '</div>',
                                '</div>'
                              ].join('');
                            }
                          },
                          plotOptions: {
                              pie: {
                                  allowPointSelect: true,
                                  cursor: 'pointer',
                                  dataLabels: {
                                      enabled: false,
                                  },
                                  showInLegend: true,
                              }
                          },
                          series: [{
                              name: 'Dépenses',
                              colorByPoint: true,
                              data: /*isLoading ? [{
                                  name: 'Catégorie 1',
                                  y: 56.33
                              }, {
                                  name: 'Catégorie 2',
                                  y: 24.03,
                                  // sliced: true,
                                  // selected: true
                              }, {
                                  name: 'Catégorie 3',
                                  y: 10.38
                              }, {
                                  name: 'Catégorie 4',
                                  y: 4.77
                              }, {
                                  name: 'Catégorie 5',
                                  y: 0.91
                              }, {
                                  name: 'Catégorie 6',
                                  y: 0.2
                              }] : */data,
                          }]
                        }}
                      />}

                  </div>

              </div>

            </div>

          </div>

          <div styleName='clear'></div>

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

function getTotal({ dashboard__Expenses, }){
  let totalDEBIT = 0;
  let totalCREDIT = 0;

  const data = {};

  dashboard__Expenses.edges.forEach(({ node: { type, accountCode, amount, }, }) => {

    if(!data[accountCode]){
      data[accountCode] = {
          name: getAccountName(accountCode),
          y: 0.0,
      };
    }

    switch(type){
      case 'DEBIT':
        totalDEBIT += amount;
        data[accountCode].y += amount;
        break;

      case 'CREDIT':
        totalCREDIT += amount;
        data[accountCode].y -= amount;
        break;
    }

  });

  return {
    total: totalDEBIT - totalCREDIT,
    data: Object.keys(data).map(key => data[key]),
  };
}

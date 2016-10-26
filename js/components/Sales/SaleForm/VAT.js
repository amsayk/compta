import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './SaleForm.scss';

import CSSModules from 'react-css-modules';

import getFieldValue from '../../utils/getFieldValue';

import group from 'lodash.groupby';
import map from 'lodash.map';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import stopEvent from '../../../utils/stopEvent';

const MAX = 100;

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

const VAT_ID_TO_TEXT = {
  Value_20: `20%`,
  Value_14: `14%`,
  Value_10: `10%`,
  Value_Exempt: `Exonéré`,
  Value_7: `7%`,
};

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {
  static displayName = 'VAT';
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const {intl,} = this.context;
    const { styles, store, fields: { discountType, discountValue, submitting, dirty, pristine,},} = this.props;

    return (

      <div styleName={'width_x'} className='row' style={{ paddingTop: 0, paddingBottom: 15, }}>

        <div className='col-sm-12 first-col last-col'>

          {map(group(store.getCompletedLinesWithValidVATPart(), ({ VATPart, }) => VATPart.value), function (items, key) {

            const { totalHT, totalVAT, } = items.reduce(function ({ totalHT, totalVAT, }, { qty, rate, VATPart : { value, inputType : itemInputType, } }) {

              const entryValue = qty * rate;

              const VAT_percentage = value ? VAT_ID_TO_VALUE[value] : 0.0;

              switch (itemInputType){
                case 1:
                case 'HT':

                  // entryValue is HT
                  totalHT += entryValue;
                  totalVAT += VAT_percentage * entryValue;

                  break;

                case 2:
                case 'TTC':

                  // entryValue is TTC
                  (function () {

                    const entryValueHT = entryValue / (1 + VAT_percentage);

                    totalHT += entryValueHT;
                    totalVAT += VAT_percentage * entryValueHT;

                  })();

                  break;

                case 3:
                case 'NO_VAT':

                  totalHT += entryValue;
                  totalVAT += VAT_percentage * entryValue;

                  break;

                default:

                  throw new Error(`VAT component: Invalid item inputType`, itemInputType);
              }

              return {totalHT, totalVAT,};
            }, { totalHT: 0.0, totalVAT: 0.0, });

            return (
              <div className={`row ${styles['VAT--row']}`} style={{ height: 45, padding: 0, }}>

                <div className={`${styles['subsection12TitleText']} col-sm-8 first-col`} style={{ textAlign: 'right', borderRight: '1px dotted #c7c7c7', height: 45, padding: 0, }}>
                  <div style={{ margin: '5px auto', }}>
                    TVA de {VAT_ID_TO_TEXT[key]} sur {intl.formatNumber(totalHT, { format: 'MONEY', })}
                  </div>
                </div>

                <div className='col-sm-4 last-col' style={{textAlign: 'right', }}>
                  <input className='form-control' style={{ margin: '5px auto', display: 'inline-block', textAlign: 'right', maxWidth: 125, }} type='text' value={intl.formatNumber(totalVAT, { format: 'MONEY', })}/>
                </div>

              </div>
            )
          })}

        </div>

      </div>

    );
  }
}

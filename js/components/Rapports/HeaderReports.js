import React, {Component, PropTypes} from 'react';
import Relay from 'react-relay';

import messages from './messages';

import stopEvent from '../../utils/stopEvent';

import ProfitLoss from './items/ProfitLoss';

import {
  intlShape,
} from 'react-intl';

export default class extends React.Component{
  static displayName = 'HeaderReports';

  static propTypes = {
    topLoading: PropTypes.bool.isRequired,
    styles: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  render(){
    const {intl,} = this.context;
    const { company,  viewer, styles, } = this.props;
    const loading = this.props.topLoading;
    const stale = this.props.stale;
    return (
      <div className={''}>

        <div className={`${styles['table']} ${styles['moneyBar']}`}>

          <div className={styles['tableRow']}>

            <div className={`${styles['tableCell']}`}>

              <ProfitLoss
                stale={stale}
                loading={loading || stale}
                company={company}
                viewer={viewer}
              />


            </div>


          </div>

        </div>

      </div>
    )
  }
}

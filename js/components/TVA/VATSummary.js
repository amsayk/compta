import React, {Component, PropTypes} from 'react';

import CSSModules from 'react-css-modules';

import styles from './VATSummary.scss';

import moment from 'moment';

import {
  intlShape,
}  from 'react-intl';
import stopEvent from "../../utils/stopEvent";

import VATForm from './TVAForm/TVAForm';

import { editStart, editStop, } from '../../redux/modules/vat';

@CSSModules(styles, {allowMultiple: true})
export default class VATSummary extends React.Component {
  static contextTypes = {
    intl: intlShape.isRequired,
    router: PropTypes.object.isRequired,
  };
  state = {
    modalOpen: false,
  };
  _onPage = (page, e) => {
    stopEvent(e);

    const { router, } = this.context;

    const { company, } = this.props;
    const { objectId : id, periodStart, periodEnd, } = company.VATDeclaration;

    switch (page){
      case 'declaration':

        router.push({
          pathname: `/apps/${company.id}/vat/declaration/${id}`,
          state: {},
        });
        break;

      case 'history':

        router.push({
          pathname: `/apps/${company.id}/vat/history`,
          state: {},
        });
        break;

      case 'settings':

        editStart('ConfigureVAT');

        this.setState({
          modalOpen: true,
        });
        break;
    }
  };
  _close = () => {

    editStop('ConfigureVAT');

    this.setState({
      modalOpen: false,
    });
  };
  _renderSettings = () => {
    if(this.state.modalOpen){
      return (
        <VATForm viewer={this.props.viewer} company={this.props.company} formKey={'ConfigureVAT'} onRest={this._close}/>
      );
    }

    return null;
  };
  render() {
    const { intl, } = this.context;
    const {
      objectId : id,
      periodStart,
      periodEnd,

      report: {
        sales: { totalVAT : salesTotalVAT, },
        expenses: { totalVAT : expensesTotalVAT, },
      },

    } = this.props.company.VATDeclaration;
    return (
      <div styleName={'agencyWidgetClass'}>

        <div styleName={'agencyWidgetContainer-wrapper'}>

          <div styleName='agencyWidgetContainer'>

            <div styleName='tableRow'>

              <div styleName={'agencyWidgetLeftPanel dataSection'}>

                <div styleName='taxNameClass'>TVA due</div>

                <div styleName='balanceDueClass'>
                  <div styleName='positiveBalance'>{intl.formatNumber(salesTotalVAT - expensesTotalVAT, { format: 'MAD', })}</div>
                </div>

                <div styleName='simpleTextClass'>Fin de la période: {moment(periodEnd).format('ll').replace(moment().year(), '')}</div>
              </div>

              <div styleName={'agencyWidgetRightPanel dataSection rightTopRoundedCorner'}>

                <div styleName='rightHeader'>
                  <div styleName='panelHeaderClass rightPanelHeader'>Répartition de la balance</div>
                </div>

                <div styleName='chartClass'>

                  <div styleName='highcharts-container'>

                    <div styleName="table" style={{ width: 225, paddingLeft: 15, }}>

                      <div styleName="tableRow">

                        <div styleName="tableCell" style={{ textAlign: 'left', }}>
                          <div style={{ padding: '10px 0 0', }}>TVA sur ventes</div>
                        </div>

                        <div styleName="tableCell" style={{ textAlign: 'right', }}>
                          <div style={{ padding: '10px 0 0', }}>{intl.formatNumber(salesTotalVAT, { format: 'MAD', })}</div>
                        </div>

                      </div>

                      <div styleName="tableRow" style={{ marginTop: 3, }}>

                        <div styleName="tableCell" style={{ textAlign: 'left', }}>
                          <div style={{ padding: '10px 0 0', }}>TVA sur achats</div>
                        </div>

                        <div styleName="tableCell" style={{ textAlign: 'right', }}>
                          <div style={{ padding: '10px 0 0', }}>{intl.formatNumber(expensesTotalVAT, { format: 'MAD', })}</div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div styleName='tableRow'>

              <div styleName='agencyWidgetLeftPanel'>
                <div styleName='linkSection'>
                  <div styleName='linkClass'>

                  </div>
                </div>
              </div>

              <div styleName='agencyWidgetRightPanel rightBottomRoundedCorner'>

                <div styleName='linkSection'>

                  <div styleName='linkClass'>
                    <a onClick={this._onPage.bind(this, 'declaration')}>
                      Préparer la déclaration
                    </a>
                  </div>

                  <div styleName='linkClass rightPanelLink'>
                    <a onClick={this._onPage.bind(this, 'history')}>
                      Voir l'historique
                    </a>
                  </div>

                  <div styleName='linkClass rightPanelLink'>
                    <a onClick={this._onPage.bind(this, 'settings')}>
                      Paramètres
                    </a>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {this._renderSettings()}
      </div>
    );
  }
}

import React, { PropTypes, } from 'react';

import Parse from 'parse';

import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import pick from 'lodash.pick';

import moment from 'moment';

import messages from './TVAForm/messages';

import * as actions from '../../../../redux/modules/vat';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../../utils/unbeforeunload';

import LoadingActions from '../../../Loading/actions';

import stopEvent from '../../../../utils/stopEvent';

import Actions from '../../../confirm/actions';

import Combobox from 'react-widgets/lib/Combobox';

import getFieldValue from '../../../utils/getFieldValue';

import { createValidator, required, email, url, } from '../../../../utils/validation';

import classnames from 'classnames';

import {
  intlShape,
} from 'react-intl';

import styles from './TVAForm/TVAForm.scss';

import CSSModules from 'react-css-modules';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

import validation, {} from './TVAForm/validation';

@reduxForm({
    form: 'company',
    fields: [
      'id',

      'VATEnabled',

      'agency',
      'IF',
      'startDate',
      'regime',
      'frequency',
    ],
    validate: validation,
  }, (state, ownProps) => ({
    saveError: state.companies.saveError,
    initialValues: {
      VATEnabled: ownProps.data.VATSettings
        ? ownProps.data.VATSettings.enabled
        : false,

      startDate: ownProps.data.VATSettings && ownProps.data.VATSettings.enabled
        ? capitalizeFirstLetter(moment.months()[moment(ownProps.data.VATSettings.startDate).month()])
        : capitalizeFirstLetter(moment.months()[0]),

      regime: ownProps.data.VATSettings && ownProps.data.VATSettings.enabled
        ? REGIME_TO_ID[ownProps.data.VATSettings.regime]
        : 1,

      frequency: ownProps.data.VATSettings && ownProps.data.VATSettings.enabled
        ? ownProps.data.VATSettings.frequency
        : 'MONTHLY',
    },
  }),
  dispatch => bindActionCreators(actions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class VATSettings extends React.Component{
  constructor(...args){
    super(...args);

    this.props.onRef(this);

    this.props.company && this.props.editStart(this.props.company.id);
  }
  static propTypes = {
    company: PropTypes.object,
    viewer: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const {intl, store, } = this.context;

    const {
      asyncValidating,
      dirty,
      formKey,
      editStop,
      fields: {
        id,

        VATEnabled,

        agency,
        IF,
        startDate,
        regime,
        frequency,
      },
      handleSubmit,
      valid,
      invalid,
      pristine,
      save,
      update,
      submitting,
      saveError: {[formKey]: saveError},
      values,

      onCancel,
    } = this.props;

    const VATEnabledValue = getFieldValue(VATEnabled);

    return (
      <div>
        <div styleName='tableRow'>

          <div styleName='tableCell settingContent'>

            <div style={{padding: '0 45px'}}>

              {saveError && <div styleName='error'>{intl.formatMessage({ ...saveError, id: saveError._id, })}</div>}

              <div>

                <div style={{textAlign: 'left'}}>

                  <div className='checkbox' styleName={'sales row'}>

                    <label style={{ display: 'inline-block', }}>
                      <input style={{ margin: 0, }} {...VATEnabled} styleName={classnames('input', { checked: VATEnabledValue, })} value={'VATEnabled'} checked={VATEnabledValue} type='checkbox'/>
                      <div style={{ verticalAlign: 'sub', marginLeft: 25, }}>Je suis assujeti à la TVA</div>
                    </label>

                  </div>

                  {VATEnabledValue && <div className="has-VAT">

                    <div className={classnames('form-group row')}>

                      <label htmlFor='agency' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_Agency'])}</label>

                      <div className='col-sm-8'>

                        <input
                          disabled={submitting}
                          {...agency}
                          value={getFieldValue(agency, '')}
                          type='text'
                          className={classnames('form-control')}
                          id='webSite'
                        />

                      </div>

                    </div>

                    <div className={classnames('form-group row', { 'has-danger': IF.touched && IF.invalid, })}>

                      <label htmlFor='IF' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_IF'])}</label>

                      <div className='col-sm-8'>

                        <input
                          autoFocus
                          disabled={submitting}
                          {...IF}
                          value={getFieldValue(IF, '')}
                          type='text'
                          className={classnames('form-control', { 'form-control-danger': IF.touched && IF.invalid, })}
                          id='webSite'
                        />

                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='startDate' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_startDate'])}</label>

                      <div className='col-sm-8' style={{textAlign: 'left'}}>

                        <Combobox
                          caseSensitive={false}
                          filter={'contains'}
                          data={moment.months().map(capitalizeFirstLetter)}
                          value={getFieldValue(startDate)}
                          onChange={value => {
                            if(!value){
                              startDate.onChange(startDate.initialValue);
                              return;
                            }
                            startDate.onChange(value);
                          }}
                          // textField='name'
                          // valueField='id'
                          disabled={submitting}
                          className={classnames('no-new')}
                          // groupBy={ person => person.name.length }
                          // groupComponent={GroupByLength}
                          // itemComponent={GroupByLength}
                        />

                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='regime' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_regime'])}</label>

                      <div className='col-sm-8' style={{textAlign: 'left'}}>

                        <Combobox
                          data={REGIMES}
                          value={getFieldValue(regime)}
                          onChange={value => {
                            if(!value){
                              regime.onChange(regime.initialValue);
                              return;
                            }
                            regime.onChange(value);
                          }}
                          textField={item => intl.formatMessage(messages[`Regime_${item}`])}
                          // valueField='id'
                          disabled={submitting}
                          className={classnames('no-new')}
                          // groupBy={ person => person.name.length }
                          // groupComponent={GroupByLength}
                          // itemComponent={GroupByLength}
                        />

                      </div>

                    </div>

                    <div className='form-group row'>

                      <label htmlFor='frequency' style={{ paddingLeft: 0, }} styleName='subsection14TitleText settingName' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_frequency'])}</label>

                      <div className='col-sm-8' style={{textAlign: 'left'}}>

                        <Combobox
                          data={FREQUENCIES}
                          value={getFieldValue(frequency)}
                          onChange={value => {
                            if(!value){
                              frequency.onChange(frequency.initialValue);
                              return;
                            }
                            frequency.onChange(value);
                          }}
                          textField={item => intl.formatMessage(messages[item])}
                          // valueField='id'
                          disabled={submitting}
                          className={classnames('no-new')}
                          // groupBy={ person => person.name.length }
                          // groupComponent={GroupByLength}
                          // itemComponent={GroupByLength}
                        />

                      </div>

                    </div>

                  </div>}

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }
}

const FREQUENCIES = [
  'MONTHLY',
  'QUARTERLY',
];

const REGIMES = [
  1,
  2,
];

const REGIME_TO_ID = {
  Standard: 1,
  Debit: 2,
}
const REGIME_ID_TO_VALUE = {
  1: 'Standard',
  2: 'Debit',
}

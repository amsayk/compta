import React, {Component, PropTypes} from 'react';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import validation, {} from './validation';
import * as actions from '../../../redux/modules/vat';

import Alert from '../../Alert/Alert';

import LoadingActions from '../../Loading/actions';

import moment from 'moment';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import stopEvent from '../../../utils/stopEvent';

import Modal from 'react-bootstrap/lib/Modal';

import Combobox from 'react-widgets/lib/Combobox';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

import {
  intlShape,
} from 'react-intl';

import classnames from 'classnames';

import messages from './messages';

import CSSModules from 'react-css-modules';

import styles from './TVAForm.scss';
import getFieldValue from "../../utils/getFieldValue";

@reduxForm({
  form: 'VAT',
  fields: [
    'id',

    'agency',
    'IF',
    'startDate',
    'regime',
    'frequency',
  ],
  validate: validation,
  asyncBlurFields: [],
  destroyOnUnmount: true,
}, (state, ownProps) => ({
  editing: state.vat.editing,
  saveError: state.vat.saveError,
  initialValues: ownProps.company.VATSettings.enabled ? {
    ...ownProps.company.VATSettings,
    regime: REGIME_TO_ID[ownProps.company.VATSettings.regime],
    startDate: capitalizeFirstLetter(moment.months()[moment(ownProps.company.VATSettings.startDate).month()]),
  } : {
    startDate: capitalizeFirstLetter(moment.months()[0]),
    regime: 1,
    frequency: 'MONTHLY',
  },
}), dispatch => bindActionCreators(actions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class TVAForm extends React.Component{

  _onSave = () => {
    return this.props.handleSubmit((data) => {

      const serverData = {
        agency: data['agency'],
        frequency: data['frequency'],
        startDate: moment().month(data['startDate']).startOf('month').toDate(),
        regime: REGIME_ID_TO_VALUE[data['regime']],
        IF: data['IF'],
      };

      return new Promise((resolve, reject) => {
        LoadingActions.show();

        this.props.setupVAT({ ...serverData, viewer: this.props.viewer, company: this.props.company, declarations: this.props.company.VATDeclarationHistory, })
          .then(result => {

            LoadingActions.hide();

            if (result && typeof result.error === 'object') {
              return resolve();
            }

            this._handleClose();
            resolve();
         });

      });

    });
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  componentDidMount() {
    ga('send', 'pageview', '/modal/app/vat/configure');
  }

  _handleClose = (e) => {
    if(e){
      stopEvent(e);
    }

    setImmediate(() => {
      this.props.onRest();
    });
  };

  render() {
    const self = this;

    const {
      formKey,
      styles,
      loading,

      fields: {
        id,

        agency,
        IF,
        startDate,
        regime,
        frequency,
      },

      saveError: {
        [formKey]: saveError,
      },

      submitting,
      valid,
      invalid,
      pristine,
      dirty,
      values,

    } = this.props;

    const {intl,} = this.context;

    return (
      <Modal dialogClassName={`${styles['modal']} ${styles['mini']} vat-form`}
             dialogComponentClass={Dialog}
             ref={ref => this._dialog = ref}
             animation={false}
             className={classnames({'vat-form': true, [styles['vat-form'] || '']: true, })}
             show={true} keyboard={true} backdrop={true} onHide={() => this._handleClose()} autoFocus enforceFocus>

        <Modal.Header closeButton>
          <h3>
            {intl.formatMessage(messages['Title'])}
          </h3>

        </Modal.Header>

        <Body>

        <div styleName='table stretch'>

          <div styleName=''>

            <div>

              <div className='the-container table' style={{ padding: '50px 30px 0 0', }}>

                <div style={{}}>

                  {saveError && <Alert title={intl.formatMessage(messages['ErrorTitle'])} type={'error'}>{intl.formatMessage({ ...saveError, id: saveError._id, })}</Alert>}

                  <div>

                    <div className={classnames('form-group row')}>

                      <label htmlFor='agency' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_Agency'])}</label>

                      <div className='col-sm-8'>

                        <input
                          autoFocus
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

                      <label htmlFor='IF' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_IF'])}</label>

                      <div className='col-sm-8'>

                        <input
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

                      <label htmlFor='startDate' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_startDate'])}</label>

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

                      <label htmlFor='regime' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_regime'])}</label>

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

                      <label htmlFor='frequency' styleName='alignRight' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['label_frequency'])}</label>

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

                  </div>

                </div>

              </div>

            </div>


          </div>

        </div>

        </Body>

        <Modal.Footer>

          <div styleName='' style={{}}>

            <button
              style={{minWidth: 70}}
              disabled={submitting || pristine}
              styleName='btn primary floatRight'
              onClick={this._onSave()} className='unselectable'>{intl.formatMessage(messages['Done'])}</button>

          </div>

        </Modal.Footer>

      </Modal>
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

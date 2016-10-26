import React, { PropTypes, } from 'react';

import Parse from 'parse';

import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import pick from 'lodash.pick';

import messages from './messages';

import * as companyActions from '../../../../redux/modules/companies';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../../utils/unbeforeunload';

import LoadingActions from '../../../Loading/actions';

import Actions from '../../../confirm/actions';

import getFieldValue from '../../../utils/getFieldValue';

import { createValidator, required, email, url, } from '../../../../utils/validation';

import classnames from 'classnames';

import {
  intlShape,
} from 'react-intl';

import styles from './styles.scss';

import CSSModules from 'react-css-modules';

const companyValidation = createValidator({
});

@reduxForm({
    form: 'company',
    fields: [
      'id',
      'ice',
      'rc',
      'patente',
      'cnss',
      'banque',
      'rib',
    ],
    validate: companyValidation,
  }, (state, ownProps) => ({
    saveError: state.companies.saveError,
    initialValues: {
      ...ownProps.data,
    },
  }),
  dispatch => bindActionCreators(companyActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class MoreInfo extends React.Component{
  constructor(...args){
    super(...args);

    this.props.onRef(this);
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
        ice,
        rc,
        patente,
        cnss,
        banque,
        rib,
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

    return (
      <div>
        <div styleName='tableRow'>

          <div styleName='tableCell settingContent'>

            <div style={{padding: '0 45px'}}>

              {saveError && <div styleName='error'>{intl.formatMessage({ ...saveError, id: saveError._id, })}</div>}

              <div>

                <div style={{textAlign: 'left'}}>

                  <div className='form-group row'>

                    <label htmlFor='if' styleName='settingLabel' className='col-sm-4 form-control-label'>{'ICE'}</label>

                    <div className='col-sm-8'>
                      <input autoFocus disabled={submitting} {...ice} value={getFieldValue(ice, '')} autoFocus type='text' className='form-control' id='ice'/>
                    </div>

                  </div>

                  <div className='form-group row'>

                    <label htmlFor='rc' styleName='settingLabel' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['RC'])}</label>

                    <div className='col-sm-8'>
                      <input disabled={submitting} {...rc} value={getFieldValue(rc, '')} type='text' className='form-control' id='rc'/>
                    </div>

                  </div>

                  <div className='form-group row'>

                    <label htmlFor='patente' styleName='settingLabel' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Patent'])}</label>

                    <div className='col-sm-8'>
                      <input disabled={submitting} {...patente} value={getFieldValue(patente, '')} type='text' className='form-control' id='patente'/>
                    </div>

                  </div>

                  <div className='form-group row'>

                    <label htmlFor='cnss' styleName='settingLabel' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['CNSS'])}</label>

                    <div className='col-sm-8'>
                      <input disabled={submitting} {...cnss} value={getFieldValue(cnss, '')} type='text' className='form-control' id='cnss'/>
                    </div>

                  </div>

                  <div className='form-group row'>

                    <label htmlFor='banque' styleName='settingLabel' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['Banque'])}</label>

                    <div className='col-sm-8'>
                      <input disabled={submitting} {...banque} value={getFieldValue(banque, '')} type='text' className='form-control' id='banque'/>
                    </div>

                  </div>

                  <div className='form-group row'>

                    <label htmlFor='rib-bancaire' styleName='settingLabel' className='col-sm-4 form-control-label'>{intl.formatMessage(messages['RIB'])}</label>

                    <div className='col-sm-8'>
                      <input disabled={submitting} {...rib} value={getFieldValue(rib, '')} type='text' className='form-control' id='rib-bancaire'/>
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

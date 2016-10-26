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

      'company_streetAddress',
      'company_cityTown',
      'company_stateProvince',
      'company_postalCode',
      'company_country',
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
export default class Address extends React.Component{
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
        company_streetAddress,
        company_cityTown,
        company_stateProvince,
        company_postalCode,
        company_country,
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

                  <div className={'row'} role='tabpanel'>

                    <div className='form-group row' style={{}}>

                      <div className='col-sm-12'>
                              <textarea
                                autoFocus
                                style={{resize: 'none'}}
                                disabled={submitting}
                                onChange={company_streetAddress.onChange}
                                value={getFieldValue(company_streetAddress, '')}
                                placeholder={intl.formatMessage(messages['placeholder_Street'])}
                                className='form-control'/>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <div className='col-sm-6'>
                        <input
                          onChange={company_cityTown.onChange}
                          value={getFieldValue(company_cityTown, '')}
                          disabled={submitting} type='text' className='form-control'
                          placeholder={intl.formatMessage(messages['placeholder_cityTown'])}/>
                      </div>

                      <div className='col-sm-6'>
                        <input
                          onChange={company_stateProvince.onChange}
                          value={getFieldValue(company_stateProvince, '')}
                          disabled={submitting} type='text' className='form-control'
                          placeholder={intl.formatMessage(messages['placeholder_stateProvince'])}/>
                      </div>

                    </div>

                    <div className='form-group row'>

                      <div className='col-sm-6'>
                        <input
                          onChange={company_postalCode.onChange}
                          value={getFieldValue(company_postalCode, '')}
                          disabled={submitting} type='text' className='form-control'
                          placeholder={intl.formatMessage(messages['placeholder_postalCode'])}/>
                      </div>

                      <div className='col-sm-6'>
                        <input
                          onChange={company_country.onChange}
                          value={getFieldValue(company_country, '')}
                          disabled={submitting} type='text' className='form-control'
                          placeholder={intl.formatMessage(messages['placeholder_country'])}/>
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

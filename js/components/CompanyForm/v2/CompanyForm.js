import React, {PropTypes} from 'react';

import Wizard from '../../Wizard/Wizard';

import {getBodyHeight,} from '../../../utils/dimensions';

import Alert from '../../Alert/Alert';

import MainInfo from './steps/MainInfo';
import Address from './steps/Address';
import MoreInfo from './steps/MoreInfo';
import VATSettings from './steps/VATSettings';

import moment from 'moment';

import pick from 'lodash.pick';

import LoadingActions from '../../Loading/actions';

const MainInfoStep = {
  name: 'MainInfo',
  title: 'Info société',
  onSubmit(done, stay){
    const self = this;

    const { id, } = self.props.data;
    const { valid, viewer, dirty, values : data, createOrUpdate, } = self.props;

    if(valid){

      if(id){ // already saved

        if(dirty){

          const fieldInfos = Object.keys(data)
          .filter(key => key !== 'id' && key !== 'logo')
          .map(key => ({fieldName: key, value: data[key], }));

          const _data = { id, fieldInfos, viewer, };

          const logoValue = data['logo'];

          const {
            fields: {
              logo,
            }
          } = self.props;

          if(logo.dirty){
            _data.logo = logoValue ? {
              ...pick(logoValue, [ 'name', 'type', 'size' ]),
              dataBase64: logoValue.url.split(/,/)[1],
            } : {
              isNull: true,
            };
          }

          LoadingActions.show();

          return createOrUpdate(_data)
          .then(result => {

            LoadingActions.hide();

            const handleResponse = (result) => {

              if (typeof result.error === 'object') {
                return done(new Error('Il y a une erreur. Veuillez essayer de nouveau.'));
              }

              Object.keys(result.result).forEach(function(key){
                self.props.data[key] = result.result[key];
              });

              return done();
            };

            return handleResponse(result);
          }, function(){
            return done(new Error('Il y a une erreur. Veuillez essayer de nouveau.'));
          });

        }else{
          return done();
        }
      } else { // NEW

        const fieldInfos = Object.keys(data)
        .filter(key => key !== 'id' && key !== 'logo')
        .map(key => ({fieldName: key, value: data[key], }));

        const _data = { id, fieldInfos, viewer, };

        const logoValue = data['logo'];

        const {
          fields: {
            logo,
          }
        } = self.props;

        if(logo.dirty){
          _data.logo = logoValue ? {
            ...pick(logoValue, [ 'name', 'type', 'size' ]),
            dataBase64: logoValue.url.split(/,/)[1],
          } : {
            isNull: true,
          };
        }

        LoadingActions.show();

        return createOrUpdate(_data)
        .then(result => {
          LoadingActions.hide();

          const handleResponse = (result) => {

            if (typeof result.error === 'object') {
              return done(new Error('Il y a une erreur. Veuillez essayer de nouveau.'));
            }

            Object.keys(result.result).forEach(function(key){
              self.props.data[key] = result.result[key];
            });

            return done();
          };

          return handleResponse(result);
        }, function(){
          return done(new Error('Il y a une erreur. Veuillez essayer de nouveau.'));
        });
      }
    }

    return stay();
  },
  component: MainInfo,
};

const AddressStep = {
  name: 'Address',
  title: 'Adresse',
  onSubmit(done, stay){
    const self = this;

    const { id, } = self.props.data;
    const { valid, dirty, values : data, createOrUpdate, viewer, } = self.props;

    if(valid){

      if(dirty){

        const fieldInfos = Object.keys(data)
        .filter(key => key !== 'id' && key !== 'logo')
        .map(key => ({fieldName: key, value: data[key], }));

        const _data = { id, fieldInfos, viewer, company: self.props.data, };

        LoadingActions.show();

        return createOrUpdate(_data)
        .then(result => {
          LoadingActions.hide();

          const handleResponse = (result) => {

            if (typeof result.error === 'object') {
              return done(new Error('Il y a une erreur. Veuillez essayer de nouveau.'));
            }

            Object.keys(result.result).forEach(function(key){
              self.props.data[key] = result.result[key];
            });

            return done();
          };

          return handleResponse(result);
        }, function(){
          return done(new Error('Il y a une erreur. Veuillez essayer de nouveau.'));
        });

      }else{
        return done();
      }
    }

    return stay();
  },
  component: Address,
};

const MoreInfoStep = {
  name: 'MoreInfo',
  title: 'Plus d\'information',
  onSubmit(done, stay){
    const self = this;

    const { id, } = self.props.data;
    const { valid, dirty, values : data, createOrUpdate, viewer, } = self.props;

    if(valid){

      if(dirty){

        const fieldInfos = Object.keys(data)
        .filter(key => key !== 'id' && key !== 'logo')
        .map(key => ({fieldName: key, value: data[key], }));

        const _data = { id, fieldInfos, viewer, company: self.props.data, };

        LoadingActions.show();

        return createOrUpdate(_data)
        .then(result => {
          LoadingActions.hide();

          const handleResponse = (result) => {

            if (typeof result.error === 'object') {
              return done(new Error('Il y a une erreur. Veuillez essayer de nouveau.'));
            }

            Object.keys(result.result).forEach(function(key){
              self.props.data[key] = result.result[key];
            });

            return done();
          };

          return handleResponse(result);
        }, function(){
          return done(new Error('Il y a une erreur. Veuillez essayer de nouveau.'));
        });

      }else{
        done();
      }
    }

    return stay();
  },
  component: MoreInfo,
};

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

const VATSettingsStep = {
  title: 'Paramètres de TVA',
  onSubmit(done, stay){
    const self = this;

    const { id, } = self.props.data;
    const { setupVAT, valid, dirty, values : data, viewer, } = self.props;

    if(valid){

      const enabled = data['VATEnabled'];

      if(dirty && enabled){

        const serverData = {
          agency: data['agency'],
          frequency: data['frequency'],
          startDate: moment().month(data['startDate']).startOf('month').toDate(),
          regime: REGIME_ID_TO_VALUE[data['regime']],
          IF: data['IF'],
        };

        LoadingActions.show();

        return setupVAT({ ...serverData, viewer, company: self.props.data, declarations: {edges: []}, })
          .then(result => {

            LoadingActions.hide();

            if (result && typeof result.error === 'object') {
              return done(new Error('Il y a une erreur. Veuillez essayer de nouveau.'));
            }

            Object.keys(result.result).forEach(function(key){
              self.props.data[key] = result.result[key];
            });

            return done();
         });

      }else{
        return done();
      }
    }

    return stay();
  },
  component: VATSettings,
};

const Done = {
  name: 'Done',
  onDone(){
    this.props.data.onRequestHide(this.props.data.id, true);
  },
  component: React.createClass({
    render(){
      return(
        <div className='settings' style={{ height: getBodyHeight() - 50, width: 800, minWidth: 800, marginTop: '3em', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', }}>
          <Alert title={'Succès'} type={'info'}><p style={{width: 800}}>La société a été creé avec succès.</p></Alert>
        </div>
      )
    }
  }),
};

export default class CompanyForm extends React.Component{
  render(){
    return (
      <Wizard
        stepProps={{
          viewer: this.props.viewer,
        }}
        title={'Nouvelle société'}
        className={'company-form'}
        onRequestHide={this.props.onDoneCreateCompany}
        canCancel={this.props.canCancel}
        steps={[
          MainInfoStep,
          AddressStep,
          MoreInfoStep,
          VATSettingsStep,
          Done
        ]}
      />
    );
  }
}

import React, {Component, PropTypes} from 'react';

import classnames from 'classnames';

import styles from './VATInputType.scss';

import CSSModules from 'react-css-modules';

import {
  intlShape,
} from 'react-intl';

import Combobox from 'react-widgets/lib/Combobox';

import messages from './messages';
import getFieldValue from "../../utils/getFieldValue";

import { StoreProto, } from '../../../redux/modules/v2/invoices';

@CSSModules(styles, {allowMultiple: true})
export default class extends React.Component {
  static displayName = 'VATInputType';
  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const {intl,} = this.context;

    const {
      store,
      fields: {
        inputType,
      }
    } = this.props;

    const inputTypeValue = getFieldValue(inputType);

    return (
      <div styleName='VAT-input-type-wrapper'>

        <div styleName='VAT-input-type'>

          <div>

            <div className='row'>

              <div className='col-sm-9 first-col'></div>

              <div className='col-sm-3 last-col'>

                <div className='row'>

                  <div className='col-sm-6 first-col' style={{ textAlign: 'right', }}>
                    <label style={{display: 'block'}} styleName='subsection12TitleText'
                           htmlFor='inputType'>Les montants sont:</label>
                  </div>

                  <div className='col-sm-6 last-col'>

                    <fieldset id={'inputType'} className='form-group'>

                      <div className=''>

                        <Combobox
                          onChange={value => {
                            if(!value || typeof value === 'string'){
                              // store.reconcileInputType(inputType.initialValue);
                              StoreProto.reconcileInputType.call(store, inputType.initialValue);
                              inputType.onChange(inputType.initialValue);
                              return;
                            }

                            // store.reconcileInputType(value.id);
                            StoreProto.reconcileInputType.call(store, value.id);
                            inputType.onChange(value.id);
                          }}
                          data={INPUT_TYPES}
                          value={inputTypeValue}
                          textField='name'
                          valueField='id'
                          className={classnames('no-new')}
                        />

                      </div>

                    </fieldset>

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

const INPUT_TYPES = [{
  id: 1,
  name: 'HT',
}, {
  id: 2,
  name: 'TTC',
}, {
  id: 3,
  name: 'Hors champs',
}];

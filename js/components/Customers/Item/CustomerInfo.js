import React, { Component, PropTypes, } from 'react';

import CSSModules from 'react-css-modules';

import styles from './CustomerInfo.scss';

import NotesEditor from './NotesEditor';

import formatAddress from '../../../utils/formatAddress';

function getBillingAddress({
  billing_streetAddress,
  billing_cityTown,
  billing_stateProvince,
  billing_postalCode,
  billing_country,
}){
  const addr = formatAddress({
    address: billing_streetAddress,
    city: billing_cityTown,
    // subdivision: billing_stateProvince,
    postalCode: billing_postalCode,
    // country: billing_country,
  });

  return addr.length === 0 ? undefined : addr.join('\n');
}

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'CustomerInfo';
  static propTypes = {
    customer: PropTypes.object.isRequired,
  };
  render(){
    const { displayName, email, tel, mobile, fax, webSite, notes,  } = this.props.customer;
    return (
      <div styleName='table width100Percent'>

        <div styleName='tableRow width100Percent'>

          <div styleName='tableCell leftColumn'>

            <div className='leftWrapperDiv'>

              <div styleName='table width100Percent'>

                <div styleName='info'>
                  <div styleName='tableRow'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell '>
                        <span styleName='label'>Client</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value'>{displayName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>E-mail</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value' style={{ display: 'none', }}>
                          <a>{email}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Téléphone</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value'>{tel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Mobile</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value'>{mobile}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Télécopie</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value'>{fax}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Site Web</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value' style={{ display: 'none', }}>
                        <a styleName='value'>{webSite}</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info noborderbottom'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Notes</span>
                      </div>
                      <div styleName='tableCell notesWidth'>
                        <NotesEditor viewer={this.props.viewer} company={this.props.company} customer={this.props.customer}/>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div styleName='tableCell rightColumn'>

            <div className={'rightWrapperDiv'} styleName=' width100Percent'>

              <div styleName='table width100Percent'>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Adresse de facturation</span>
                      </div>
                      <div styleName='tableCell'>
                        <div styleName='value'>
                          {getBillingAddress(this.props.customer)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Adresse d’expédition</span>
                      </div>
                      <div styleName='tableCell'>
                        <div styleName='value'>
                          <div></div>
                          <div>
                            <span></span><span style={{ display: 'none', }}>,</span>
                            <span></span>
                          </div>
                          <span></span>
                        </div>
                        <div styleName='value' style={{ display: 'none', }}>
                          <div></div>
                          <div>
                            <span></span><span style={{ display: 'none', }}>,</span>
                            <span></span>
                          </div>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Conditions</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value'></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Mode de paiement</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value'></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Mode d’envoi préféré</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value'>Aucun</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>N° de TVA</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value'></span>
                        <span styleName='value'></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow' style={{ display: 'none', }}>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Entreprise</span>
                      </div>
                      <div styleName='tableCell'>
                        <span styleName='value'></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow' style={{ display: 'none', }}>
                  <div styleName='info noborderbottom'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Notes</span>
                      </div>
                      <div styleName='tableCell notesWidth'>
                        <textarea autoComplete='off' className={'notes-view-only'} styleName=' dijitTextBox dijitTextArea' tabIndex='0' maxLength='4000' placeholder='Aucune note disponible. Cliquez pour ajouter des notes.' value=''></textarea>
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

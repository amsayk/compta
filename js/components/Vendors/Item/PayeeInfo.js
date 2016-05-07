import React, { Component, PropTypes, } from 'react';

import CSSModules from 'react-css-modules';

import styles from './PayeeInfo.scss';

import NotesEditor from './NotesEditor';

import formatAddress from '../../../utils/formatAddress';

function getMailingAddress({
  mailing_streetAddress,
  mailing_cityTown,
  mailing_stateProvince,
  mailing_postalCode,
  mailing_country,
}){
  const addr = formatAddress({
    address: mailing_streetAddress,
    city: mailing_cityTown,
    // subdivision: mailing_stateProvince,
    postalCode: mailing_postalCode,
    // country: mailing_country,
  });

  return addr.length === 0 ? undefined : addr.join('\n');
}

@CSSModules(styles, {allowMultiple: true})
export default class extends Component{
  static displayName = 'PayeeInfo';
  static propTypes = {
    payee: PropTypes.object.isRequired,
  };
  render(){
    const { displayName, email, tel, mobile, fax, webSite, notes,  } = this.props.payee;
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
                        <NotesEditor viewer={this.props.viewer} company={this.props.company} payee={this.props.payee}/>
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
                        <span styleName='label'>Adresse d’expédition</span>
                      </div>
                      <div styleName='tableCell'>
                        <div styleName='value'>
                          {getMailingAddress(this.props.payee)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div styleName='tableRow'>
                  <div styleName='info'>
                    <div styleName='tableCell'>
                      <div styleName='tableCell labelCell'>
                        <span styleName='label'>Adresse de facturation</span>
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

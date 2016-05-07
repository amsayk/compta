// import React, {Component, PropTypes} from 'react';
// import {bindActionCreators} from 'redux';
// import {reduxForm} from 'redux-form';
// import bankAccountValidation from './bankAccountValidation';
// import * as bankActions from '../../redux/modules/bankAccounts';
//
// import classnames from 'classnames';
//
// import Modal from 'react-bootstrap/lib/Modal';
//
// import styles from './BankAccountForm.scss';
//
// import CSSModules from 'react-css-modules';
//
// import Parse from 'parse';
//
// import {Text, Select,} from '../form/form';
//
// import {Bank,} from '../../utils/types';
//
// const Progress = ({}) => (
//   <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate is-upgraded">
//     <div className="progressbar bar bar1" style={{width: '0%'}}></div>
//     <div className="bufferbar bar bar2" style={{width: '100%'}}></div>
//     <div className="auxbar bar bar3" style={{width: '0%'}}></div>
//   </div>
// );
//
// import {
//   FormattedMessage,
//   FormattedRelative,
//   intlShape,
// } from 'react-intl';
//
// import messages from './messages';
//
// function asyncValidate({displayName}) {
//   // TODO: figure out a way to move this to the server. need an instance of ApiClient
//   if (!displayName) {
//     return Promise.resolve({});
//   }
//   return new Promise((resolve, reject) => {
//     resolve();
//
//     // const query = new Parse.Query(Bank({id}));
//     // query.equalTo('displayNameLowerCase', makeAlias(displayName));
//     //
//     // query.first().then(
//     //   function (object) {
//     //     if (object) {
//     //       reject({
//     //         displayName: messages.displayNameError
//     //       });
//     //       return;
//     //     }
//     //
//     //     resolve();
//     //   },
//     //
//     //   function () {
//     //     reject({
//     //       displayName: messages.error
//     //     });
//     //   }
//     // );
//   });
// }
//
// @reduxForm({
//     form: 'bankAccount',
//     fields: [
        //   'id', 
        //   'displayName',
        // ],
//     validate: bankAccountValidation,
//     asyncValidate,
//     asyncBlurFields: ['displayName'],
//   }, (state, ownProps) => ({
//     saveError: state.bankAccounts.saveError,
//     initialValues: ownProps.bankAccount || {}, // Pass company on edit
//   }),
//   dispatch => bindActionCreators(bankActions, dispatch))
// @CSSModules(styles, {})
// export default class BankAccountForm extends Component {
//   static contextTypes = {
//     intl: intlShape.isRequired,
//     router: PropTypes.object.isRequired,
//   };
//
//   static propTypes = {
//     fields: PropTypes.object.isRequired,
//     asyncValidating: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
//     dirty: PropTypes.bool.isRequired,
//     handleSubmit: PropTypes.func.isRequired,
//     valid: PropTypes.bool.isRequired,
//     invalid: PropTypes.bool.isRequired,
//     pristine: PropTypes.bool.isRequired,
//     save: PropTypes.func.isRequired,
//     submitting: PropTypes.bool.isRequired,
//     saveError: PropTypes.object,
//     formKey: PropTypes.string.isRequired,
//     values: PropTypes.object.isRequired,
//   };
//
//   render() {
//     const {formatMessage,} = this.context.intl;
//
//     const {
//       asyncValidating,
//       dirty,
//       formKey,
//       editStop,
//       fields: {
          //   id,
          //   displayName,
          //   periodType,
          // },
//       handleSubmit,
//       valid,
//       invalid,
//       pristine,
//       save,
//       submitting,
//       saveError: {[formKey]: saveError},
//       values,
//
//       onCancel,
//     } = this.props;
//
//     const handleClose = () => {
//       editStop(formKey);
//       onCancel();
//     };
//
//     return (
//
//       <Modal styleName={'modal'}
//              className={classnames({'valid': !pristine && valid, 'submitting': submitting, form: true})} show={true}
//              keyboard={false} backdrop={'static'} onHide={() => handleClose()} autoFocus enforceFocus>
//         <Modal.Header>
//           <div className="title">{formatMessage(messages['formTitle'])}
//           </div>
//           <div className="subtitle">{formatMessage(messages['formSubtitle'])}</div>
//         </Modal.Header>
//         <Modal.Body>
//
//
//           <Text
//             name={formatMessage(messages['displayNameLabel'])}
//             description={formatMessage(messages['displayNameDesc'])}
//             placeholder={formatMessage(messages['displayNamePlaceholder'])}
//             autoFocus
//             props={{...displayName, error: displayName.error && formatMessage(displayName.error)}}
//           />
//
//           {saveError && <div styleName="error">{formatMessage({ ...saveError, id: saveError._id, })}</div>}
//           {submitting && <Progress/>}
//
//         </Modal.Body>
//         <Modal.Footer>
//
//           <button
//             styleName="button"
//             onClick={() => handleClose()}
//             disabled={submitting}
//             className="btn btn-primary-outline unselectable">{formatMessage(messages['cancel'])}
//           </button>
//
//           <button
//             styleName="button"
//             onClick={handleSubmit((data) => {
//               return save({...data, viewer: this.props.viewer, root: this.props.company})
//                     .then(result => {
//                       if (result && typeof result.error === 'object') {
//                         return Promise.reject(); // { defaultMessage: messages['error'].defaultMessage, _id: messages['error'].id, }
//                       }
//
//                       handleClose();
//                       // setImmediate(() => {this.context.router.push(`/apps/${result.result.id}/`);})
//                     });
//             })}
//             disabled={pristine || invalid || submitting}
//             className={"btn btn-primary unselectable" + (!pristine && valid ? ' green' : '')}>
//             {' '}{formatMessage(submitting ? messages['saving'] : messages['save'])}
//           </button>
//
//         </Modal.Footer>
//       </Modal>
//     );
//   }
// }

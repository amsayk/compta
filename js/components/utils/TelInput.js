import React, {Component, PropTypes,} from 'react';
import IntlTelInput from 'react-intl-tel-input';
import 'file?name=libphonenumber.js!../../../node_modules/react-intl-tel-input/dist/libphonenumber.js';
import '../../../node_modules/react-intl-tel-input/dist/main.css';

// const loadJSONP = (url, callback) => {
//   const ref = window.document.getElementsByTagName('script')[0];
//   const script = window.document.createElement('script');
//   script.src = `${url + (url.indexOf('?') + 1 ? '&' : '?')}callback=${callback}`;
//   ref.parentNode.insertBefore(script, ref);
//   script.onload = function() {
//     this.remove();
//   };
// };

// const lookup = (callback) => {
//   loadJSONP('http://ipinfo.io', 'sendBack');
//   window.sendBack = (resp) => {
//     const countryCode = (resp && resp.country) ? resp.country : '';
//     callback(countryCode);
//   }
// };

const changeHandler = (onChange) => (status, value, countryData, number, id) => {
  console.log('TelInput', status, value, countryData, number, id);
  onChange(value);
};

export default class extends React.Component {
  static displayName = 'TelInput';
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    value: '',
    onChange() {
    }
  };

  render() {
    return (
      <IntlTelInput
        onPhoneNumberChange={changeHandler(this.props.onChange)}
        // preferredCountries={['ma']}
        defaultCountry={'ma'}
        css={['intl-tel-input', 'form-control']}
        // geoIpLookup={lookup}
        value={this.props.value}
        utilsScript={'libphonenumber.js'}
      />
    );
  }
}

// import ReactTelephoneInput from '../react-telephone-input/react-telephone-input';

// const changeHandler = (onChange) => (telNumber) => {
//   console.log('TelInput', telNumber);
//   onChange(telNumber);
// };

// export default class extends React.Component {
//   static displayName = 'TelInput';
//   static propTypes = {
//     value: PropTypes.string.isRequired,
//     onChange: PropTypes.func.isRequired,
//   };
//   static defaultProps = {
//     onChange: function() {
//     }
//   };
//
//   render() {
//     return (
//       <ReactTelephoneInput
//         defaultCountry='ma'
//         value={this.props.value}
//         flagsImagePath={require('../react-telephone-input/flags.png')}
//         onChange={changeHandler(this.props.onChange)}/>
//     );
//   }
// }

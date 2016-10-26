import {
  defineMessages,
} from 'react-intl';

import isURL from 'validator/lib/isURL';

const messages = defineMessages({

  minimum: {
    id: 'error.minimum',
    defaultMessage: 'Doit être supérieur à {value}',
  },

  maximum: {
    id: 'error.maximum',
    defaultMessage: 'Doit être inférieur à {value}',
  },

  oneOf: {
    id: 'error.oneOf',
    defaultMessage: 'Doit être l\'un des: '
  },

  required: {
    id: 'error.required',
    defaultMessage: 'Ce champ est nécessaire.'
  },

  email: {
    id: 'error.invalid-email',
    defaultMessage: 'Cette adresse e-mail est invalide.'
  },

  url: {
    id: 'error.invalid-url',
    defaultMessage: 'Cette URL est invalide.'
  },

  phone: {
    id: 'error.invalid-phone',
    defaultMessage: 'Invalid telephone number'
  },

  fax: {
    id: 'error.invalid-fax',
    defaultMessage: 'Invalid fax'
  },

});

const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ];

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return messages.email;
  }
}

export function url(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !isURL(value)) {
    return messages.url;
  }
}

export function required(value) {
  if (isEmpty(value)) {
    return messages.required;
  }
}

export function requiredIf(cond){
  return (value, values) => {
    if (cond(values) && isEmpty(value)) {
      return messages.required;
    }
  };
}

export function equalToField(field, msg = ''){
  return (value, values) => {
    if (!isEmpty(value) && values[field] !== value) {
      return msg;
    }
  };
}
export function validIf(cond, msg = ''){
  return (value, values) => {
    if (!isEmpty(value) && !cond(values)) {
      return msg;
    }
  };
}

export function minExclusive(minimum){
  return (value) => {
    if (!isEmpty(value) && value <= minimum) {
      return messages.minimum;
    }
  };
}

export function maxInclusive(maximum){
  return (value) => {
    if (!isEmpty(value) && value > maximum) {
      return messages.maximum;
    }
  };
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      // return `Must be at least ${min} characters`;
      return `Cela doit être au moins ${min} caractères`;
    }
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      // return `Must be no more than ${max} characters`;
      return `Cela doit être au plus ${max} caractères`;
    }
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      // return `Must be one of: ${enumeration.join(', ')}`;
      return messages.oneOf
    }
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

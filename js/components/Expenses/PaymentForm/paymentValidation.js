import { createValidator, required, oneOf, minExclusive, } from '../../../utils/validation';

const validation = createValidator({
  // paymentMethod: [required, oneOf([ 'Cash', 'Check', 'Creditcard', ])],
  mailingAddress: [required],
  date: [required],

  payee: [required],

  amountReceived: [required, minExclusive(0.0) ],

  creditToAccountCode: [required],
});
export default validation;

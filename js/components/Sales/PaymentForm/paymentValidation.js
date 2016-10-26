import { createValidator, required, oneOf, minExclusive, } from '../../../utils/validation';

const validation = createValidator({
  paymentMethod: [required, oneOf([ 'Cash', 'Check', 'Creditcard', ])],
  date: [required],

  customer: [required],

  amountReceived: [required, minExclusive(0.0) ],

  depositToAccountCode: [required],
});
export default validation;

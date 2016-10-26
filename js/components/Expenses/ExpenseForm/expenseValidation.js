import { createValidator, required, oneOf, } from '../../../utils/validation';
import messages from './messages';

const validation = createValidator({
  paymentMethod: [required, oneOf([ 'Cash', 'Check', 'Creditcard', ])],
  date: [required],

  creditToAccountCode: [required],

  payee: [required],

  inputType: [required],
});
export default validation;

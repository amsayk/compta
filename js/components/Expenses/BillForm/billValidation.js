import { createValidator, required, oneOf, } from '../../../utils/validation';
import messages from './messages';

const validation = createValidator({
  terms: [required, oneOf([ 'OnReception', 'Net_15', 'Net_30', 'Net_60', 'Custom', ])],
  date: [required],
  dueDate: [required],

  mailingAddress: [required],  

  payee: [required],
});
export default validation;

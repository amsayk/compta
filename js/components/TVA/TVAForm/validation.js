import { createValidator, required, oneOf, } from '../../../utils/validation';
import messages from './messages';

const validation = createValidator({
  regime: [ required, ],
  frequency: [ required, ],
  startDate: [ required, ],
  IF: [ required, ],
});
export default validation;

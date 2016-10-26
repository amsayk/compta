import { createValidator, requiredIf, } from '../../../../../utils/validation';
import messages from './messages';

const isVATEnabled = ({ VATEnabled }) => VATEnabled === true;

const validation = createValidator({
  regime: [ requiredIf(isVATEnabled), ],
  frequency: [ requiredIf(isVATEnabled), ],
  startDate: [ requiredIf(isVATEnabled), ],
  IF: [ requiredIf(isVATEnabled), ],
});
export default validation;

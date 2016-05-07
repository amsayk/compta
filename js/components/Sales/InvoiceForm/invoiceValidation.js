import { createValidator, required, oneOf, } from '../../../utils/validation';
import messages from './messages';

const validation = createValidator({
  terms: [required, oneOf([ 'OnReception', 'Net_15', 'Net_30', 'Net_60', 'Custom', ])],
  date: [required],
  dueDate: [required],

  billingAddress: [required],

  customer: [required],

  discountValue: [discountValue],
});
export default validation;

const discountTypesById = { 'Value': 1, 'Percent': 2, };

function discountValue(discountValue, {discountType}) {
  const discountValueIsInvalid = function(){
    if(!discountValue || String(discountValue).length === 0){
      return false;
    }
    let max = 100;
    if(discountType !== discountTypesById['Percent']){
      max = Infinity;
    }
    return (!isFinite(discountValue) || discountValue < 0 || discountValue > max);
  }();

  if (discountValueIsInvalid) {
    return messages.discountValueError;
  }
}

import { createValidator, required, } from '../../../utils/validation';

const validation = createValidator({
  displayName: [required],
  incomeAccountCode: [required],
  purchaseAccountCode: [purchaseAccountCodeValidation],
});
export default validation;

function purchaseAccountCodeValidation(purchaseAccountCode, { purchaseEnabled, }) {
  if(purchaseEnabled){
    return required(purchaseAccountCode);
  }
}

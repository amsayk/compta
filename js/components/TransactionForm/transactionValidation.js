import { createValidator, required, } from '../../utils/validation';

const transactionValidation = createValidator({
  date: [required],
  operations: [],
});
export default transactionValidation;

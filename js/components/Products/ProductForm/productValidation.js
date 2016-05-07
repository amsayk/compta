import { createValidator, required, } from '../../../utils/validation';

const validation = createValidator({
  displayName: [required],
  incomeAccountCode: [required],
});
export default validation;

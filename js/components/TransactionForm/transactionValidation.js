import { createValidator, required, } from '../../utils/validation';

const accountValidation = createValidator({
  date: [required],
  operations: [],
});
export default accountValidation;

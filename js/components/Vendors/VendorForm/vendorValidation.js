import { createValidator, required, } from '../../../utils/validation';

const validation = createValidator({
  displayName: [required],
  // if: [required],
});
export default validation;

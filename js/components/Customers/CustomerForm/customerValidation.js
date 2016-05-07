import { createValidator, required, } from '../../../utils/validation';

const validation = createValidator({
  displayName: [required],
});
export default validation;

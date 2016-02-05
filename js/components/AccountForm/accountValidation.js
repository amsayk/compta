import { createValidator, required, email, } from '../../utils/validation';

const accountValidation = createValidator({
  displayName: [required],
  email: [required, email],
});
export default accountValidation;

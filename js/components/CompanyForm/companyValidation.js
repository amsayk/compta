import { createValidator, required, oneOf, } from '../../utils/validation';

export const periodTypes = [ 'MONTHLY', 'TRIMESTERLY', ];

const companyValidation = createValidator({
  displayName: [required],
  periodType: [required, oneOf(periodTypes)],
});
export default companyValidation;

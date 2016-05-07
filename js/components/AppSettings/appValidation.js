import { createValidator, required, oneOf, } from '../../utils/validation';

export const periodTypes = [ 'MONTHLY', 'TRIMESTERLY', ];

export const companyValidation = createValidator({
  displayName: [required],
  periodType: [required, oneOf(periodTypes)],
});

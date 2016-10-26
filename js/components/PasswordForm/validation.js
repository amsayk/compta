import { createValidator, required, requiredIf, equalToField, minLength, validIf, } from '../../utils/validation';

const validation = createValidator({
  currentPassword: [requiredIf(isChangePassword)],
  newPassword: [required, minLength(7)],
  newPasswordConfirmation: [required, equalToField('newPassword', 'Les mots de passe doivent être identiques.')],
});
export default validation;

function isChangePassword({ type }) {
  return type === 'change';
}

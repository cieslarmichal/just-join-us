import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';

import { type ValidatePayload, type PasswordValidationService } from './passwordValidationService.ts';

export class PasswordValidationServiceImpl implements PasswordValidationService {
  public validate(payload: ValidatePayload): void {
    const { password } = payload;

    if (password.length < 8) {
      throw new OperationNotValidError({
        reason: 'Password must be at least 8 characters long.',
      });
    }

    if (password.length > 64) {
      throw new OperationNotValidError({
        reason: 'Password must be at most 64 characters long.',
      });
    }

    if (!/[a-z]/.test(password)) {
      throw new OperationNotValidError({
        reason: 'Password must contain at least one lowercase letter.',
      });
    }

    if (!/[A-Z]/.test(password)) {
      throw new OperationNotValidError({
        reason: 'Password must contain at least one uppercase letter.',
      });
    }

    if (!/[0-9]/.test(password)) {
      throw new OperationNotValidError({
        reason: 'Password must contain at least one number.',
      });
    }
  }
}

import { type Action } from '../../../../../common/types/action.ts';

export interface ChangeUserPasswordActionPayload {
  readonly newPassword: string;
  readonly identifier:
    | {
        readonly resetPasswordToken: string;
      }
    | {
        readonly userId: string;
      };
}

export type ChangeUserPasswordAction = Action<ChangeUserPasswordActionPayload, void>;

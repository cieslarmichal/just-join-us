import { type Action } from '../../../../../common/types/action.ts';

export interface ExecutePayload {
  readonly email: string;
}

export type SendResetPasswordEmailAction = Action<ExecutePayload, void>;

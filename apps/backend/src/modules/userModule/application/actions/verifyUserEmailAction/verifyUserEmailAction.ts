import { type Action } from '../../../../../common/types/action.ts';

export interface ExecutePayload {
  readonly emailVerificationToken: string;
}

export type VerifyUserEmailAction = Action<ExecutePayload, void>;

import { type Action } from '../../../../../common/types/action.ts';

export interface ExecutePayload {
  readonly userId: string;
  readonly refreshToken: string;
  readonly accessToken: string;
}

export type LogoutUserAction = Action<ExecutePayload, void>;

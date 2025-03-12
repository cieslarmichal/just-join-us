import { type Action } from '../../../../../common/types/action.ts';

export interface LoginUserActionPayload {
  readonly email: string;
  readonly password: string;
}

export interface LoginUserActionResult {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export type LoginUserAction = Action<LoginUserActionPayload, LoginUserActionResult>;

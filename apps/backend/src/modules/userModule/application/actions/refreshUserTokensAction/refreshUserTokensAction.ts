import { type Action } from '../../../../../common/types/action.ts';

export interface RefreshUserTokensActionPayload {
  readonly refreshToken: string;
}

export interface RefreshUserTokensActionResult {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly accessTokenExpiresIn: number;
}

export type RefreshUserTokensAction = Action<RefreshUserTokensActionPayload, RefreshUserTokensActionResult>;

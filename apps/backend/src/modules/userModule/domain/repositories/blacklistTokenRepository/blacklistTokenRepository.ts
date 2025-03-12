import { type BlacklistToken } from '../../entities/blacklistToken/blacklistToken.ts';

export interface CreateBlacklistTokenPayload {
  readonly token: string;
  readonly expiresAt: Date;
}

export interface FindBlacklistTokenPayload {
  readonly token: string;
}

export interface BlacklistTokenRepository {
  createBlacklistToken(payload: CreateBlacklistTokenPayload): Promise<BlacklistToken>;
  findBlacklistToken(payload: FindBlacklistTokenPayload): Promise<BlacklistToken | null>;
}

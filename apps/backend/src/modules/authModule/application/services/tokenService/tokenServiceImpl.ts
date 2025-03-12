import jwt from 'jsonwebtoken';

import { UnauthorizedAccessError } from '../../../../../common/errors/unathorizedAccessError.ts';
import { type Config } from '../../../../../core/config.ts';

import {
  type CreateTokenPayload,
  type VerifyTokenPayload,
  type TokenService,
  type DecodeTokenPayload,
  type DecodeTokenResult,
} from './tokenService.ts';

export class TokenServiceImpl implements TokenService {
  private readonly config: Config;

  public constructor(config: Config) {
    this.config = config;
  }

  public createToken(payload: CreateTokenPayload): string {
    const { data, expiresIn } = payload;

    const token = jwt.sign(data, this.config.token.secret, {
      expiresIn,
      algorithm: 'HS512',
    });

    return token;
  }

  public verifyToken(payload: VerifyTokenPayload): Record<string, string> {
    const { token } = payload;

    const data = jwt.verify(token, this.config.token.secret, { algorithms: ['HS512'] });

    return data as Record<string, string>;
  }

  public decodeToken(payload: DecodeTokenPayload): DecodeTokenResult {
    const { token } = payload;

    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken) {
      throw new UnauthorizedAccessError({
        reason: 'Token is not valid.',
        token,
      });
    }

    const tokenPayload = decodedToken.payload as jwt.JwtPayload;

    const expiresAt = tokenPayload.exp;

    if (!expiresAt) {
      throw new UnauthorizedAccessError({
        reason: 'Token expiration date is not set.',
        token,
      });
    }

    return { expiresAt };
  }
}

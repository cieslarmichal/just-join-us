import { ForbiddenAccessError } from '../../../../../common/errors/forbiddenAccessError.ts';
import { UnauthorizedAccessError } from '../../../../../common/errors/unathorizedAccessError.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import { type TokenService } from '../tokenService/tokenService.ts';

import {
  type VerifyBearerTokenPayload,
  type AccessControlService,
  type VerifyBearerTokenResult,
} from './accessControlService.ts';

export class AccessControlServiceImpl implements AccessControlService {
  private readonly tokenService: TokenService;

  public constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  public async verifyBearerToken(payload: VerifyBearerTokenPayload): Promise<VerifyBearerTokenResult> {
    const { requestHeaders, expectedUserId, expectedRole } = payload;

    const authorizationHeader = requestHeaders['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedAccessError({
        reason: 'Authorization header not provided.',
      });
    }

    const [authorizationType, token] = authorizationHeader.split(' ');

    if (authorizationType !== 'Bearer') {
      throw new UnauthorizedAccessError({
        reason: 'Bearer authorization type not provided.',
      });
    }

    let tokenPayload: VerifyBearerTokenResult;

    try {
      tokenPayload = this.tokenService.verifyToken({ token: token as string }) as unknown as VerifyBearerTokenResult;
    } catch (error) {
      throw new UnauthorizedAccessError({
        reason: 'Invalid access token.',
        originalError: error,
      });
    }

    if (tokenPayload.role === userRoles.admin) {
      return tokenPayload;
    }

    if (expectedRole && tokenPayload.role !== expectedRole) {
      throw new ForbiddenAccessError({
        reason: 'The user role is not sufficient to perform this operation.',
      });
    }

    if (expectedUserId && tokenPayload.userId !== expectedUserId) {
      throw new ForbiddenAccessError({
        reason: 'User id does not match expected user id.',
      });
    }

    return tokenPayload;
  }
}

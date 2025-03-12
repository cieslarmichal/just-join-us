import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { tokenTypes } from '../../../../../common/types/tokenType.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { type BlacklistTokenRepository } from '../../../domain/repositories/blacklistTokenRepository/blacklistTokenRepository.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';

import { type LogoutUserAction, type ExecutePayload } from './logoutUserAction.ts';

export class LogoutUserActionImpl implements LogoutUserAction {
  private readonly userRepository: UserRepository;
  private readonly tokenService: TokenService;
  private readonly blacklistTokenRepository: BlacklistTokenRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    userRepository: UserRepository,
    tokenService: TokenService,
    blacklistTokenRepository: BlacklistTokenRepository,
    loggerService: LoggerService,
  ) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.blacklistTokenRepository = blacklistTokenRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: ExecutePayload): Promise<void> {
    const { userId, accessToken, refreshToken } = payload;

    this.loggerService.debug({
      message: 'Logging user out...',
      userId,
    });

    let refreshTokenPayload: Record<string, string>;

    try {
      refreshTokenPayload = this.tokenService.verifyToken({ token: refreshToken });
    } catch (error) {
      throw new OperationNotValidError({
        reason: 'Invalid refresh token.',
        token: refreshToken,
        originalError: error,
      });
    }

    let accessTokenPayload: Record<string, string>;

    try {
      accessTokenPayload = this.tokenService.verifyToken({ token: accessToken });
    } catch (error) {
      throw new OperationNotValidError({
        reason: 'Invalid access token.',
        token: accessToken,
        originalError: error,
      });
    }

    const isRefreshTokenBlacklisted = await this.blacklistTokenRepository.findBlacklistToken({
      token: refreshToken,
    });

    const isAccessTokenBlacklisted = await this.blacklistTokenRepository.findBlacklistToken({
      token: accessToken,
    });

    if (isRefreshTokenBlacklisted) {
      this.loggerService.debug({
        message: 'Refresh token is already on blacklist.',
        userId,
        refreshToken,
      });
    }

    if (isAccessTokenBlacklisted && isRefreshTokenBlacklisted) {
      this.loggerService.debug({
        message: 'Access & refresh tokens are already on blacklist.',
        userId,
        accessToken,
      });

      return;
    }

    if (refreshTokenPayload['type'] !== tokenTypes.refresh) {
      throw new OperationNotValidError({
        reason: 'Invalid refresh token.',
      });
    }

    if (accessTokenPayload['type'] !== tokenTypes.access) {
      throw new OperationNotValidError({
        reason: 'Invalid access token.',
      });
    }

    const user = await this.userRepository.findUser({
      id: userId,
    });

    if (!user) {
      throw new OperationNotValidError({
        reason: 'User not found.',
        userId,
      });
    }

    const { expiresAt } = this.tokenService.decodeToken({
      token: refreshToken,
    });

    const { expiresAt: accessTokenExpiresAt } = this.tokenService.decodeToken({
      token: accessToken,
    });

    if (!isRefreshTokenBlacklisted) {
      await this.blacklistTokenRepository.createBlacklistToken({
        token: refreshToken,
        expiresAt: new Date(expiresAt),
      });
    }

    if (!isAccessTokenBlacklisted) {
      await this.blacklistTokenRepository.createBlacklistToken({
        token: accessToken,
        expiresAt: new Date(accessTokenExpiresAt),
      });
    }

    this.loggerService.debug({
      message: 'User logged out.',
      userId,
    });
  }
}

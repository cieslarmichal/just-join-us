import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { tokenTypes } from '../../../../../common/types/tokenType.ts';
import { type Config } from '../../../../../core/config.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { type BlacklistTokenRepository } from '../../../domain/repositories/blacklistTokenRepository/blacklistTokenRepository.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';

import {
  type RefreshUserTokensAction,
  type RefreshUserTokensActionPayload,
  type RefreshUserTokensActionResult,
} from './refreshUserTokensAction.ts';

export class RefreshUserTokensActionImpl implements RefreshUserTokensAction {
  private readonly loggerService: LoggerService;
  private readonly tokenService: TokenService;
  private readonly config: Config;
  private readonly userRepository: UserRepository;
  private readonly blacklistTokenRepository: BlacklistTokenRepository;

  public constructor(
    loggerService: LoggerService,
    tokenService: TokenService,
    config: Config,
    userRepository: UserRepository,
    blacklistTokenRepository: BlacklistTokenRepository,
  ) {
    this.loggerService = loggerService;
    this.tokenService = tokenService;
    this.config = config;
    this.userRepository = userRepository;
    this.blacklistTokenRepository = blacklistTokenRepository;
  }

  public async execute(payload: RefreshUserTokensActionPayload): Promise<RefreshUserTokensActionResult> {
    const { refreshToken } = payload;

    this.loggerService.debug({
      message: 'Refreshing User tokens...',
      refreshToken,
    });

    const isBlacklisted = await this.blacklistTokenRepository.findBlacklistToken({
      token: refreshToken,
    });

    if (isBlacklisted) {
      throw new OperationNotValidError({
        reason: 'Refresh token is blacklisted.',
      });
    }

    let tokenPayload: Record<string, string>;

    try {
      tokenPayload = this.tokenService.verifyToken({ token: refreshToken });
    } catch (error) {
      throw new OperationNotValidError({
        reason: 'Invalid refresh token.',
        token: refreshToken,
        originalError: error,
      });
    }

    if (tokenPayload['type'] !== tokenTypes.refresh) {
      throw new OperationNotValidError({
        reason: 'Token type is not refresh token.',
      });
    }

    const userId = tokenPayload['userId'];

    if (!userId) {
      throw new OperationNotValidError({
        reason: 'Refresh token does not contain userId.',
      });
    }

    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new OperationNotValidError({
        reason: 'User not found.',
        id: userId,
      });
    }

    if (user.getIsDeleted()) {
      throw new OperationNotValidError({
        reason: 'User is blocked.',
        id: userId,
      });
    }

    const accessTokenExpiresIn = this.config.token.access.expiresIn;

    const accessToken = this.tokenService.createToken({
      data: {
        userId,
        type: tokenTypes.access,
        role: user.getRole(),
      },
      expiresIn: accessTokenExpiresIn,
    });

    this.loggerService.debug({
      message: 'User tokens refreshed.',
      userId,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
    };
  }
}

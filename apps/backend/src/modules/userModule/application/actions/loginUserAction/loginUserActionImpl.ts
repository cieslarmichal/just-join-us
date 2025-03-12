import { ForbiddenAccessError } from '../../../../../common/errors/forbiddenAccessError.ts';
import { UnauthorizedAccessError } from '../../../../../common/errors/unathorizedAccessError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { tokenTypes } from '../../../../../common/types/tokenType.ts';
import { type Config } from '../../../../../core/config.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';
import { type HashService } from '../../services/hashService/hashService.ts';

import { type LoginUserAction, type LoginUserActionPayload, type LoginUserActionResult } from './loginUserAction.ts';

export class LoginUserActionImpl implements LoginUserAction {
  private readonly userRepository: UserRepository;
  private readonly loggerService: LoggerService;
  private readonly hashService: HashService;
  private readonly tokenService: TokenService;
  private readonly config: Config;

  public constructor(
    userRepository: UserRepository,
    loggerService: LoggerService,
    hashService: HashService,
    tokenService: TokenService,
    config: Config,
  ) {
    this.userRepository = userRepository;
    this.loggerService = loggerService;
    this.hashService = hashService;
    this.tokenService = tokenService;
    this.config = config;
  }

  public async execute(payload: LoginUserActionPayload): Promise<LoginUserActionResult> {
    const { email: emailInput, password } = payload;

    const email = emailInput.toLowerCase();

    this.loggerService.debug({
      message: 'Logging User in...',
      email,
    });

    const user = await this.userRepository.findUser({ email });

    if (!user) {
      throw new UnauthorizedAccessError({
        reason: 'Invalid credentials.',
        email,
      });
    }

    const passwordIsValid = await this.hashService.compare({
      plainData: password,
      hashedData: user.getPassword(),
    });

    if (!passwordIsValid) {
      throw new UnauthorizedAccessError({
        reason: 'Invalid credentials.',
        email,
      });
    }

    if (!user.getIsEmailVerified()) {
      throw new ForbiddenAccessError({
        reason: 'User email is not verified.',
        email,
      });
    }

    if (user.getIsDeleted()) {
      throw new ForbiddenAccessError({
        reason: 'User is deleted.',
        email,
      });
    }

    const accessToken = this.tokenService.createToken({
      data: {
        userId: user.getId(),
        type: tokenTypes.access,
        role: user.getRole(),
      },
      expiresIn: this.config.token.access.expiresIn,
    });

    const refreshToken = this.tokenService.createToken({
      data: {
        userId: user.getId(),
        type: tokenTypes.refresh,
      },
      expiresIn: this.config.token.refresh.expiresIn,
    });

    this.loggerService.debug({
      message: 'User logged in.',
      email,
      userId: user.getId(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

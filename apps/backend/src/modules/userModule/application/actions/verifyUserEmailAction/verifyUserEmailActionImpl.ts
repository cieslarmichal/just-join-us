import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { tokenTypes } from '../../../../../common/types/tokenType.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';

import { type VerifyUserEmailAction, type ExecutePayload } from './verifyUserEmailAction.ts';

export class VerifyUserEmailActionImpl implements VerifyUserEmailAction {
  private readonly tokenService: TokenService;
  private readonly userRepository: UserRepository;
  private readonly loggerService: LoggerService;

  public constructor(tokenService: TokenService, userRepository: UserRepository, loggerService: LoggerService) {
    this.tokenService = tokenService;
    this.userRepository = userRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: ExecutePayload): Promise<void> {
    const { emailVerificationToken } = payload;

    let tokenPayload: Record<string, string>;

    try {
      tokenPayload = this.tokenService.verifyToken({ token: emailVerificationToken });
    } catch (error) {
      throw new OperationNotValidError({
        reason: 'Invalid email verification token.',
        token: emailVerificationToken,
        originalError: error,
      });
    }

    const userId = tokenPayload['userId'];

    if (!userId) {
      throw new OperationNotValidError({
        reason: 'User ID not found in token payload.',
      });
    }

    if (tokenPayload['type'] !== tokenTypes.emailVerification) {
      throw new OperationNotValidError({
        reason: 'Token type is not email verification token.',
      });
    }

    const user = await this.userRepository.findUser({
      id: userId,
    });

    if (!user) {
      throw new OperationNotValidError({
        reason: 'User not found.',
        id: userId,
      });
    }

    this.loggerService.debug({
      message: 'Verifying user email...',
      userId: user.getId(),
      email: user.getEmail(),
    });

    if (user.getIsEmailVerified()) {
      throw new OperationNotValidError({
        reason: 'User email already verified.',
        email: user.getEmail(),
      });
    }

    user.setIsEmailVerified({ isEmailVerified: true });

    await this.userRepository.updateUser({ user });

    this.loggerService.debug({
      message: 'User email verified.',
      userId: user.getId(),
      email: user.getEmail(),
    });
  }
}

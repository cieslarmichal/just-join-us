import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { tokenTypes } from '../../../../../common/types/tokenType.ts';
import { type Config } from '../../../../../core/config.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventTypes } from '../../../domain/entities/emailEvent/types/emailEventType.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.ts';

import { type ExecutePayload, type SendVerificationEmailAction } from './sendVerificationEmailAction.ts';

export class SendVerificationEmailActionImpl implements SendVerificationEmailAction {
  private readonly tokenService: TokenService;
  private readonly userRepository: UserRepository;
  private readonly loggerService: LoggerService;
  private readonly config: Config;
  private readonly emailMessageBus: EmailMessageBus;

  public constructor(
    tokenService: TokenService,
    userRepository: UserRepository,
    loggerService: LoggerService,
    config: Config,
    emailMessageBus: EmailMessageBus,
  ) {
    this.tokenService = tokenService;
    this.userRepository = userRepository;
    this.loggerService = loggerService;
    this.config = config;
    this.emailMessageBus = emailMessageBus;
  }

  public async execute(payload: ExecutePayload): Promise<void> {
    const { email: emailInput } = payload;

    const email = emailInput.toLowerCase();

    const user = await this.userRepository.findUser({ email });

    if (!user) {
      throw new OperationNotValidError({
        reason: 'User not found.',
        email,
      });
    }

    if (user.getIsEmailVerified()) {
      throw new OperationNotValidError({
        reason: 'User email is already verified.',
        email,
      });
    }

    this.loggerService.debug({
      message: 'Sending verification email...',
      userId: user.getId(),
      email: user.getEmail(),
    });

    const emailVerificationToken = this.tokenService.createToken({
      data: {
        userId: user.getId(),
        type: tokenTypes.emailVerification,
      },
      expiresIn: this.config.token.emailVerification.expiresIn,
    });

    const emailVerificationLink = `${this.config.frontendUrl}/verifyEmail?token=${emailVerificationToken}`;

    await this.emailMessageBus.sendEvent(
      new EmailEventDraft({
        eventName: emailEventTypes.verifyEmail,
        payload: {
          name: user.getEmail(),
          recipientEmail: user.getEmail(),
          emailVerificationLink,
        },
      }),
    );
  }
}

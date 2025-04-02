import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { tokenTypes } from '../../../../../common/types/tokenType.ts';
import { type Config } from '../../../../../core/config.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventTypes } from '../../../domain/entities/emailEvent/types/emailEventType.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.ts';

import { type ExecutePayload, type SendResetPasswordEmailAction } from './sendResetPasswordEmailAction.ts';

export class SendResetPasswordEmailActionImpl implements SendResetPasswordEmailAction {
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

    // TODO: find either candidate or company
    const user = await this.userRepository.findUser({ email });

    if (!user) {
      this.loggerService.debug({
        message: 'User not found.',
        email,
      });

      return;
    }

    if (user.getIsDeleted()) {
      this.loggerService.debug({
        message: 'User is blocked.',
        userId: user.getId(),
        email: user.getEmail(),
      });

      return;
    }

    this.loggerService.debug({
      message: 'Sending reset password email...',
      userId: user.getId(),
      email: user.getEmail(),
    });

    const resetPasswordToken = this.tokenService.createToken({
      data: {
        userId: user.getId(),
        type: tokenTypes.passwordReset,
      },
      expiresIn: this.config.token.resetPassword.expiresIn,
    });

    const resetPasswordLink = `${this.config.frontendUrl}/newPassword?token=${resetPasswordToken}`;

    await this.emailMessageBus.sendEvent(
      new EmailEventDraft({
        eventName: emailEventTypes.resetPassword,
        payload: {
          name: user.getEmail(),
          recipientEmail: user.getEmail(),
          resetPasswordLink,
        },
      }),
    );
  }
}

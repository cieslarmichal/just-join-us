import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { tokenTypes } from '../../../../../common/types/tokenType.ts';
import { type Config } from '../../../../../core/config.ts';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.ts';
import { Candidate } from '../../../domain/entities/candidate/candidate.ts';
import type { Company } from '../../../domain/entities/company/company.ts';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEvent.ts';
import { emailEventTypes } from '../../../domain/entities/emailEvent/types/emailEventType.ts';
import type { CandidateRepository } from '../../../domain/repositories/candidateRepository/candidateRepository.ts';
import type { CompanyRepository } from '../../../domain/repositories/companyRepository/companyRepository.ts';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.ts';

import { type ExecutePayload, type SendResetPasswordEmailAction } from './sendResetPasswordEmailAction.ts';

export class SendResetPasswordEmailActionImpl implements SendResetPasswordEmailAction {
  private readonly tokenService: TokenService;
  private readonly userRepository: UserRepository;
  private readonly candidateRepository: CandidateRepository;
  private readonly companyRepository: CompanyRepository;
  private readonly loggerService: LoggerService;
  private readonly config: Config;
  private readonly emailMessageBus: EmailMessageBus;

  public constructor(
    tokenService: TokenService,
    userRepository: UserRepository,
    candidateRepository: CandidateRepository,
    companyRepository: CompanyRepository,
    loggerService: LoggerService,
    config: Config,
    emailMessageBus: EmailMessageBus,
  ) {
    this.tokenService = tokenService;
    this.userRepository = userRepository;
    this.candidateRepository = candidateRepository;
    this.companyRepository = companyRepository;
    this.loggerService = loggerService;
    this.config = config;
    this.emailMessageBus = emailMessageBus;
  }

  public async execute(payload: ExecutePayload): Promise<void> {
    const { email: emailInput } = payload;

    const email = emailInput.toLowerCase();

    const user = await this.getUser(email);

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

    const resetPasswordLink = `${this.config.frontendUrl}/new-password?token=${resetPasswordToken}`;

    await this.emailMessageBus.sendEvent(
      new EmailEventDraft({
        eventName: emailEventTypes.resetPassword,
        payload: {
          name: user instanceof Candidate ? `${user.getFirstName()} ${user.getLastName()}` : user.getName(),
          recipientEmail: user.getEmail(),
          resetPasswordLink,
        },
      }),
    );
  }

  public async getUser(email: string): Promise<Candidate | Company | null> {
    const user = await this.userRepository.findUser({ email });

    if (!user) {
      return null;
    }

    const role = user.getRole();

    if (role === 'candidate') {
      const candidate = await this.candidateRepository.findCandidate({ email });

      return candidate as Candidate;
    } else if (role === 'company') {
      const company = await this.companyRepository.findCompany({ email });

      return company as Company;
    }

    return null;
  }
}

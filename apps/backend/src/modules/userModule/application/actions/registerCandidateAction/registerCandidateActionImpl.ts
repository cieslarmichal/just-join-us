import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import { type CandidateRepository } from '../../../domain/repositories/candidateRepository/candidateRepository.ts';
import type { UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';
import { type HashService } from '../../services/hashService/hashService.ts';
import { type PasswordValidationService } from '../../services/passwordValidationService/passwordValidationService.ts';
import { type SendVerificationEmailAction } from '../sendVerificationEmailAction/sendVerificationEmailAction.ts';

import {
  type RegisterCandidateAction,
  type RegisterCandidateActionPayload,
  type RegisterCandidateActionResult,
} from './registerCandidateAction.ts';

export class RegisterCandidateActionImpl implements RegisterCandidateAction {
  private readonly userRepository: UserRepository;
  private readonly candidateRepository: CandidateRepository;
  private readonly hashService: HashService;
  private readonly loggerService: LoggerService;
  private readonly passwordValidationService: PasswordValidationService;
  private readonly sendVerificationEmailAction: SendVerificationEmailAction;

  public constructor(
    userRepository: UserRepository,
    candidateRepository: CandidateRepository,
    hashService: HashService,
    loggerService: LoggerService,
    passwordValidationService: PasswordValidationService,
    sendVerificationEmailAction: SendVerificationEmailAction,
  ) {
    this.userRepository = userRepository;
    this.candidateRepository = candidateRepository;
    this.hashService = hashService;
    this.loggerService = loggerService;
    this.passwordValidationService = passwordValidationService;
    this.sendVerificationEmailAction = sendVerificationEmailAction;
  }

  public async execute(payload: RegisterCandidateActionPayload): Promise<RegisterCandidateActionResult> {
    const { email: emailInput, password, firstName, lastName, resumeUrl, githubUrl, linkedinUrl } = payload;

    const email = emailInput.toLowerCase();

    this.loggerService.debug({
      message: 'Registering Candidate...',
      email,
      firstName,
      lastName,
      resumeUrl,
      githubUrl,
      linkedinUrl,
    });

    const existingUser = await this.userRepository.findUser({ email });

    if (existingUser) {
      throw new ResourceAlreadyExistsError({
        resource: 'User',
        email,
      });
    }

    this.passwordValidationService.validate({ password });

    const hashedPassword = await this.hashService.hash({ plainData: password });

    const candidate = await this.candidateRepository.createCandidate({
      data: {
        email,
        password: hashedPassword,
        isEmailVerified: false,
        isDeleted: false,
        role: userRoles.candidate,
        firstName,
        lastName,
        resumeUrl,
        githubUrl,
        linkedinUrl,
      },
    });

    this.loggerService.debug({
      message: 'Candidate registered.',
      email,
      id: candidate.getId(),
    });

    await this.sendVerificationEmailAction.execute({ email });

    return { candidate };
  }
}

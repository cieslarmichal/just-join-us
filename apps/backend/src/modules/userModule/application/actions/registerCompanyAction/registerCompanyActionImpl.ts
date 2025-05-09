import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import type { CompanyLocationRepository } from '../../../../locationModule/domain/repositories/companyLocationRepository/companyLocationRepository.ts';
import { type CompanyRepository } from '../../../domain/repositories/companyRepository/companyRepository.ts';
import type { UserRepository } from '../../../domain/repositories/userRepository/userRepository.ts';
import { type HashService } from '../../services/hashService/hashService.ts';
import { type PasswordValidationService } from '../../services/passwordValidationService/passwordValidationService.ts';
import { type SendVerificationEmailAction } from '../sendVerificationEmailAction/sendVerificationEmailAction.ts';

import {
  type RegisterCompanyAction,
  type RegisterCompanyActionPayload,
  type RegisterCompanyActionResult,
} from './registerCompanyAction.ts';

export class RegisterCompanyActionImpl implements RegisterCompanyAction {
  private readonly userRepository: UserRepository;
  private readonly companyRepository: CompanyRepository;
  private readonly companyLocationRepository: CompanyLocationRepository;
  private readonly hashService: HashService;
  private readonly loggerService: LoggerService;
  private readonly passwordValidationService: PasswordValidationService;
  private readonly sendVerificationEmailAction: SendVerificationEmailAction;

  public constructor(
    userRepository: UserRepository,
    companyRepository: CompanyRepository,
    companyLocationRepository: CompanyLocationRepository,
    hashService: HashService,
    loggerService: LoggerService,
    passwordValidationService: PasswordValidationService,
    sendVerificationEmailAction: SendVerificationEmailAction,
  ) {
    this.userRepository = userRepository;
    this.companyRepository = companyRepository;
    this.companyLocationRepository = companyLocationRepository;
    this.hashService = hashService;
    this.loggerService = loggerService;
    this.passwordValidationService = passwordValidationService;
    this.sendVerificationEmailAction = sendVerificationEmailAction;
  }

  public async execute(payload: RegisterCompanyActionPayload): Promise<RegisterCompanyActionResult> {
    const { email: emailInput, password, description, name, phone, logoUrl } = payload;

    const email = emailInput.toLowerCase();

    this.loggerService.debug({
      message: 'Registering Company...',
      email,
      description,
      name,
      phone,
      logoUrl,
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

    const company = await this.companyRepository.createCompany({
      data: {
        email,
        password: hashedPassword,
        isEmailVerified: false,
        isDeleted: false,
        role: userRoles.company,
        name,
        description,
        phone,
        logoUrl,
      },
    });

    this.loggerService.debug({
      message: 'Company registered.',
      email,
      id: company.getId(),
    });

    await this.companyLocationRepository.createCompanyLocation({
      data: {
        name: 'Remote',
        companyId: company.getId(),
        isRemote: true,
      },
    });

    await this.sendVerificationEmailAction.execute({ email });

    return { company };
  }
}

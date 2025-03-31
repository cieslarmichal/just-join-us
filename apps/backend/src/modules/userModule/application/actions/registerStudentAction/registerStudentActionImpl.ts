import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import { type StudentRepository } from '../../../domain/repositories/studentRepository/studentRepository.ts';
import { type HashService } from '../../services/hashService/hashService.ts';
import { type PasswordValidationService } from '../../services/passwordValidationService/passwordValidationService.ts';
import { type SendVerificationEmailAction } from '../sendVerificationEmailAction/sendVerificationEmailAction.ts';

import {
  type RegisterStudentAction,
  type RegisterStudentActionPayload,
  type RegisterStudentActionResult,
} from './registerStudentAction.ts';

export class RegisterStudentActionImpl implements RegisterStudentAction {
  private readonly studentRepository: StudentRepository;
  private readonly hashService: HashService;
  private readonly loggerService: LoggerService;
  private readonly passwordValidationService: PasswordValidationService;
  private readonly sendVerificationEmailAction: SendVerificationEmailAction;

  public constructor(
    studentRepository: StudentRepository,
    hashService: HashService,
    loggerService: LoggerService,
    passwordValidationService: PasswordValidationService,
    sendVerificationEmailAction: SendVerificationEmailAction,
  ) {
    this.studentRepository = studentRepository;
    this.hashService = hashService;
    this.loggerService = loggerService;
    this.passwordValidationService = passwordValidationService;
    this.sendVerificationEmailAction = sendVerificationEmailAction;
  }

  public async execute(payload: RegisterStudentActionPayload): Promise<RegisterStudentActionResult> {
    const { email: emailInput, password, birthDate, firstName, lastName, phone } = payload;

    const email = emailInput.toLowerCase();

    this.loggerService.debug({
      message: 'Registering Student...',
      email,
      birthDate,
      firstName,
      lastName,
      phone,
    });

    const existingStudent = await this.studentRepository.findStudent({ email });

    if (existingStudent) {
      throw new ResourceAlreadyExistsError({
        resource: 'Student',
        email,
      });
    }

    this.passwordValidationService.validate({ password });

    const hashedPassword = await this.hashService.hash({ plainData: password });

    const student = await this.studentRepository.createStudent({
      data: {
        email,
        password: hashedPassword,
        isEmailVerified: true,
        isDeleted: false,
        role: userRoles.student,
        firstName,
        lastName,
        birthDate,
        phone,
      },
    });

    this.loggerService.debug({
      message: 'Student registered.',
      email,
      id: student.getId(),
    });

    await this.sendVerificationEmailAction.execute({ email });

    return { student };
  }
}

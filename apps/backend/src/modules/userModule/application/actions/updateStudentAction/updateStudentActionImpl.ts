import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { type StudentRepository } from '../../../domain/repositories/studentRepository/studentRepository.ts';

import {
  type UpdateStudentActionResult,
  type UpdateStudentAction,
  type UpdateStudentActionPayload,
} from './updateStudentAction.ts';

export class UpdateStudentActionImpl implements UpdateStudentAction {
  private readonly studentRepository: StudentRepository;
  private readonly loggerService: LoggerService;

  public constructor(studentRepository: StudentRepository, loggerService: LoggerService) {
    this.studentRepository = studentRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: UpdateStudentActionPayload): Promise<UpdateStudentActionResult> {
    const { id, firstName, lastName, birthDate, phoneNumber, isDeleted } = payload;

    this.loggerService.debug({
      message: 'Updating student...',
      id,
      firstName,
      lastName,
      birthDate,
      phoneNumber,
      isDeleted,
    });

    const student = await this.studentRepository.findStudent({ id });

    if (!student) {
      throw new OperationNotValidError({
        reason: 'Student not found.',
        id,
      });
    }

    if (firstName !== undefined) {
      student.setFirstName({ firstName });
    }

    if (lastName !== undefined) {
      student.setLastName({ lastName });
    }

    if (birthDate !== undefined) {
      student.setBirthDate({ birthDate });
    }

    if (phoneNumber !== undefined) {
      student.setPhoneNumber({ phoneNumber });
    }

    if (isDeleted !== undefined) {
      student.setIsDeleted({ isDeleted });
    }

    await this.studentRepository.updateStudent({ student });

    return { student };
  }
}

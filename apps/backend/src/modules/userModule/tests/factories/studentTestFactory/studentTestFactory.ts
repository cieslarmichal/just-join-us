import { Generator } from '../../../../../../tests/generator.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import type { StudentRawEntity } from '../../../../databaseModule/infrastructure/tables/studentsTable/studentRawEntity.ts';
import { Student, type StudentDraft } from '../../../domain/entities/student/student.ts';

export class StudentTestFactory {
  public create(input: Partial<StudentDraft> = {}): Student {
    return new Student({
      id: Generator.uuid(),
      email: Generator.email(),
      password: Generator.password(),
      isEmailVerified: Generator.boolean(),
      isDeleted: false,
      role: userRoles.student,
      createdAt: Generator.pastDate(),
      firstName: Generator.firstName(),
      lastName: Generator.lastName(),
      birthDate: Generator.birthDate(),
      phoneNumber: Generator.phoneNumber(),
      ...input,
    });
  }

  public createRaw(input: Partial<StudentRawEntity> = {}): StudentRawEntity {
    return {
      id: Generator.uuid(),
      first_name: Generator.firstName(),
      last_name: Generator.lastName(),
      birth_date: Generator.birthDate(),
      phone_number: Generator.phoneNumber(),
      ...input,
    };
  }
}

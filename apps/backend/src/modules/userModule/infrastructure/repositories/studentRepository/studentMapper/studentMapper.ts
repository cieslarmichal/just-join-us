import type { StudentRawEntityExtended } from '../../../../../databaseModule/infrastructure/tables/studentsTable/studentRawEntity.ts';
import { Student } from '../../../../domain/entities/student/student.ts';

export class StudentMapper {
  public mapToDomain(entity: StudentRawEntityExtended): Student {
    const {
      id,
      email,
      password,
      is_email_verified: isEmailVerified,
      is_deleted: isDeleted,
      role,
      created_at: createdAt,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      birth_date: birthDate,
    } = entity;

    return new Student({
      id,
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
      firstName,
      lastName,
      phoneNumber,
      birthDate,
    });
  }
}

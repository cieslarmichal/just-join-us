import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import type {
  StudentRawEntity,
  StudentRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/studentsTable/studentRawEntity.ts';
import { studentsTable } from '../../../../databaseModule/infrastructure/tables/studentsTable/studentsTable.ts';
import type { UserRawEntity } from '../../../../databaseModule/infrastructure/tables/usersTable/userRawEntity.ts';
import { usersTable } from '../../../../databaseModule/infrastructure/tables/usersTable/usersTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type Student } from '../../../domain/entities/student/student.ts';
import {
  type FindStudentsPayload,
  type FindStudentPayload,
  type CreateStudentPayload,
  type StudentRepository,
  type UpdateStudentPayload,
} from '../../../domain/repositories/studentRepository/studentRepository.ts';

import { type StudentMapper } from './studentMapper/studentMapper.ts';

export class StudentRepositoryImpl implements StudentRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly studentMapper: StudentMapper;
  private readonly uuidService: UuidService;

  public constructor(databaseClient: DatabaseClient, studentMapper: StudentMapper, uuidService: UuidService) {
    this.databaseClient = databaseClient;
    this.studentMapper = studentMapper;
    this.uuidService = uuidService;
  }

  public async createStudent(payload: CreateStudentPayload): Promise<Student> {
    const {
      data: { email, password, isEmailVerified, isDeleted, role, firstName, lastName, birthDate, phone },
    } = payload;

    const id = this.uuidService.generateUuid();

    try {
      await this.databaseClient.transaction(async (transaction) => {
        await transaction<UserRawEntity>(usersTable.name).insert({
          id,
          email,
          password,
          is_email_verified: isEmailVerified,
          is_deleted: isDeleted,
          role,
        });

        await transaction<StudentRawEntity>(studentsTable.name).insert({
          id,
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate,
          phone: phone,
        });
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Student',
        operation: 'create',
        originalError: error,
      });
    }

    const createdStudent = await this.findStudent({ id });

    return createdStudent as Student;
  }

  public async updateStudent(payload: UpdateStudentPayload): Promise<Student> {
    const { student } = payload;

    const { password, isDeleted, isEmailVerified } = student.getUserState();

    const { phone, birthDate, firstName, lastName } = student.getStudentState();

    try {
      await this.databaseClient.transaction(async (transaction) => {
        await transaction<UserRawEntity>(usersTable.name)
          .update({
            password,
            is_email_verified: isEmailVerified,
            is_deleted: isDeleted,
          })
          .where({ id: student.getId() });

        await transaction<StudentRawEntity>(studentsTable.name)
          .update({
            phone: phone,
            birth_date: birthDate,
            first_name: firstName,
            last_name: lastName,
          })
          .where({ id: student.getId() });
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Student',
        operation: 'update',
        originalError: error,
      });
    }

    const updatedStudent = await this.findStudent({ id: student.getId() });

    return updatedStudent as Student;
  }

  public async findStudent(payload: FindStudentPayload): Promise<Student | null> {
    const { id, email } = payload;

    let rawEntity: StudentRawEntityExtended | undefined;

    try {
      const query = this.databaseClient<StudentRawEntityExtended>(studentsTable.name)
        .select([
          usersTable.allColumns,
          studentsTable.columns.first_name,
          studentsTable.columns.last_name,
          studentsTable.columns.birth_date,
          studentsTable.columns.phone,
        ])
        .join(usersTable.name, studentsTable.columns.id, '=', usersTable.columns.id);

      if (id) {
        query.where(usersTable.columns.id, id);
      }

      if (email) {
        query.where(usersTable.columns.email, email);
      }

      rawEntity = await query.first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Student',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.studentMapper.mapToDomain(rawEntity);
  }

  public async findStudents(payload: FindStudentsPayload): Promise<Student[]> {
    const { page, pageSize } = payload;

    let rawEntities: StudentRawEntityExtended[];

    try {
      const query = this.databaseClient<StudentRawEntityExtended>(studentsTable.name)
        .select([
          usersTable.allColumns,
          studentsTable.columns.first_name,
          studentsTable.columns.last_name,
          studentsTable.columns.birth_date,
          studentsTable.columns.phone,
        ])
        .join(usersTable.name, studentsTable.columns.id, '=', usersTable.columns.id)
        .orderBy(studentsTable.columns.id, 'desc');

      rawEntities = await query.limit(pageSize).offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'Student',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.studentMapper.mapToDomain(rawEntity));
  }

  public async countStudents(): Promise<number> {
    try {
      const query = this.databaseClient<StudentRawEntity>(studentsTable.name);

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'Student',
          operation: 'count',
          countResult,
        });
      }

      if (typeof count === 'string') {
        return parseInt(count, 10);
      }

      return count;
    } catch (error) {
      throw new RepositoryError({
        entity: 'Student',
        operation: 'count',
        originalError: error,
      });
    }
  }
}

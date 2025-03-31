import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import { StudentTestFactory } from '../../../tests/factories/studentTestFactory/studentTestFactory.ts';
import { type StudentTestUtils } from '../../../tests/utils/studentTestUtils/studentTestUtils.ts';

import { type RegisterStudentAction } from './registerStudentAction.ts';

describe('RegisterStudentAction', () => {
  let action: RegisterStudentAction;

  let databaseClient: DatabaseClient;

  let studentTestUtils: StudentTestUtils;

  const studentTestFactory = new StudentTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<RegisterStudentAction>(symbols.registerStudentAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    studentTestUtils = container.get<StudentTestUtils>(testSymbols.studentTestUtils);

    await studentTestUtils.truncate();
  });

  afterEach(async () => {
    await studentTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('creates a Student', async () => {
    const student = studentTestFactory.create();

    const { student: createdStudent } = await action.execute({
      email: student.getEmail(),
      password: student.getPassword(),
      firstName: student.getFirstName(),
      lastName: student.getLastName(),
      birthDate: student.getBirthDate(),
      phone: student.getPhone(),
    });

    const foundStudent = await studentTestUtils.findByEmail({ email: student.getEmail() });

    expect(createdStudent.getState()).toEqual({
      email: student.getEmail(),
      password: expect.any(String),
      isEmailVerified: false,
      isDeleted: false,
      role: userRoles.student,
      firstName: student.getFirstName(),
      lastName: student.getLastName(),
      birthDate: student.getBirthDate(),
      phone: student.getPhone(),
      createdAt: expect.any(Date),
    });

    expect(foundStudent).toEqual({
      id: createdStudent.getId(),
      email: student.getEmail(),
      password: expect.any(String),
      is_email_verified: false,
      is_deleted: false,
      role: userRoles.student,
      first_name: student.getFirstName(),
      last_name: student.getLastName(),
      birth_date: student.getBirthDate(),
      phone: student.getPhone(),
      created_at: expect.any(Date),
    });
  });

  it('throws an error when a Student with the same email already exists', async () => {
    const existingStudent = await studentTestUtils.createAndPersist();

    const student = studentTestFactory.create();

    try {
      await action.execute({
        email: existingStudent.email,
        password: student.getPassword(),
        firstName: student.getFirstName(),
        lastName: student.getLastName(),
        birthDate: student.getBirthDate(),
        phone: student.getPhone(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

      expect((error as ResourceAlreadyExistsError).context).toEqual({
        resource: 'Student',
        email: existingStudent.email,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error when password does not meet requirements', async () => {
    const student = studentTestFactory.create();

    try {
      await action.execute({
        email: student.getEmail(),
        password: '123',
        firstName: student.getFirstName(),
        lastName: student.getLastName(),
        birthDate: student.getBirthDate(),
        phone: student.getPhone(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      return;
    }

    expect.fail();
  });
});

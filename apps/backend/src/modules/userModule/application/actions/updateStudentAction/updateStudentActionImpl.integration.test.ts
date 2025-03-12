import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import { type StudentTestUtils } from '../../../tests/utils/studentTestUtils/studentTestUtils.ts';

import { type UpdateStudentAction } from './updateStudentAction.ts';

describe('UpdateStudentActionImpl', () => {
  let action: UpdateStudentAction;

  let databaseClient: DatabaseClient;

  let studentTestUtils: StudentTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<UpdateStudentAction>(symbols.updateStudentAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    studentTestUtils = container.get<StudentTestUtils>(testSymbols.studentTestUtils);

    await studentTestUtils.truncate();
  });

  afterEach(async () => {
    await studentTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('updates student data', async () => {
    const student = await studentTestUtils.createAndPersist();

    const firstName = Generator.firstName();

    const lastName = Generator.lastName();

    const birthDate = Generator.birthDate();

    const phoneNumber = Generator.phoneNumber();

    const isDeleted = Generator.boolean();

    await action.execute({
      id: student.id,
      firstName,
      lastName,
      birthDate,
      phoneNumber,
      isDeleted,
    });

    const updatedStudent = await studentTestUtils.findById({ id: student.id });

    expect(updatedStudent?.first_name).toBe(firstName);

    expect(updatedStudent?.last_name).toBe(lastName);

    expect(updatedStudent?.birth_date).toStrictEqual(birthDate);

    expect(updatedStudent?.phone_number).toBe(phoneNumber);

    expect(updatedStudent?.is_deleted).toBe(isDeleted);
  });

  it('throws an error - when a Student with given id not found', async () => {
    const studentId = Generator.uuid();

    const firstName = Generator.firstName();

    try {
      await action.execute({
        id: studentId,
        firstName,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Student not found.',
        id: studentId,
      });

      return;
    }

    expect.fail();
  });
});

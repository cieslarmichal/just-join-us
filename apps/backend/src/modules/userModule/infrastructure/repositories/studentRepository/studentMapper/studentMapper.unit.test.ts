import { beforeEach, expect, describe, it } from 'vitest';

import { StudentTestFactory } from '../../../../tests/factories/studentTestFactory/studentTestFactory.ts';
import { UserTestFactory } from '../../../../tests/factories/userTestFactory/userTestFactory.ts';

import { StudentMapper } from './studentMapper.ts';

describe('StudentMapper', () => {
  let mapper: StudentMapper;

  const userTestFactory = new UserTestFactory();

  const studentTestFactory = new StudentTestFactory();

  beforeEach(async () => {
    mapper = new StudentMapper();
  });

  it('maps from StudentUserRawEntity to Student', async () => {
    const userRawEntity = userTestFactory.createRaw();

    const studentRawEntity = studentTestFactory.createRaw();

    const studentUser = {
      ...userRawEntity,
      ...studentRawEntity,
    };

    const student = mapper.mapToDomain(studentUser);

    expect(student.getId()).toEqual(studentRawEntity.id);

    expect(student.getState()).toEqual({
      email: userRawEntity.email,
      password: userRawEntity.password,
      isEmailVerified: userRawEntity.is_email_verified,
      isDeleted: userRawEntity.is_deleted,
      role: userRawEntity.role,
      createdAt: userRawEntity.created_at,
      firstName: studentRawEntity.first_name,
      lastName: studentRawEntity.last_name,
      birthDate: studentRawEntity.birth_date,
      phoneNumber: studentRawEntity.phone_number,
    });
  });
});

import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { Company } from '../../../domain/entities/company/company.ts';
import type { Student } from '../../../domain/entities/student/student.ts';
import { symbols } from '../../../symbols.ts';
import { UserTestFactory } from '../../../tests/factories/userTestFactory/userTestFactory.ts';
import type { CompanyTestUtils } from '../../../tests/utils/companyTestUtils/companyTestUtils.ts';
import type { StudentTestUtils } from '../../../tests/utils/studentTestUtils/studentTestUtils.ts';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.ts';

import { type FindUserAction } from './findUserAction.ts';

describe('FindUserAction', () => {
  let action: FindUserAction;

  let databaseClient: DatabaseClient;

  let userTestUtils: UserTestUtils;

  let studentTestUtils: StudentTestUtils;

  let companyTestUtils: CompanyTestUtils;

  const userTestFactory = new UserTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindUserAction>(symbols.findUserAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    studentTestUtils = container.get<StudentTestUtils>(testSymbols.studentTestUtils);

    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);

    await userTestUtils.truncate();
    await studentTestUtils.truncate();
    await companyTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();
    await studentTestUtils.truncate();
    await companyTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('finds user by id', async () => {
    it('throws an error if a user with given id does not exist', async () => {
      const nonExistingUser = userTestFactory.create();

      try {
        await action.execute({ id: nonExistingUser.getId() });
      } catch (error) {
        expect(error).toBeInstanceOf(ResourceNotFoundError);

        return;
      }

      expect.fail();
    });

    it('finds admin user', async () => {
      const user = await userTestUtils.createAndPersist({
        input: { role: 'admin' },
      });

      const { user: foundUser } = await action.execute({ id: user.id });

      expect(foundUser.getUserState()).toEqual({
        email: user.email,
        password: user.password,
        role: 'admin',
        isEmailVerified: user.is_email_verified,
        isDeleted: user.is_deleted,
        createdAt: user.created_at,
      });
    });

    it('finds student', async () => {
      const student = await studentTestUtils.createAndPersist();

      const { user: foundUser } = await action.execute({ id: student.id });

      expect((foundUser as Student).getState()).toEqual({
        email: student.email,
        password: student.password,
        role: 'student',
        isEmailVerified: student.is_email_verified,
        isDeleted: student.is_deleted,
        createdAt: student.created_at,
        firstName: student.first_name,
        lastName: student.last_name,
        birthDate: student.birth_date,
        phoneNumber: student.phone_number,
      });
    });

    it('finds company', async () => {
      const company = await companyTestUtils.createAndPersist();

      const { user: foundUser } = await action.execute({ id: company.id });

      expect((foundUser as Company).getState()).toEqual({
        email: company.email,
        password: company.password,
        role: 'company',
        isEmailVerified: company.is_email_verified,
        isDeleted: company.is_deleted,
        createdAt: company.created_at,
        name: company.name,
        logoUrl: company.logo_url,
        phoneNumber: company.phone_number,
        taxIdNumber: company.tax_id_number,
        isVerified: company.is_verified,
      });
    });
  });

  describe('finds user by id and role', async () => {
    it('throws an error if a user with given id does not exist', async () => {
      const nonExistingUser = userTestFactory.create();

      try {
        await action.execute({ id: nonExistingUser.getId(), role: 'admin' });
      } catch (error) {
        expect(error).toBeInstanceOf(ResourceNotFoundError);

        return;
      }

      expect.fail();
    });

    it('finds admin user', async () => {
      const user = await userTestUtils.createAndPersist({
        input: { role: 'admin' },
      });

      const { user: foundUser } = await action.execute({ id: user.id, role: 'admin' });

      expect(foundUser.getUserState()).toEqual({
        email: user.email,
        password: user.password,
        role: 'admin',
        isEmailVerified: user.is_email_verified,
        isDeleted: user.is_deleted,
        createdAt: user.created_at,
      });
    });

    it('finds student', async () => {
      const student = await studentTestUtils.createAndPersist();

      const { user: foundUser } = await action.execute({ id: student.id, role: 'student' });

      expect((foundUser as Student).getState()).toEqual({
        email: student.email,
        password: student.password,
        role: 'student',
        isEmailVerified: student.is_email_verified,
        isDeleted: student.is_deleted,
        createdAt: student.created_at,
        firstName: student.first_name,
        lastName: student.last_name,
        birthDate: student.birth_date,
        phoneNumber: student.phone_number,
      });
    });

    it('finds company', async () => {
      const company = await companyTestUtils.createAndPersist();

      const { user: foundUser } = await action.execute({ id: company.id, role: 'company' });

      expect((foundUser as Company).getState()).toEqual({
        email: company.email,
        password: company.password,
        role: 'company',
        isEmailVerified: company.is_email_verified,
        isDeleted: company.is_deleted,
        createdAt: company.created_at,
        name: company.name,
        logoUrl: company.logo_url,
        phoneNumber: company.phone_number,
        taxIdNumber: company.tax_id_number,
        isVerified: company.is_verified,
      });
    });
  });
});

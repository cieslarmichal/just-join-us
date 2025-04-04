import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import type { Candidate } from '../../../domain/entities/candidate/candidate.ts';
import type { Company } from '../../../domain/entities/company/company.ts';
import { symbols } from '../../../symbols.ts';
import { UserTestFactory } from '../../../tests/factories/userTestFactory/userTestFactory.ts';
import type { CandidateTestUtils } from '../../../tests/utils/candidateTestUtils/candidateTestUtils.ts';
import type { CompanyTestUtils } from '../../../tests/utils/companyTestUtils/companyTestUtils.ts';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.ts';

import { type FindUserAction } from './findUserAction.ts';

describe('FindUserAction', () => {
  let action: FindUserAction;

  let databaseClient: DatabaseClient;

  let userTestUtils: UserTestUtils;

  let candidateTestUtils: CandidateTestUtils;

  let companyTestUtils: CompanyTestUtils;

  const userTestFactory = new UserTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<FindUserAction>(symbols.findUserAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    candidateTestUtils = container.get<CandidateTestUtils>(testSymbols.candidateTestUtils);

    companyTestUtils = container.get<CompanyTestUtils>(testSymbols.companyTestUtils);

    await userTestUtils.truncate();
    await candidateTestUtils.truncate();
    await companyTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();
    await candidateTestUtils.truncate();
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

    it('finds candidate', async () => {
      const candidate = await candidateTestUtils.createAndPersist();

      const { user: foundUser } = await action.execute({ id: candidate.id });

      expect((foundUser as Candidate).getState()).toEqual({
        email: candidate.email,
        password: candidate.password,
        role: 'candidate',
        isEmailVerified: candidate.is_email_verified,
        isDeleted: candidate.is_deleted,
        createdAt: candidate.created_at,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        resumeUrl: candidate.resume_url,
        linkedinUrl: candidate.linkedin_url,
        githubUrl: candidate.github_url,
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
        phone: company.phone,
        description: company.description,
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

    it('finds candidate', async () => {
      const candidate = await candidateTestUtils.createAndPersist();

      const { user: foundUser } = await action.execute({ id: candidate.id, role: 'candidate' });

      expect((foundUser as Candidate).getState()).toEqual({
        email: candidate.email,
        password: candidate.password,
        role: 'candidate',
        isEmailVerified: candidate.is_email_verified,
        isDeleted: candidate.is_deleted,
        createdAt: candidate.created_at,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        resumeUrl: candidate.resume_url,
        linkedinUrl: candidate.linkedin_url,
        githubUrl: candidate.github_url,
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
        phone: company.phone,
        description: company.description,
      });
    });
  });
});

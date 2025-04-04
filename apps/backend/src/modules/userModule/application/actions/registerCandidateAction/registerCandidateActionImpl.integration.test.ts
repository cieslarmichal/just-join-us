import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import { CandidateTestFactory } from '../../../tests/factories/candidateTestFactory/candidateTestFactory.ts';
import { type CandidateTestUtils } from '../../../tests/utils/candidateTestUtils/candidateTestUtils.ts';

import { type RegisterCandidateAction } from './registerCandidateAction.ts';

describe('RegisterCandidateAction', () => {
  let action: RegisterCandidateAction;

  let databaseClient: DatabaseClient;

  let candidateTestUtils: CandidateTestUtils;

  const candidateTestFactory = new CandidateTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<RegisterCandidateAction>(symbols.registerCandidateAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    candidateTestUtils = container.get<CandidateTestUtils>(testSymbols.candidateTestUtils);

    await candidateTestUtils.truncate();
  });

  afterEach(async () => {
    await candidateTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('creates a Candidate', async () => {
    const candidate = candidateTestFactory.create();

    const { candidate: createdCandidate } = await action.execute({
      email: candidate.getEmail(),
      password: candidate.getPassword(),
      firstName: candidate.getFirstName(),
      lastName: candidate.getLastName(),
      githubUrl: candidate.getGithubUrl(),
      linkedinUrl: candidate.getLinkedinUrl(),
      resumeUrl: candidate.getResumeUrl(),
    });

    const foundCandidate = await candidateTestUtils.findByEmail({ email: candidate.getEmail() });

    expect(createdCandidate.getState()).toEqual({
      email: candidate.getEmail(),
      password: expect.any(String),
      isEmailVerified: false,
      isDeleted: false,
      role: userRoles.candidate,
      firstName: candidate.getFirstName(),
      lastName: candidate.getLastName(),
      githubUrl: candidate.getGithubUrl(),
      linkedinUrl: candidate.getLinkedinUrl(),
      resumeUrl: candidate.getResumeUrl(),
      createdAt: expect.any(Date),
    });

    expect(foundCandidate).toEqual({
      id: createdCandidate.getId(),
      email: candidate.getEmail(),
      password: expect.any(String),
      is_email_verified: false,
      is_deleted: false,
      role: userRoles.candidate,
      first_name: candidate.getFirstName(),
      last_name: candidate.getLastName(),
      github_url: candidate.getGithubUrl(),
      linkedin_url: candidate.getLinkedinUrl(),
      resume_url: candidate.getResumeUrl(),
      created_at: expect.any(Date),
    });
  });

  it('throws an error when a Candidate with the same email already exists', async () => {
    const existingCandidate = await candidateTestUtils.createAndPersist();

    const candidate = candidateTestFactory.create();

    try {
      await action.execute({
        email: existingCandidate.email,
        password: candidate.getPassword(),
        firstName: candidate.getFirstName(),
        lastName: candidate.getLastName(),
        githubUrl: candidate.getGithubUrl(),
        linkedinUrl: candidate.getLinkedinUrl(),
        resumeUrl: candidate.getResumeUrl(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

      expect((error as ResourceAlreadyExistsError).context).toEqual({
        resource: 'Candidate',
        email: existingCandidate.email,
      });

      return;
    }

    expect.fail();
  });

  it('throws an error when password does not meet requirements', async () => {
    const candidate = candidateTestFactory.create();

    try {
      await action.execute({
        email: candidate.getEmail(),
        password: '123',
        firstName: candidate.getFirstName(),
        lastName: candidate.getLastName(),
        githubUrl: candidate.getGithubUrl(),
        linkedinUrl: candidate.getLinkedinUrl(),
        resumeUrl: candidate.getResumeUrl(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      return;
    }

    expect.fail();
  });
});

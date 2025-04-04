import { beforeEach, expect, describe, it } from 'vitest';

import { CandidateTestFactory } from '../../../../tests/factories/candidateTestFactory/candidateTestFactory.ts';
import { UserTestFactory } from '../../../../tests/factories/userTestFactory/userTestFactory.ts';

import { CandidateMapper } from './candidateMapper.ts';

describe('CandidateMapper', () => {
  let mapper: CandidateMapper;

  const userTestFactory = new UserTestFactory();

  const candidateTestFactory = new CandidateTestFactory();

  beforeEach(async () => {
    mapper = new CandidateMapper();
  });

  it('maps from CandidateUserRawEntity to Candidate', async () => {
    const userRawEntity = userTestFactory.createRaw();

    const candidateRawEntity = candidateTestFactory.createRaw();

    const candidateUser = {
      ...userRawEntity,
      ...candidateRawEntity,
    };

    const candidate = mapper.mapToDomain(candidateUser);

    expect(candidate.getId()).toEqual(candidateRawEntity.id);

    expect(candidate.getState()).toEqual({
      email: userRawEntity.email,
      password: userRawEntity.password,
      isEmailVerified: userRawEntity.is_email_verified,
      isDeleted: userRawEntity.is_deleted,
      role: userRawEntity.role,
      createdAt: userRawEntity.created_at,
      firstName: candidateRawEntity.first_name,
      lastName: candidateRawEntity.last_name,
      githubUrl: candidateRawEntity.github_url,
      linkedinUrl: candidateRawEntity.linkedin_url,
      resumeUrl: candidateRawEntity.resume_url,
    });
  });
});

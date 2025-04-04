import { beforeEach, describe, expect, it, afterEach } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { symbols } from '../../../symbols.ts';
import { type CandidateTestUtils } from '../../../tests/utils/candidateTestUtils/candidateTestUtils.ts';

import { type UpdateCandidateAction } from './updateCandidateAction.ts';

describe('UpdateCandidateActionImpl', () => {
  let action: UpdateCandidateAction;

  let databaseClient: DatabaseClient;

  let candidateTestUtils: CandidateTestUtils;

  beforeEach(async () => {
    const container = await TestContainer.create();

    action = container.get<UpdateCandidateAction>(symbols.updateCandidateAction);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    candidateTestUtils = container.get<CandidateTestUtils>(testSymbols.candidateTestUtils);

    await candidateTestUtils.truncate();
  });

  afterEach(async () => {
    await candidateTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('updates candidate data', async () => {
    const candidate = await candidateTestUtils.createAndPersist();

    const firstName = Generator.firstName();
    const lastName = Generator.lastName();
    const githubUrl = Generator.url();
    const linkedinUrl = Generator.url();
    const resumeUrl = Generator.url();
    const isDeleted = Generator.boolean();

    await action.execute({
      id: candidate.id,
      firstName,
      lastName,
      githubUrl,
      linkedinUrl,
      resumeUrl,
      isDeleted,
    });

    const updatedCandidate = await candidateTestUtils.findById({ id: candidate.id });

    expect(updatedCandidate?.first_name).toBe(firstName);
    expect(updatedCandidate?.last_name).toBe(lastName);
    expect(updatedCandidate?.github_url).toBe(githubUrl);
    expect(updatedCandidate?.linkedin_url).toBe(linkedinUrl);
    expect(updatedCandidate?.resume_url).toBe(resumeUrl);
    expect(updatedCandidate?.is_deleted).toBe(isDeleted);
  });

  it('throws an error - when a Candidate with given id not found', async () => {
    const candidateId = Generator.uuid();

    const firstName = Generator.firstName();

    try {
      await action.execute({
        id: candidateId,
        firstName,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(OperationNotValidError);

      expect((error as OperationNotValidError).context).toMatchObject({
        reason: 'Candidate not found.',
        id: candidateId,
      });

      return;
    }

    expect.fail();
  });
});

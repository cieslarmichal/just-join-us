import { Generator } from '../../../../../../tests/generator.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import type { CandidateRawEntity } from '../../../../databaseModule/infrastructure/tables/candidatesTable/candidateRawEntity.ts';
import { Candidate, type CandidateDraft } from '../../../domain/entities/candidate/candidate.ts';

export class CandidateTestFactory {
  public create(input: Partial<CandidateDraft> = {}): Candidate {
    return new Candidate({
      id: Generator.uuid(),
      email: Generator.email(),
      password: Generator.password(),
      isEmailVerified: Generator.boolean(),
      isDeleted: false,
      role: userRoles.candidate,
      createdAt: Generator.pastDate(),
      firstName: Generator.firstName(),
      lastName: Generator.lastName(),
      githubUrl: Generator.url(),
      linkedinUrl: Generator.url(),
      resumeUrl: Generator.url(),
      ...input,
    });
  }

  public createRaw(input: Partial<CandidateRawEntity> = {}): CandidateRawEntity {
    return {
      id: Generator.uuid(),
      first_name: Generator.firstName(),
      last_name: Generator.lastName(),
      github_url: Generator.url(),
      linkedin_url: Generator.url(),
      resume_url: Generator.url(),
      ...input,
    };
  }
}

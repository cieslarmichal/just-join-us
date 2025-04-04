import type { CandidateRawEntityExtended } from '../../../../../databaseModule/infrastructure/tables/candidatesTable/candidateRawEntity.ts';
import { Candidate } from '../../../../domain/entities/candidate/candidate.ts';

export class CandidateMapper {
  public mapToDomain(entity: CandidateRawEntityExtended): Candidate {
    const {
      id,
      email,
      password,
      is_email_verified: isEmailVerified,
      is_deleted: isDeleted,
      role,
      created_at: createdAt,
      first_name: firstName,
      last_name: lastName,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      resume_url: resumeUrl,
    } = entity;

    return new Candidate({
      id,
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
      firstName,
      lastName,
      githubUrl,
      linkedinUrl,
      resumeUrl,
    });
  }
}

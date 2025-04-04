import { type Action } from '../../../../../common/types/action.ts';
import { type Candidate } from '../../../domain/entities/candidate/candidate.ts';

export interface UpdateCandidateActionPayload {
  readonly id: string;
  readonly firstName?: string | undefined;
  readonly lastName?: string | undefined;
  readonly isDeleted?: boolean | undefined;
  readonly resumeUrl?: string | undefined;
  readonly githubUrl?: string | undefined;
  readonly linkedinUrl?: string | undefined;
}

export interface UpdateCandidateActionResult {
  readonly candidate: Candidate;
}

export type UpdateCandidateAction = Action<UpdateCandidateActionPayload, UpdateCandidateActionResult>;

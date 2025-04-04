import { type Action } from '../../../../../common/types/action.ts';
import { type Candidate } from '../../../domain/entities/candidate/candidate.ts';

export interface RegisterCandidateActionPayload {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly resumeUrl?: string | undefined;
  readonly linkedinUrl?: string | undefined;
  readonly githubUrl?: string | undefined;
}

export interface RegisterCandidateActionResult {
  readonly candidate: Candidate;
}

export type RegisterCandidateAction = Action<RegisterCandidateActionPayload, RegisterCandidateActionResult>;

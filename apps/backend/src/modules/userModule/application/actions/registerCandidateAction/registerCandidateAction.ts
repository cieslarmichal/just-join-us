import { type Action } from '../../../../../common/types/action.ts';
import { type Candidate } from '../../../domain/entities/candidate/candidate.ts';

export interface RegisterCandidateActionPayload {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly birthDate: Date;
}

export interface RegisterCandidateActionResult {
  readonly candidate: Candidate;
}

export type RegisterCandidateAction = Action<RegisterCandidateActionPayload, RegisterCandidateActionResult>;

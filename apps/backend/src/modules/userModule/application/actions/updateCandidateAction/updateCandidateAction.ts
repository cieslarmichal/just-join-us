import { type Action } from '../../../../../common/types/action.ts';
import { type Candidate } from '../../../domain/entities/candidate/candidate.ts';

export interface UpdateCandidateActionPayload {
  readonly id: string;
  readonly firstName?: string | undefined;
  readonly lastName?: string | undefined;
  readonly birthDate?: Date | undefined;
  readonly phone?: string | undefined;
  readonly isDeleted?: boolean | undefined;
}

export interface UpdateCandidateActionResult {
  readonly candidate: Candidate;
}

export type UpdateCandidateAction = Action<UpdateCandidateActionPayload, UpdateCandidateActionResult>;

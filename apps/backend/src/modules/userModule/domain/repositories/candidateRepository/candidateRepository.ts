import { type Candidate, type CandidateDraft } from '../../entities/candidate/candidate.ts';

export interface CreateCandidatePayload {
  readonly data: Omit<CandidateDraft, 'id' | 'createdAt'>;
}

export interface UpdateCandidatePayload {
  readonly candidate: Candidate;
}

export interface FindCandidatePayload {
  readonly id?: string;
  readonly email?: string;
}

export interface FindCandidatesPayload {
  readonly page: number;
  readonly pageSize: number;
}

export interface CandidateRepository {
  createCandidate(payload: CreateCandidatePayload): Promise<Candidate>;
  updateCandidate(payload: UpdateCandidatePayload): Promise<Candidate>;
  findCandidate(payload: FindCandidatePayload): Promise<Candidate | null>;
  findCandidates(payload: FindCandidatesPayload): Promise<Candidate[]>;
  countCandidates(): Promise<number>;
}

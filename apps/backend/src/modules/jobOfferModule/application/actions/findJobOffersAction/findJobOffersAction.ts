import { type Action } from '../../../../../common/types/action.ts';
import type { JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';

export interface FindJobOffersActionPayload {
  readonly name?: string | undefined;
  readonly companyId?: string | undefined;
  readonly categoryId?: string | undefined;
  readonly employmentType?: string | undefined;
  readonly workingTime?: string | undefined;
  readonly experienceLevel?: string | undefined;
  readonly minSalary?: number | undefined;
  readonly maxSalary?: number | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export interface FindJobOffersActionResult {
  readonly data: JobOffer[];
  readonly total: number;
}

export type FindJobOffersAction = Action<FindJobOffersActionPayload, FindJobOffersActionResult>;

import { type Action } from '../../../../../common/types/action.ts';
import type { JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';

export interface UpdateJobOfferActionPayload {
  readonly id: string;
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly categoryId?: string | undefined;
  readonly isHidden?: boolean | undefined;
  readonly employmentType?: string | undefined;
  readonly workingTime?: string | undefined;
  readonly experienceLevel?: string | undefined;
  readonly minSalary?: number | undefined;
  readonly maxSalary?: number | undefined;
  readonly skillIds?: string[] | undefined;
  readonly locationIds?: string[] | undefined;
}

export interface UpdateJobOfferActionResult {
  readonly jobOffer: JobOffer;
}

export type UpdateJobOfferAction = Action<UpdateJobOfferActionPayload, UpdateJobOfferActionResult>;

import { type Action } from '../../../../../common/types/action.ts';
import type { JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';

export interface CreateJobOfferActionPayload {
  readonly name: string;
  readonly description: string;
  readonly categoryId: string;
  readonly companyId: string;
  readonly employmentType: string;
  readonly workingTime: string;
  readonly experienceLevel: string;
  readonly minSalary: number;
  readonly maxSalary: number;
  readonly skillIds: string[];
  readonly locationIds: string[];
}

export interface CreateJobOfferActionResult {
  readonly jobOffer: JobOffer;
}

export type CreateJobOfferAction = Action<CreateJobOfferActionPayload, CreateJobOfferActionResult>;

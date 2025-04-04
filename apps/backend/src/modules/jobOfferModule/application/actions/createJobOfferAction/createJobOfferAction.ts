import { type Action } from '../../../../../common/types/action.ts';
import type { JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';

export interface CreateJobOfferActionPayload {
  readonly name: string;
  readonly description: string;
  readonly categoryId: string;
  readonly companyId: string;
}

export interface CreateJobOfferActionResult {
  readonly jobOffer: JobOffer;
}

export type CreateJobOfferAction = Action<CreateJobOfferActionPayload, CreateJobOfferActionResult>;

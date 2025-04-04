import { type Action } from '../../../../../common/types/action.ts';
import type { JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';

export interface UpdateJobOfferActionPayload {
  readonly id: string;
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly categoryId?: string | undefined;
  readonly isHidden?: boolean | undefined;
}

export interface UpdateJobOfferEventActionResult {
  readonly jobOffer: JobOffer;
}

export type UpdateJobOfferAction = Action<UpdateJobOfferActionPayload, UpdateJobOfferEventActionResult>;

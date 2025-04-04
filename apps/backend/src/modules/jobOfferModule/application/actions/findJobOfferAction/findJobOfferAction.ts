import { type Action } from '../../../../../common/types/action.ts';
import { type JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';

export interface FindJobOfferActionPayload {
  readonly id: string;
}

export interface FindJobOfferActionResult {
  readonly jobOffer: JobOffer;
}

export type FindJobOfferAction = Action<FindJobOfferActionPayload, FindJobOfferActionResult>;

import { type JobOfferState, type JobOffer } from '../../entities/jobOffer/jobOffer.ts';

export interface CreateJobOfferPayload {
  readonly data: Omit<JobOfferState, 'id' | 'createdAt'>;
}

export interface UpdateJobOfferPayload {
  readonly jobOffer: JobOffer;
}

export interface FindJobOfferPayload {
  readonly id?: string;
  readonly companyId?: string;
  readonly name?: string;
}

export interface FindJobOffersPayload {
  readonly name?: string | undefined;
  readonly companyId: string;
  readonly page: number;
  readonly pageSize: number;
}

export interface CountJobOffersPayload {
  readonly name?: string | undefined;
  readonly companyId: string;
}

export interface JobOfferRepository {
  createJobOffer(payload: CreateJobOfferPayload): Promise<JobOffer>;
  updateJobOffer(payload: UpdateJobOfferPayload): Promise<JobOffer>;
  findJobOffer(payload: FindJobOfferPayload): Promise<JobOffer | null>;
  findJobOffers(payload: FindJobOffersPayload): Promise<JobOffer[]>;
  countJobOffers(payload: CountJobOffersPayload): Promise<number>;
}

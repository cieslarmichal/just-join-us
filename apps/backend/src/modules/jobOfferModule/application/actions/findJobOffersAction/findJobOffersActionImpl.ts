import type { JobOfferRepository } from '../../../domain/repositories/jobOfferRepository/jobOfferRepository.ts';

import {
  type FindJobOffersAction,
  type FindJobOffersActionPayload,
  type FindJobOffersActionResult,
} from './findJobOffersAction.ts';

export class FindJobOffersActionImpl implements FindJobOffersAction {
  private readonly jobOfferRepository: JobOfferRepository;

  public constructor(jobOfferRepository: JobOfferRepository) {
    this.jobOfferRepository = jobOfferRepository;
  }

  public async execute(payload: FindJobOffersActionPayload): Promise<FindJobOffersActionResult> {
    const { name, companyId, page, pageSize } = payload;

    const [jobOffers, total] = await Promise.all([
      this.jobOfferRepository.findJobOffers({ companyId, name, page, pageSize }),
      this.jobOfferRepository.countJobOffers({ companyId, name }),
    ]);

    return { data: jobOffers, total };
  }
}

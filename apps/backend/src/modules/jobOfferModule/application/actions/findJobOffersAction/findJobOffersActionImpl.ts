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
    const {
      name,
      category,
      employmentType,
      experienceLevel,
      maxSalary,
      minSalary,
      workingTime,
      companyId,
      city,
      sort,
      page,
      pageSize,
    } = payload;

    const [jobOffers, total] = await Promise.all([
      this.jobOfferRepository.findJobOffers({
        companyId,
        category,
        employmentType,
        experienceLevel,
        maxSalary,
        minSalary,
        workingTime,
        name,
        city,
        sort,
        page,
        pageSize,
      }),
      this.jobOfferRepository.countJobOffers({
        category,
        employmentType,
        experienceLevel,
        maxSalary,
        minSalary,
        workingTime,
        companyId,
        name,
        city,
      }),
    ]);

    return { data: jobOffers, total };
  }
}

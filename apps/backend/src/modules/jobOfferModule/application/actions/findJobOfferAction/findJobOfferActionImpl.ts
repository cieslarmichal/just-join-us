import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import { type JobOfferRepository } from '../../../domain/repositories/jobOfferRepository/jobOfferRepository.ts';

import {
  type FindJobOfferAction,
  type FindJobOfferActionPayload,
  type FindJobOfferActionResult,
} from './findJobOfferAction.ts';

export class FindJobOfferActionImpl implements FindJobOfferAction {
  private readonly jobOfferRepository: JobOfferRepository;

  public constructor(jobOfferRepository: JobOfferRepository) {
    this.jobOfferRepository = jobOfferRepository;
  }

  public async execute(payload: FindJobOfferActionPayload): Promise<FindJobOfferActionResult> {
    const { id } = payload;

    const jobOffer = await this.jobOfferRepository.findJobOffer({ id });

    if (!jobOffer) {
      throw new ResourceNotFoundError({
        resource: 'JobOffer',
        id,
      });
    }

    return { jobOffer };
  }
}

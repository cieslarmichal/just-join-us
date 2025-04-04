import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CategoryRepository } from '../../../domain/repositories/categoryRepository/categoryRepository.ts';
import type { JobOfferRepository } from '../../../domain/repositories/jobOfferRepository/jobOfferRepository.ts';

import {
  type UpdateJobOfferEventActionResult,
  type UpdateJobOfferAction,
  type UpdateJobOfferActionPayload,
} from './updateJobOfferAction.ts';

export class UpdateJobOfferActionImpl implements UpdateJobOfferAction {
  private readonly jobOfferRepository: JobOfferRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    jobOfferRepository: JobOfferRepository,
    categoryRepository: CategoryRepository,
    loggerService: LoggerService,
  ) {
    this.jobOfferRepository = jobOfferRepository;
    this.categoryRepository = categoryRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: UpdateJobOfferActionPayload): Promise<UpdateJobOfferEventActionResult> {
    const { id, name, description, categoryId, isHidden } = payload;

    this.loggerService.debug({
      message: 'Updating JobOffer...',
      id,
      name,
      description,
      categoryId,
      isHidden,
    });

    const jobOffer = await this.jobOfferRepository.findJobOffer({ id });

    if (!jobOffer) {
      throw new OperationNotValidError({
        reason: 'JobOffer not found.',
        id,
      });
    }

    if (name) {
      jobOffer.setName({ name });
    }

    if (description) {
      jobOffer.setDescription({ description });
    }

    if (categoryId) {
      const category = await this.categoryRepository.findCategory({ id: categoryId });

      if (!category) {
        throw new OperationNotValidError({
          reason: 'Category not found.',
          id: categoryId,
        });
      }

      jobOffer.setCategory({ category });
    }

    if (isHidden !== undefined) {
      jobOffer.setIsHidden({ isHidden });
    }

    await this.jobOfferRepository.updateJobOffer({ jobOffer });

    this.loggerService.debug({ message: 'JobOffer updated.', id });

    return { jobOffer };
  }
}

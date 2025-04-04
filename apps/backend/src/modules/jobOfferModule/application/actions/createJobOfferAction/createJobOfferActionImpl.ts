import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CompanyRepository } from '../../../../userModule/domain/repositories/companyRepository/companyRepository.ts';
import type { CategoryRepository } from '../../../domain/repositories/categoryRepository/categoryRepository.ts';
import type { JobOfferRepository } from '../../../domain/repositories/jobOfferRepository/jobOfferRepository.ts';

import {
  type CreateJobOfferAction,
  type CreateJobOfferActionPayload,
  type CreateJobOfferActionResult,
} from './createJobOfferAction.ts';

export class CreateJobOfferActionImpl implements CreateJobOfferAction {
  private readonly jobOfferRepository: JobOfferRepository;
  private readonly companyRepository: CompanyRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    jobOfferRepository: JobOfferRepository,
    companyRepository: CompanyRepository,
    categoryRepository: CategoryRepository,
    loggerService: LoggerService,
  ) {
    this.jobOfferRepository = jobOfferRepository;
    this.companyRepository = companyRepository;
    this.categoryRepository = categoryRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: CreateJobOfferActionPayload): Promise<CreateJobOfferActionResult> {
    const { name, description, categoryId, companyId } = payload;

    this.loggerService.debug({
      message: 'Creating JobOffer...',
      name,
      description,
      categoryId,
      companyId,
    });

    const existingJobOffer = await this.jobOfferRepository.findJobOffer({ name, companyId });

    if (existingJobOffer) {
      throw new ResourceAlreadyExistsError({
        resource: 'JobOffer',
        id: existingJobOffer.getId(),
        name,
        companyId,
      });
    }

    const company = await this.companyRepository.findCompany({ id: companyId });

    if (!company) {
      throw new OperationNotValidError({
        reason: 'Company not found.',
        id: companyId,
      });
    }

    const category = await this.categoryRepository.findCategory({ id: categoryId });

    if (!category) {
      throw new OperationNotValidError({
        reason: 'Category not found.',
        id: categoryId,
      });
    }

    const jobOffer = await this.jobOfferRepository.createJobOffer({
      data: {
        name,
        description,
        isHidden: false,
        categoryId,
        companyId,
      },
    });

    this.loggerService.debug({
      message: 'JobOffer created.',
      id: jobOffer.getId(),
      name,
      companyId,
    });

    return { jobOffer };
  }
}

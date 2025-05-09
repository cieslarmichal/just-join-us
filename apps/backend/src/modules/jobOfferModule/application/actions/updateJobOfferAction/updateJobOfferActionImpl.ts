import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CompanyLocationRepository } from '../../../../locationModule/domain/repositories/companyLocationRepository/companyLocationRepository.ts';
import type { CategoryRepository } from '../../../domain/repositories/categoryRepository/categoryRepository.ts';
import type { JobOfferRepository } from '../../../domain/repositories/jobOfferRepository/jobOfferRepository.ts';
import type { SkillRepository } from '../../../domain/repositories/skillRepository/skillRepository.ts';

import {
  type UpdateJobOfferActionResult,
  type UpdateJobOfferAction,
  type UpdateJobOfferActionPayload,
} from './updateJobOfferAction.ts';

export class UpdateJobOfferActionImpl implements UpdateJobOfferAction {
  private readonly jobOfferRepository: JobOfferRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly skillRepository: SkillRepository;
  private readonly companyLocationRepository: CompanyLocationRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    jobOfferRepository: JobOfferRepository,
    categoryRepository: CategoryRepository,
    skillRepository: SkillRepository,
    companyLocationRepository: CompanyLocationRepository,
    loggerService: LoggerService,
  ) {
    this.jobOfferRepository = jobOfferRepository;
    this.categoryRepository = categoryRepository;
    this.skillRepository = skillRepository;
    this.companyLocationRepository = companyLocationRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: UpdateJobOfferActionPayload): Promise<UpdateJobOfferActionResult> {
    const {
      id,
      name,
      description,
      categoryId,
      isHidden,
      employmentType,
      experienceLevel,
      locationIds,
      maxSalary,
      minSalary,
      skillIds,
      workingTime,
    } = payload;

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

    if (employmentType) {
      jobOffer.setEmploymentType({ employmentType });
    }

    if (workingTime) {
      jobOffer.setWorkingTime({ workingTime });
    }

    if (experienceLevel) {
      jobOffer.setExperienceLevel({ experienceLevel });
    }

    if (minSalary) {
      jobOffer.setMinSalary({ minSalary });
    }

    if (maxSalary) {
      jobOffer.setMaxSalary({ maxSalary });
    }

    if (skillIds) {
      const skills = await this.skillRepository.findSkills({ ids: skillIds, page: 1, pageSize: skillIds.length });

      if (skills.length !== skillIds.length) {
        throw new OperationNotValidError({
          reason: 'Some skills not found.',
          ids: skillIds,
        });
      }

      jobOffer.setSkills({ skills });
    }

    if (locationIds) {
      const locations = await this.companyLocationRepository.findCompanyLocations({
        ids: locationIds,
        page: 1,
        pageSize: locationIds.length,
      });

      if (locations.length !== locationIds.length) {
        throw new OperationNotValidError({
          reason: 'Some locations not found.',
          ids: locationIds,
        });
      }

      jobOffer.setLocations({ locations });
    }

    await this.jobOfferRepository.updateJobOffer({ jobOffer });

    this.loggerService.debug({ message: 'JobOffer updated.', id });

    return { jobOffer };
  }
}

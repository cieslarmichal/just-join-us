import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CompanyLocationRepository } from '../../../../locationModule/domain/repositories/companyLocationRepository/companyLocationRepository.ts';
import type { CompanyRepository } from '../../../../userModule/domain/repositories/companyRepository/companyRepository.ts';
import type { CategoryRepository } from '../../../domain/repositories/categoryRepository/categoryRepository.ts';
import type { JobOfferRepository } from '../../../domain/repositories/jobOfferRepository/jobOfferRepository.ts';
import type { SkillRepository } from '../../../domain/repositories/skillRepository/skillRepository.ts';

import {
  type CreateJobOfferAction,
  type CreateJobOfferActionPayload,
  type CreateJobOfferActionResult,
} from './createJobOfferAction.ts';

export class CreateJobOfferActionImpl implements CreateJobOfferAction {
  private readonly jobOfferRepository: JobOfferRepository;
  private readonly companyRepository: CompanyRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly skillRepository: SkillRepository;
  private readonly companyLocationRepository: CompanyLocationRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    jobOfferRepository: JobOfferRepository,
    companyRepository: CompanyRepository,
    categoryRepository: CategoryRepository,
    skillRepository: SkillRepository,
    companyLocationRepository: CompanyLocationRepository,
    loggerService: LoggerService,
  ) {
    this.jobOfferRepository = jobOfferRepository;
    this.companyRepository = companyRepository;
    this.categoryRepository = categoryRepository;
    this.skillRepository = skillRepository;
    this.companyLocationRepository = companyLocationRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: CreateJobOfferActionPayload): Promise<CreateJobOfferActionResult> {
    const {
      name,
      description,
      categoryId,
      companyId,
      employmentType,
      experienceLevel,
      workingTime,
      minSalary,
      maxSalary,
      locationIds,
      skillIds,
    } = payload;

    this.loggerService.debug({
      message: 'Creating JobOffer...',
      name,
      description,
      categoryId,
      companyId,
      employmentType,
      experienceLevel,
      workingTime,
      minSalary,
      maxSalary,
      locationIds,
      skillIds,
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

    const locations = await this.companyLocationRepository.findCompanyLocations({ ids: locationIds });

    if (locationIds.length !== locations.length) {
      throw new OperationNotValidError({
        reason: 'Some locations not found.',
        id: locationIds,
      });
    }

    const skills = await this.skillRepository.findSkills({ ids: skillIds, page: 1, pageSize: skillIds.length });

    if (skillIds.length !== skills.length) {
      throw new OperationNotValidError({
        reason: 'Some skills not found.',
        id: skillIds,
      });
    }

    const jobOffer = await this.jobOfferRepository.createJobOffer({
      data: {
        name,
        description,
        isHidden: false,
        categoryId,
        companyId,
        employmentType,
        experienceLevel,
        workingTime,
        minSalary,
        maxSalary,
        skills: skills.map((skill) => ({
          id: skill.getId(),
          name: skill.getName(),
        })),
        locations: locations.map((location) => ({
          id: location.getId(),
          isRemote: location.getIsRemote(),
          city: location.getCityId(),
        })),
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

import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
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
      locationId,
      isRemote,
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
      locationId,
      isRemote,
      skillIds,
    });

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

    if (locationId) {
      const location = await this.companyLocationRepository.findCompanyLocation({ id: locationId });

      if (!location) {
        throw new OperationNotValidError({
          reason: 'Location not found.',
          id: locationId,
        });
      }
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
        isRemote,
        categoryId,
        companyId,
        employmentType,
        experienceLevel,
        workingTime,
        minSalary,
        maxSalary,
        locationId: locationId || undefined,
        skills: skills.map((skill) => ({
          id: skill.getId(),
          name: skill.getName(),
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

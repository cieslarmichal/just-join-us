import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import { categoriesTable } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoriesTable.ts';
import { companiesLocationsTable } from '../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companiesLocationsTable.ts';
import { companiesTable } from '../../../../databaseModule/infrastructure/tables/companiesTable/companiesTable.ts';
import { type JobOfferLocationRawEntity } from '../../../../databaseModule/infrastructure/tables/jobOfferLocationsTable/jobOfferLocationRawEntity.ts';
import { jobOfferLocationsTable } from '../../../../databaseModule/infrastructure/tables/jobOfferLocationsTable/jobOfferLocationsTable.ts';
import { type JobOfferSkillRawEntity } from '../../../../databaseModule/infrastructure/tables/jobOfferSkillsTable/jobOfferSkillRawEntity.ts';
import { jobOfferSkillsTable } from '../../../../databaseModule/infrastructure/tables/jobOfferSkillsTable/jobOfferSkillsTable.ts';
import type {
  JobOfferRawEntity,
  JobOfferRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOfferRawEntity.ts';
import { jobOffersTable } from '../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOffersTable.ts';
import { skillsTable } from '../../../../databaseModule/infrastructure/tables/skillsTable/skillsTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type JobOffer } from '../../../domain/entities/jobOffer/jobOffer.ts';
import {
  type JobOfferRepository,
  type CreateJobOfferPayload,
  type FindJobOfferPayload,
  type FindJobOffersPayload,
  type UpdateJobOfferPayload,
  type CountJobOffersPayload,
} from '../../../domain/repositories/jobOfferRepository/jobOfferRepository.ts';

import { type JobOfferMapper } from './jobOfferMapper/jobOfferMapper.ts';

export class JobOfferRepositoryImpl implements JobOfferRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly jobOfferMapper: JobOfferMapper;
  private readonly uuidService: UuidService;

  public constructor(databaseClient: DatabaseClient, jobOfferMapper: JobOfferMapper, uuidService: UuidService) {
    this.databaseClient = databaseClient;
    this.jobOfferMapper = jobOfferMapper;
    this.uuidService = uuidService;
  }

  public async createJobOffer(payload: CreateJobOfferPayload): Promise<JobOffer> {
    const {
      data: {
        name,
        description,
        isHidden,
        categoryId,
        companyId,
        employmentType,
        experienceLevel,
        minSalary,
        maxSalary,
        workingTime,
        locations,
        skills,
      },
    } = payload;

    const jobOfferId = this.uuidService.generateUuid();

    try {
      await this.databaseClient.transaction(async (transaction) => {
        await transaction<JobOfferRawEntity>(jobOffersTable.name).insert({
          id: jobOfferId,
          name,
          description,
          is_hidden: isHidden,
          category_id: categoryId,
          company_id: companyId,
          employment_type: employmentType,
          working_time: workingTime,
          experience_level: experienceLevel,
          min_salary: minSalary,
          max_salary: maxSalary,
        });

        if (skills?.length) {
          await transaction.batchInsert<JobOfferSkillRawEntity>(
            jobOfferSkillsTable.name,
            skills.map((skill) => ({
              id: this.uuidService.generateUuid(),
              job_offer_id: jobOfferId,
              skill_id: skill.id,
            })),
          );
        }

        if (locations?.length) {
          await transaction.batchInsert<JobOfferLocationRawEntity>(
            jobOfferLocationsTable.name,
            locations.map((location) => ({
              id: this.uuidService.generateUuid(),
              job_offer_id: jobOfferId,
              company_location_id: location.id,
            })),
          );
        }
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'JobOffer',
        operation: 'create',
        originalError: error,
      });
    }

    const createdJobOffer = await this.findJobOffer({ id: jobOfferId });

    return createdJobOffer as JobOffer;
  }

  public async updateJobOffer(payload: UpdateJobOfferPayload): Promise<JobOffer> {
    const { jobOffer } = payload;

    const existingJobOffer = await this.findJobOffer({ id: jobOffer.getId() });

    if (!existingJobOffer) {
      throw new ResourceNotFoundError({
        resource: 'JobOffer',
        id: jobOffer.getId(),
      });
    }

    const {
      name,
      description,
      isHidden,
      categoryId,
      employmentType,
      experienceLevel,
      minSalary,
      maxSalary,
      workingTime,
      skills: updatedSkills,
      locations: updatedLocations,
    } = jobOffer.getState();

    try {
      await this.databaseClient.transaction(async (transaction) => {
        await this.databaseClient<JobOfferRawEntity>(jobOffersTable.name)
          .update({
            name,
            description,
            is_hidden: isHidden,
            category_id: categoryId,
            employment_type: employmentType,
            working_time: workingTime,
            experience_level: experienceLevel,
            min_salary: minSalary,
            max_salary: maxSalary,
          })
          .where({ id: jobOffer.getId() });

        const existingSkills = existingJobOffer.getSkills();

        const addedSkills = updatedSkills?.filter(
          (skill) => !existingSkills?.some((existingSkill) => existingSkill.id === skill.id),
        );

        const removedSkills = existingSkills?.filter(
          (skill) => !updatedSkills?.some((updatedSkill) => updatedSkill.id === skill.id),
        );

        if (addedSkills && addedSkills.length > 0) {
          await transaction.batchInsert<JobOfferSkillRawEntity>(
            jobOfferSkillsTable.name,
            addedSkills.map((skill) => ({
              id: this.uuidService.generateUuid(),
              job_offer_id: jobOffer.getId(),
              skill_id: skill.id,
            })),
          );
        }

        if (removedSkills && removedSkills.length > 0) {
          await transaction<JobOfferSkillRawEntity>(jobOfferSkillsTable.name)
            .delete()
            .whereIn(
              'skill_id',
              removedSkills.map((skill) => skill.id),
            )
            .andWhere({ job_offer_id: jobOffer.getId() });
        }

        const existingLocations = existingJobOffer.getLocations();

        const addedLocations = updatedLocations?.filter(
          (location) => !existingLocations?.some((existingLocation) => existingLocation.id === location.id),
        );

        const removedLocations = existingLocations?.filter(
          (location) => !updatedLocations?.some((updatedLocation) => updatedLocation.id === location.id),
        );

        if (addedLocations && addedLocations.length > 0) {
          await transaction.batchInsert<JobOfferLocationRawEntity>(
            jobOfferLocationsTable.name,
            addedLocations.map((location) => ({
              id: this.uuidService.generateUuid(),
              job_offer_id: jobOffer.getId(),
              company_location_id: location.id,
            })),
          );
        }

        if (removedLocations && removedLocations.length > 0) {
          await transaction<JobOfferLocationRawEntity>(jobOfferLocationsTable.name)
            .delete()
            .whereIn(
              'company_location_id',
              removedLocations.map((location) => location.id),
            )
            .andWhere({ job_offer_id: jobOffer.getId() });
        }
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'JobOffer',
        operation: 'update',
        originalError: error,
      });
    }

    const updatedJobOffer = await this.findJobOffer({ id: jobOffer.getId() });

    return updatedJobOffer as JobOffer;
  }

  public async findJobOffer(payload: FindJobOfferPayload): Promise<JobOffer | null> {
    const { id, name, companyId } = payload;

    let rawEntity: JobOfferRawEntityExtended | undefined;

    try {
      const query = this.databaseClient<JobOfferRawEntityExtended>(jobOffersTable.name)
        .select([
          jobOffersTable.columns.id,
          jobOffersTable.columns.name,
          jobOffersTable.columns.description,
          jobOffersTable.columns.is_hidden,
          jobOffersTable.columns.created_at,
          jobOffersTable.columns.category_id,
          jobOffersTable.columns.company_id,
          jobOffersTable.columns.employment_type,
          jobOffersTable.columns.working_time,
          jobOffersTable.columns.experience_level,
          jobOffersTable.columns.min_salary,
          jobOffersTable.columns.max_salary,
          `${categoriesTable.columns.name} as category_name`,
          `${companiesTable.columns.name} as company_name`,
          `${companiesTable.columns.logo_url} as company_logo_url`,
          this.databaseClient.raw(`array_agg(DISTINCT "skills"."id") as "skill_ids"`),
          this.databaseClient.raw(`array_agg(DISTINCT "skills"."name") as "skill_names"`),
          this.databaseClient.raw(`array_agg(DISTINCT "companies_locations"."id") as "location_ids"`),
          this.databaseClient.raw(`array_agg(DISTINCT "companies_locations"."is_remote") as "location_is_remote"`),
          this.databaseClient.raw(`array_agg(DISTINCT "companies_locations"."city_id") as "location_cities"`),
        ])
        .join(categoriesTable.name, jobOffersTable.columns.category_id, '=', categoriesTable.columns.id)
        .join(companiesTable.name, jobOffersTable.columns.company_id, '=', companiesTable.columns.id)
        .leftJoin(jobOfferSkillsTable.name, jobOffersTable.columns.id, '=', jobOfferSkillsTable.columns.job_offer_id)
        .leftJoin(skillsTable.name, jobOfferSkillsTable.columns.skill_id, '=', skillsTable.columns.id)
        .leftJoin(
          jobOfferLocationsTable.name,
          jobOffersTable.columns.id,
          '=',
          jobOfferLocationsTable.columns.job_offer_id,
        )
        .leftJoin(
          companiesLocationsTable.name,
          jobOfferLocationsTable.columns.company_location_id,
          '=',
          companiesLocationsTable.columns.id,
        )
        .groupBy(
          jobOffersTable.columns.id,
          categoriesTable.columns.name,
          companiesTable.columns.name,
          companiesTable.columns.logo_url,
        );

      if (id) {
        query.where(jobOffersTable.columns.id, '=', id);
      }

      if (name) {
        query.andWhere(jobOffersTable.columns.name, '=', name);
      }

      if (companyId) {
        query.andWhere(jobOffersTable.columns.company_id, '=', companyId);
      }

      rawEntity = await query.first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'JobOffer',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.jobOfferMapper.mapExtendedToDomain(rawEntity);
  }

  public async findJobOffers(payload: FindJobOffersPayload): Promise<JobOffer[]> {
    const {
      name,
      companyId,
      categoryId,
      employmentType,
      experienceLevel,
      minSalary,
      maxSalary,
      workingTime,
      page,
      pageSize,
    } = payload;

    let rawEntities: JobOfferRawEntityExtended[];

    try {
      const query = this.databaseClient<JobOfferRawEntityExtended>(jobOffersTable.name)
        .select([
          jobOffersTable.columns.id,
          jobOffersTable.columns.name,
          jobOffersTable.columns.description,
          jobOffersTable.columns.is_hidden,
          jobOffersTable.columns.created_at,
          jobOffersTable.columns.category_id,
          jobOffersTable.columns.company_id,
          jobOffersTable.columns.employment_type,
          jobOffersTable.columns.working_time,
          jobOffersTable.columns.experience_level,
          jobOffersTable.columns.min_salary,
          jobOffersTable.columns.max_salary,
          `${categoriesTable.columns.name} as category_name`,
          `${companiesTable.columns.name} as company_name`,
          `${companiesTable.columns.logo_url} as company_logo_url`,
          this.databaseClient.raw(`array_agg(DISTINCT "skills"."id") as "skill_ids"`),
          this.databaseClient.raw(`array_agg(DISTINCT "skills"."name") as "skill_names"`),
          this.databaseClient.raw(`array_agg(DISTINCT "companies_locations"."id") as "location_ids"`),
          this.databaseClient.raw(`array_agg(DISTINCT "companies_locations"."is_remote") as "location_is_remote"`),
          this.databaseClient.raw(`array_agg(DISTINCT "companies_locations"."city_id") as "location_cities"`),
        ])
        .join(categoriesTable.name, jobOffersTable.columns.category_id, '=', categoriesTable.columns.id)
        .join(companiesTable.name, jobOffersTable.columns.company_id, '=', companiesTable.columns.id)
        .leftJoin(jobOfferSkillsTable.name, jobOffersTable.columns.id, '=', jobOfferSkillsTable.columns.job_offer_id)
        .leftJoin(skillsTable.name, jobOfferSkillsTable.columns.skill_id, '=', skillsTable.columns.id)
        .leftJoin(
          jobOfferLocationsTable.name,
          jobOffersTable.columns.id,
          '=',
          jobOfferLocationsTable.columns.job_offer_id,
        )
        .leftJoin(
          companiesLocationsTable.name,
          jobOfferLocationsTable.columns.company_location_id,
          '=',
          companiesLocationsTable.columns.id,
        )
        .groupBy(
          jobOffersTable.columns.id,
          categoriesTable.columns.name,
          companiesTable.columns.name,
          companiesTable.columns.logo_url,
        );

      if (name) {
        query.whereRaw(`${jobOffersTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      if (companyId) {
        query.where(jobOffersTable.columns.company_id, '=', companyId);
      }

      if (categoryId) {
        query.where(jobOffersTable.columns.category_id, '=', categoryId);
      }

      if (employmentType) {
        query.where(jobOffersTable.columns.employment_type, '=', employmentType);
      }

      if (experienceLevel) {
        query.where(jobOffersTable.columns.experience_level, '=', experienceLevel);
      }

      if (minSalary) {
        query.where(jobOffersTable.columns.min_salary, '>=', minSalary);
      }

      if (maxSalary) {
        query.where(jobOffersTable.columns.max_salary, '<=', maxSalary);
      }

      if (workingTime) {
        query.where(jobOffersTable.columns.working_time, '=', workingTime);
      }

      rawEntities = await query
        .orderBy(jobOffersTable.columns.id, 'desc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'JobOffer',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.jobOfferMapper.mapExtendedToDomain(rawEntity));
  }

  public async countJobOffers(payload: CountJobOffersPayload): Promise<number> {
    const { name, companyId, categoryId, employmentType, experienceLevel, maxSalary, minSalary, workingTime } = payload;

    try {
      const query = this.databaseClient<JobOfferRawEntity>(jobOffersTable.name);

      if (name) {
        query.whereRaw(`${jobOffersTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      if (companyId) {
        query.where(jobOffersTable.columns.company_id, '=', companyId);
      }

      if (categoryId) {
        query.where(jobOffersTable.columns.category_id, '=', categoryId);
      }

      if (employmentType) {
        query.where(jobOffersTable.columns.employment_type, '=', employmentType);
      }

      if (experienceLevel) {
        query.where(jobOffersTable.columns.experience_level, '=', experienceLevel);
      }

      if (minSalary) {
        query.where(jobOffersTable.columns.min_salary, '>=', minSalary);
      }

      if (maxSalary) {
        query.where(jobOffersTable.columns.max_salary, '<=', maxSalary);
      }

      if (workingTime) {
        query.where(jobOffersTable.columns.working_time, '=', workingTime);
      }

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'JobOffer',
          operation: 'count',
          countResult,
        });
      }

      if (typeof count === 'string') {
        return parseInt(count, 10);
      }

      return count;
    } catch (error) {
      throw new RepositoryError({
        entity: 'JobOffer',
        operation: 'count',
        originalError: error,
      });
    }
  }
}

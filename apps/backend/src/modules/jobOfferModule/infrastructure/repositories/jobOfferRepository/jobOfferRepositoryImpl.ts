import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import { categoriesTable } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoriesTable.ts';
import { companiesTable } from '../../../../databaseModule/infrastructure/tables/companiesTable/companiesTable.ts';
import type {
  JobOfferRawEntity,
  JobOfferRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOfferRawEntity.ts';
import { jobOffersTable } from '../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOffersTable.ts';
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
      data: { name, description, isHidden, categoryId, companyId },
    } = payload;

    let rawEntities: JobOfferRawEntity[];

    const id = this.uuidService.generateUuid();

    try {
      rawEntities = await this.databaseClient<JobOfferRawEntity>(jobOffersTable.name).insert(
        {
          id,
          name,
          description,
          is_hidden: isHidden,
          category_id: categoryId,
          company_id: companyId,
        },
        '*',
      );
    } catch (error) {
      throw new RepositoryError({
        entity: 'JobOffer',
        operation: 'create',
        originalError: error,
      });
    }

    const rawEntity = rawEntities[0] as JobOfferRawEntity;

    return this.jobOfferMapper.mapToDomain(rawEntity);
  }

  public async updateJobOffer(payload: UpdateJobOfferPayload): Promise<JobOffer> {
    const { jobOffer } = payload;

    let rawEntities: JobOfferRawEntity[] = [];

    const { name, description, isHidden, categoryId } = jobOffer.getState();

    try {
      rawEntities = await this.databaseClient<JobOfferRawEntity>(jobOffersTable.name)
        .update(
          {
            name,
            description,
            is_hidden: isHidden,
            category_id: categoryId,
          },
          '*',
        )
        .where({ id: jobOffer.getId() });
    } catch (error) {
      throw new RepositoryError({
        entity: 'JobOffer',
        operation: 'update',
        originalError: error,
      });
    }

    const rawEntity = rawEntities[0] as JobOfferRawEntity;

    return this.jobOfferMapper.mapToDomain(rawEntity);
  }

  public async findJobOffer(payload: FindJobOfferPayload): Promise<JobOffer | null> {
    const { id, name, companyId } = payload;

    let rawEntity: JobOfferRawEntityExtended | undefined;

    try {
      const query = this.databaseClient<JobOfferRawEntityExtended>(jobOffersTable.name)
        .select([
          jobOffersTable.allColumns,
          `${categoriesTable.columns.name} as category_name`,
          `${companiesTable.columns.name} as company_name`,
          `${companiesTable.columns.logo_url} as company_logo_url`,
        ])
        .join(categoriesTable.name, jobOffersTable.columns.category_id, '=', categoriesTable.columns.id)
        .join(companiesTable.name, jobOffersTable.columns.company_id, '=', companiesTable.columns.id);

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
    const { name, companyId, page, pageSize } = payload;

    let rawEntities: JobOfferRawEntityExtended[];

    try {
      const query = this.databaseClient<JobOfferRawEntityExtended>(jobOffersTable.name)
        .select([
          jobOffersTable.allColumns,
          `${categoriesTable.columns.name} as category_name`,
          `${companiesTable.columns.name} as company_name`,
          `${companiesTable.columns.logo_url} as company_logo_url`,
        ])
        .join(categoriesTable.name, jobOffersTable.columns.category_id, '=', categoriesTable.columns.id)
        .join(companiesTable.name, jobOffersTable.columns.company_id, '=', companiesTable.columns.id)
        .where(jobOffersTable.columns.company_id, '=', companyId);

      if (name) {
        query.whereRaw(`${jobOffersTable.columns.name} ILIKE ?`, `%${name}%`);
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
    const { name, companyId } = payload;

    try {
      const query = this.databaseClient<JobOfferRawEntity>(jobOffersTable.name).where({ company_id: companyId });

      if (name) {
        query.whereRaw(`${jobOffersTable.columns.name} ILIKE ?`, `%${name}%`);
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

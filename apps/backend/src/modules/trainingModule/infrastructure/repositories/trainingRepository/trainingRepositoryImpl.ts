import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import { categoriesTable } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoriesTable.ts';
import { companiesTable } from '../../../../databaseModule/infrastructure/tables/companiesTable/companiesTable.ts';
import type {
  TrainingRawEntity,
  TrainingRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/trainingsTable/trainingRawEntity.ts';
import { trainingsTable } from '../../../../databaseModule/infrastructure/tables/trainingsTable/trainingsTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type Training } from '../../../domain/entities/training/training.ts';
import {
  type TrainingRepository,
  type CreateTrainingPayload,
  type FindTrainingPayload,
  type FindTrainingsPayload,
  type UpdateTrainingPayload,
  type CountTrainingsPayload,
} from '../../../domain/repositories/trainingRepository/trainingRepository.ts';

import { type TrainingMapper } from './trainingMapper/trainingMapper.ts';

export class TrainingRepositoryImpl implements TrainingRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly trainingMapper: TrainingMapper;
  private readonly uuidService: UuidService;

  public constructor(databaseClient: DatabaseClient, trainingMapper: TrainingMapper, uuidService: UuidService) {
    this.databaseClient = databaseClient;
    this.trainingMapper = trainingMapper;
    this.uuidService = uuidService;
  }

  public async createTraining(payload: CreateTrainingPayload): Promise<Training> {
    const {
      data: { name, description, isHidden, categoryId, companyId },
    } = payload;

    let rawEntities: TrainingRawEntity[];

    const id = this.uuidService.generateUuid();

    try {
      rawEntities = await this.databaseClient<TrainingRawEntity>(trainingsTable.name).insert(
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
        entity: 'Training',
        operation: 'create',
        originalError: error,
      });
    }

    const rawEntity = rawEntities[0] as TrainingRawEntity;

    return this.trainingMapper.mapToDomain(rawEntity);
  }

  public async updateTraining(payload: UpdateTrainingPayload): Promise<Training> {
    const { training } = payload;

    let rawEntities: TrainingRawEntity[] = [];

    const { name, description, isHidden, categoryId } = training.getState();

    try {
      rawEntities = await this.databaseClient<TrainingRawEntity>(trainingsTable.name)
        .update(
          {
            name,
            description,
            is_hidden: isHidden,
            category_id: categoryId,
          },
          '*',
        )
        .where({ id: training.getId() });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Training',
        operation: 'update',
        originalError: error,
      });
    }

    const rawEntity = rawEntities[0] as TrainingRawEntity;

    return this.trainingMapper.mapToDomain(rawEntity);
  }

  public async findTraining(payload: FindTrainingPayload): Promise<Training | null> {
    const { id, name, companyId } = payload;

    let rawEntity: TrainingRawEntityExtended | undefined;

    try {
      const query = this.databaseClient<TrainingRawEntityExtended>(trainingsTable.name)
        .select([
          trainingsTable.allColumns,
          `${categoriesTable.columns.name} as category_name`,
          `${companiesTable.columns.name} as company_name`,
          `${companiesTable.columns.logo_url} as company_logo_url`,
        ])
        .join(categoriesTable.name, trainingsTable.columns.category_id, '=', categoriesTable.columns.id)
        .join(companiesTable.name, trainingsTable.columns.company_id, '=', companiesTable.columns.id);

      if (id) {
        query.where(trainingsTable.columns.id, '=', id);
      }

      if (name) {
        query.andWhere(trainingsTable.columns.name, '=', name);
      }

      if (companyId) {
        query.andWhere(trainingsTable.columns.company_id, '=', companyId);
      }

      rawEntity = await query.first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Training',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.trainingMapper.mapExtendedToDomain(rawEntity);
  }

  public async findTrainings(payload: FindTrainingsPayload): Promise<Training[]> {
    const { name, companyId, page, pageSize } = payload;

    let rawEntities: TrainingRawEntityExtended[];

    try {
      const query = this.databaseClient<TrainingRawEntityExtended>(trainingsTable.name)
        .select([
          trainingsTable.allColumns,
          `${categoriesTable.columns.name} as category_name`,
          `${companiesTable.columns.name} as company_name`,
          `${companiesTable.columns.logo_url} as company_logo_url`,
        ])
        .join(categoriesTable.name, trainingsTable.columns.category_id, '=', categoriesTable.columns.id)
        .join(companiesTable.name, trainingsTable.columns.company_id, '=', companiesTable.columns.id)
        .where(trainingsTable.columns.company_id, '=', companyId);

      if (name) {
        query.whereRaw(`${trainingsTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      rawEntities = await query
        .orderBy(trainingsTable.columns.id, 'desc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'Training',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.trainingMapper.mapExtendedToDomain(rawEntity));
  }

  public async countTrainings(payload: CountTrainingsPayload): Promise<number> {
    const { name, companyId } = payload;

    try {
      const query = this.databaseClient<TrainingRawEntity>(trainingsTable.name).where({ company_id: companyId });

      if (name) {
        query.whereRaw(`${trainingsTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'Training',
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
        entity: 'Training',
        operation: 'count',
        originalError: error,
      });
    }
  }
}

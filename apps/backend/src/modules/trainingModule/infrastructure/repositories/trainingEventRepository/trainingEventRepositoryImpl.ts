import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import { categoriesTable } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoriesTable.ts';
import { companiesTable } from '../../../../databaseModule/infrastructure/tables/companiesTable/companiesTable.ts';
import type {
  TrainingEventRawEntity,
  TrainingEventRawEntityExtended,
} from '../../../../databaseModule/infrastructure/tables/trainingEventTable/trainingEventRawEntity.ts';
import { trainingEventsTable } from '../../../../databaseModule/infrastructure/tables/trainingEventTable/trainingEventsTable.ts';
import { trainingsTable } from '../../../../databaseModule/infrastructure/tables/trainingsTable/trainingsTable.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type TrainingEvent } from '../../../domain/entities/trainingEvent/trainingEvent.ts';
import {
  type FindTrainingEventsPayload,
  type FindTrainingEventPayload,
  type CreateTrainingEventPayload,
  type TrainingEventRepository,
  type UpdateTrainingEventPayload,
  type CountTrainingEventsPayload,
} from '../../../domain/repositories/trainingEventRepository/trainingEventRepository.ts';

import { type TrainingEventMapper } from './trainingEventMapper/trainingEventMapper.ts';

export class TrainingEventRepositoryImpl implements TrainingEventRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly trainingEventMapper: TrainingEventMapper;
  private readonly uuidService: UuidService;

  public constructor(
    databaseClient: DatabaseClient,
    trainingEventMapper: TrainingEventMapper,
    uuidService: UuidService,
  ) {
    this.databaseClient = databaseClient;
    this.trainingEventMapper = trainingEventMapper;
    this.uuidService = uuidService;
  }

  public async createTrainingEvent(payload: CreateTrainingEventPayload): Promise<TrainingEvent> {
    const {
      data: { city, place, latitude, longitude, centPrice, startsAt, endsAt, isHidden, trainingId },
    } = payload;

    const id = this.uuidService.generateUuid();

    try {
      await this.databaseClient<TrainingEventRawEntity>(trainingEventsTable.name).insert({
        id,
        city,
        place,
        geolocation: this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
          latitude,
          longitude,
        ]),
        cent_price: centPrice,
        starts_at: startsAt,
        ends_at: endsAt,
        is_hidden: isHidden,
        training_id: trainingId,
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Training',
        operation: 'create',
        originalError: error,
      });
    }

    const createdTrainingEvent = await this.findTrainingEvent({ id });

    return createdTrainingEvent as TrainingEvent;
  }

  public async updateTrainingEvent(payload: UpdateTrainingEventPayload): Promise<TrainingEvent> {
    const { trainingEvent } = payload;

    const { centPrice, city, startsAt, endsAt, isHidden, latitude, longitude, place } = trainingEvent.getState();

    try {
      await this.databaseClient<TrainingEventRawEntity>(trainingEventsTable.name)
        .update({
          cent_price: centPrice,
          geolocation: this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
            latitude,
            longitude,
          ]),
          place,
          city,
          starts_at: startsAt,
          ends_at: endsAt,
          is_hidden: isHidden,
        })
        .where({ id: trainingEvent.getId() });
    } catch (error) {
      throw new RepositoryError({
        entity: 'TrainingEvent',
        operation: 'update',
        originalError: error,
      });
    }

    const updatedTrainingEvent = await this.findTrainingEvent({ id: trainingEvent.getId() });

    return updatedTrainingEvent as TrainingEvent;
  }

  public async findTrainingEvent(payload: FindTrainingEventPayload): Promise<TrainingEvent | null> {
    const { id } = payload;

    let rawEntity: TrainingEventRawEntityExtended | undefined;

    try {
      rawEntity = await this.databaseClient<TrainingEventRawEntityExtended>(trainingEventsTable.name)
        .select([
          trainingEventsTable.columns.id,
          trainingEventsTable.columns.city,
          trainingEventsTable.columns.place,
          trainingEventsTable.columns.cent_price,
          trainingEventsTable.columns.starts_at,
          trainingEventsTable.columns.ends_at,
          trainingEventsTable.columns.is_hidden,
          trainingEventsTable.columns.created_at,
          this.databaseClient.raw('ST_X(geolocation) as latitude'),
          this.databaseClient.raw('ST_Y(geolocation) as longitude'),
          trainingEventsTable.columns.training_id,
          `${trainingsTable.columns.name} as training_name`,
          `${trainingsTable.columns.description} as training_description`,
          `${categoriesTable.columns.name} as category_name`,
          `${companiesTable.columns.name} as company_name`,
          `${companiesTable.columns.logo_url} as company_logo_url`,
        ])
        .join(trainingsTable.name, trainingEventsTable.columns.training_id, '=', trainingsTable.columns.id)
        .join(categoriesTable.name, trainingsTable.columns.category_id, '=', categoriesTable.columns.id)
        .join(companiesTable.name, trainingsTable.columns.company_id, '=', companiesTable.columns.id)
        .where(trainingEventsTable.columns.id, id)
        .first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'TrainingEvent',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.trainingEventMapper.mapExtendedToDomain(rawEntity);
  }

  public async findTrainingEvents(payload: FindTrainingEventsPayload): Promise<TrainingEvent[]> {
    const { trainingName, categoryId, companyId, latitude, longitude, radius, page, pageSize } = payload;

    let rawEntities: TrainingEventRawEntityExtended[];

    try {
      const query = this.databaseClient<TrainingEventRawEntityExtended>(trainingEventsTable.name)
        .select([
          trainingEventsTable.columns.id,
          trainingEventsTable.columns.city,
          trainingEventsTable.columns.place,
          trainingEventsTable.columns.cent_price,
          trainingEventsTable.columns.starts_at,
          trainingEventsTable.columns.ends_at,
          trainingEventsTable.columns.is_hidden,
          trainingEventsTable.columns.created_at,
          this.databaseClient.raw('ST_X(geolocation) as latitude'),
          this.databaseClient.raw('ST_Y(geolocation) as longitude'),
          trainingEventsTable.columns.training_id,
          `${trainingsTable.columns.name} as training_name`,
          `${trainingsTable.columns.description} as training_description`,
          `${categoriesTable.columns.name} as category_name`,
          `${companiesTable.columns.name} as company_name`,
          `${companiesTable.columns.logo_url} as company_logo_url`,
        ])
        .join(trainingsTable.name, trainingEventsTable.columns.training_id, '=', trainingsTable.columns.id)
        .join(categoriesTable.name, trainingsTable.columns.category_id, '=', categoriesTable.columns.id)
        .join(companiesTable.name, trainingsTable.columns.company_id, '=', companiesTable.columns.id)
        .orderBy(trainingEventsTable.columns.id, 'desc');

      if (trainingName) {
        query.whereRaw(`${trainingsTable.columns.name} ILIKE ?`, `%${trainingName}%`);
      }

      if (categoryId) {
        query.where(trainingsTable.columns.category_id, categoryId);
      }

      if (companyId) {
        query.where(trainingsTable.columns.company_id, companyId);
      }

      if (latitude && longitude && radius) {
        query.whereRaw(
          `ST_DWithin(geolocation, ST_GeomFromText('POINT(${latitude.toString()} ${longitude.toString()})', 4326), ?)`,
          radius,
        );
      }

      rawEntities = await query.limit(pageSize).offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'TrainingEvent',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.trainingEventMapper.mapExtendedToDomain(rawEntity));
  }

  public async countTrainingEvents(payload: CountTrainingEventsPayload): Promise<number> {
    const { trainingName, categoryId, companyId, latitude, longitude, radius } = payload;

    try {
      const query = this.databaseClient<TrainingEventRawEntity>(trainingEventsTable.name).join(
        trainingsTable.name,
        trainingEventsTable.columns.training_id,
        '=',
        trainingsTable.columns.id,
      );

      if (trainingName) {
        query.whereRaw(`${trainingsTable.columns.name} ILIKE ?`, `%${trainingName}%`);
      }

      if (categoryId) {
        query.where(trainingsTable.columns.category_id, categoryId);
      }

      if (companyId) {
        query.where(trainingsTable.columns.company_id, companyId);
      }

      if (latitude && longitude && radius) {
        query.whereRaw(
          `ST_DWithin(geolocation, ST_GeomFromText('POINT(${latitude.toString()} ${longitude.toString()})', 4326), ?)`,
          radius,
        );
      }

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'TrainingEvent',
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
        entity: 'TrainingEvent',
        operation: 'count',
        originalError: error,
      });
    }
  }
}

import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import { companiesLocationsTable } from '../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companiesLocationsTable.ts';
import type { CompanyLocationRawEntity } from '../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companyLocationRawEntity.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type CompanyLocation } from '../../../domain/entities/companyLocation/companyLocation.ts';
import {
  type FindCompanyLocationsPayload,
  type FindCompanyLocationPayload,
  type CreateCompanyLocationPayload,
  type CompanyLocationRepository,
  type UpdateCompanyLocationPayload,
} from '../../../domain/repositories/companyLocationRepository/companyLocationRepository.ts';

import type { CompanyLocationMapper } from './companyLocationMapper/companyLocationMapper.ts';

export class CompanyLocationRepositoryImpl implements CompanyLocationRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly companyLocationMapper: CompanyLocationMapper;
  private readonly uuidService: UuidService;

  public constructor(
    databaseClient: DatabaseClient,
    companyLocationMapper: CompanyLocationMapper,
    uuidService: UuidService,
  ) {
    this.databaseClient = databaseClient;
    this.companyLocationMapper = companyLocationMapper;
    this.uuidService = uuidService;
  }

  public async createCompanyLocation(payload: CreateCompanyLocationPayload): Promise<CompanyLocation> {
    const {
      data: { cityId, address, latitude, longitude, isRemote, companyId, name },
    } = payload;

    const id = this.uuidService.generateUuid();

    try {
      if (cityId) {
        await this.databaseClient<CompanyLocationRawEntity>(companiesLocationsTable.name).insert({
          id,
          company_id: companyId,
          name,
          is_remote: isRemote,
          city_id: cityId,
          address,
          geolocation: this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
            latitude,
            longitude,
          ]),
        });
      } else {
        await this.databaseClient<CompanyLocationRawEntity>(companiesLocationsTable.name).insert({
          id,
          company_id: companyId,
          name,
          is_remote: isRemote,
        });
      }
    } catch (error) {
      throw new RepositoryError({
        entity: 'CompanyLocation',
        operation: 'create',
        originalError: error,
      });
    }

    const createdLocation = await this.findCompanyLocation({ id });

    return createdLocation as CompanyLocation;
  }

  public async updateCompanyLocation(payload: UpdateCompanyLocationPayload): Promise<CompanyLocation> {
    const { companyLocation } = payload;

    const { cityId, name, address, latitude, longitude } = companyLocation.getState();

    try {
      await this.databaseClient<CompanyLocationRawEntity>(companiesLocationsTable.name)
        .update({
          geolocation: this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
            latitude,
            longitude,
          ]),
          city_id: cityId,
          address,
          name,
        })
        .where({ id: companyLocation.getId() });
    } catch (error) {
      throw new RepositoryError({
        entity: 'CompanyLocation',
        operation: 'update',
        originalError: error,
      });
    }

    const updatedLocation = await this.findCompanyLocation({ id: companyLocation.getId() });

    return updatedLocation as CompanyLocation;
  }

  public async findCompanyLocation(payload: FindCompanyLocationPayload): Promise<CompanyLocation | null> {
    const { id, name, companyId } = payload;

    let rawEntity: CompanyLocationRawEntity | undefined;

    try {
      const query = this.databaseClient(companiesLocationsTable.name).select([
        companiesLocationsTable.columns.id,
        companiesLocationsTable.columns.city_id,
        companiesLocationsTable.columns.company_id,
        companiesLocationsTable.columns.is_remote,
        companiesLocationsTable.columns.address,
        companiesLocationsTable.columns.name,
        this.databaseClient.raw('ST_X(geolocation) as latitude'),
        this.databaseClient.raw('ST_Y(geolocation) as longitude'),
      ]);

      if (id) {
        query.where(companiesLocationsTable.columns.id, id);
      }

      if (name) {
        query.where(companiesLocationsTable.columns.name, name);
      }

      if (companyId) {
        query.where(companiesLocationsTable.columns.company_id, companyId);
      }

      rawEntity = await query.first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'CompanyLocation',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.companyLocationMapper.mapToDomain(rawEntity);
  }

  public async findCompanyLocations(payload: FindCompanyLocationsPayload): Promise<CompanyLocation[]> {
    const { name, companyId, isRemote, ids } = payload;

    let rawEntities: CompanyLocationRawEntity[];

    try {
      const query = this.databaseClient(companiesLocationsTable.name).select([
        companiesLocationsTable.columns.id,
        companiesLocationsTable.columns.city_id,
        companiesLocationsTable.columns.company_id,
        companiesLocationsTable.columns.is_remote,
        companiesLocationsTable.columns.address,
        companiesLocationsTable.columns.name,
        this.databaseClient.raw('ST_X(geolocation) as latitude'),
        this.databaseClient.raw('ST_Y(geolocation) as longitude'),
      ]);

      if (name) {
        query.whereRaw(`${companiesLocationsTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      if (ids?.length) {
        query.whereIn(companiesLocationsTable.columns.id, ids);
      }

      if (companyId) {
        query.where(companiesLocationsTable.columns.company_id, companyId);
      }

      if (isRemote !== undefined) {
        query.where(companiesLocationsTable.columns.is_remote, isRemote);
      }

      rawEntities = await query.orderBy(companiesLocationsTable.columns.id, 'desc');
    } catch (error) {
      throw new RepositoryError({
        entity: 'CompanyLocation',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.companyLocationMapper.mapToDomain(rawEntity));
  }
}

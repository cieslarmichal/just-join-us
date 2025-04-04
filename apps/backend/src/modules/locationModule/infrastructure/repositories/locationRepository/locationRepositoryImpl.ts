import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import { companiesLocationsTable } from '../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companiesLocationsTable.ts';
import type { CompanyLocationRawEntity } from '../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companyLocationRawEntity.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type Location } from '../../../domain/entities/location/location.ts';
import {
  type FindLocationsPayload,
  type FindLocationPayload,
  type CreateLocationPayload,
  type LocationRepository,
  type UpdateLocationPayload,
} from '../../../domain/repositories/locationRepository/locationRepository.ts';

import type { LocationMapper } from './locationMapper/locationMapper.ts';

export class LocationRepositoryImpl implements LocationRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly locationMapper: LocationMapper;
  private readonly uuidService: UuidService;

  public constructor(databaseClient: DatabaseClient, locationMapper: LocationMapper, uuidService: UuidService) {
    this.databaseClient = databaseClient;
    this.locationMapper = locationMapper;
    this.uuidService = uuidService;
  }

  public async createLocation(payload: CreateLocationPayload): Promise<Location> {
    const {
      data: { cityId, address, latitude, longitude, isRemote, companyId, name },
    } = payload;

    const id = this.uuidService.generateUuid();

    try {
      await this.databaseClient<CompanyLocationRawEntity>(companiesLocationsTable.name).insert({
        id,
        city_id: cityId,
        address,
        geolocation: this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
          latitude,
          longitude,
        ]),
        is_remote: isRemote,
        company_id: companyId,
        name,
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Training',
        operation: 'create',
        originalError: error,
      });
    }

    const createdLocation = await this.findLocation({ id });

    return createdLocation as Location;
  }

  public async updateLocation(payload: UpdateLocationPayload): Promise<Location> {
    const { location } = payload;

    const { cityId, name, address, latitude, longitude } = location.getState();

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
        .where({ id: location.getId() });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Location',
        operation: 'update',
        originalError: error,
      });
    }

    const updatedLocation = await this.findLocation({ id: location.getId() });

    return updatedLocation as Location;
  }

  public async findLocation(payload: FindLocationPayload): Promise<Location | null> {
    const { id } = payload;

    let rawEntity: CompanyLocationRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient(companiesLocationsTable.name)
        .select([
          companiesLocationsTable.columns.id,
          companiesLocationsTable.columns.city_id,
          companiesLocationsTable.columns.company_id,
          companiesLocationsTable.columns.is_remote,
          companiesLocationsTable.columns.address,
          companiesLocationsTable.columns.name,
          this.databaseClient.raw('ST_X(geolocation) as latitude'),
          this.databaseClient.raw('ST_Y(geolocation) as longitude'),
        ])
        .where(companiesLocationsTable.columns.id, id)
        .first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Location',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.locationMapper.mapToDomain(rawEntity);
  }

  public async findLocations(payload: FindLocationsPayload): Promise<Location[]> {
    const { name, companyId, isRemote } = payload;

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

      if (companyId) {
        query.where(companiesLocationsTable.columns.company_id, companyId);
      }

      if (isRemote !== undefined) {
        query.where(companiesLocationsTable.columns.is_remote, isRemote);
      }

      rawEntities = await query.orderBy(companiesLocationsTable.columns.id, 'desc');
    } catch (error) {
      throw new RepositoryError({
        entity: 'Location',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.locationMapper.mapToDomain(rawEntity));
  }
}

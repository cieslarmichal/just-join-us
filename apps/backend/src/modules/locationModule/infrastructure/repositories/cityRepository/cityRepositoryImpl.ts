import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { citiesTable } from '../../../../databaseModule/infrastructure/tables/citiesTable/citiesTable.ts';
import type { CityRawEntity } from '../../../../databaseModule/infrastructure/tables/citiesTable/cityRawEntity.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type City } from '../../../domain/entities/city/city.ts';
import {
  type CityRepository,
  type CountCitiesPayload,
  type FindCitiesPayload,
  type FindCityPayload,
} from '../../../domain/repositories/cityRepository/cityRepository.ts';

import { type CityMapper } from './cityMapper/cityMapper.ts';

export class CityRepositoryImpl implements CityRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly cityMapper: CityMapper;

  public constructor(databaseClient: DatabaseClient, cityMapper: CityMapper) {
    this.databaseClient = databaseClient;
    this.cityMapper = cityMapper;
  }

  public async findCity(payload: FindCityPayload): Promise<City | null> {
    const { id, slug } = payload;

    let rawEntity: CityRawEntity | undefined;

    try {
      const query = this.databaseClient<CityRawEntity>(citiesTable.name).select('*');

      if (id) {
        query.where({ id });
      } else if (slug) {
        query.where({ slug });
      } else {
        throw new RepositoryError({
          entity: 'City',
          operation: 'find',
          message: 'Either id or slug must be provided',
        });
      }

      rawEntity = await query.first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'City',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.cityMapper.mapToDomain(rawEntity);
  }

  public async findCities(payload: FindCitiesPayload): Promise<City[]> {
    const { name, page, pageSize } = payload;

    let rawEntities: CityRawEntity[];

    try {
      const query = this.databaseClient<CityRawEntity>(citiesTable.name).select('*');

      if (name) {
        query.whereRaw(`${citiesTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      rawEntities = await query
        .orderBy(citiesTable.columns.name, 'asc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'City',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.cityMapper.mapToDomain(rawEntity));
  }

  public async countCities(payload: CountCitiesPayload): Promise<number> {
    const { name } = payload;

    try {
      const query = this.databaseClient<CityRawEntity>(citiesTable.name);

      if (name) {
        query.whereRaw(`${citiesTable.columns.name} ILIKE ?`, `${name}%`);
      }

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'City',
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
        entity: 'City',
        operation: 'count',
        originalError: error,
      });
    }
  }
}

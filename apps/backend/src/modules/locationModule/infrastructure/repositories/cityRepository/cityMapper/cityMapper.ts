import type { CityRawEntity } from '../../../../../databaseModule/infrastructure/tables/citiesTable/cityRawEntity.ts';
import { City } from '../../../../domain/entities/city/city.ts';

export class CityMapper {
  public mapToDomain(entity: CityRawEntity): City {
    const { id, name, province, latitude, longitude } = entity;

    return new City({
      id,
      name,
      province,
      latitude,
      longitude,
    });
  }
}

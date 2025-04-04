import { Generator } from '../../../../../../tests/generator.ts';
import type { CityRawEntity } from '../../../../databaseModule/infrastructure/tables/citiesTable/cityRawEntity.ts';
import { type CityDraft, City } from '../../../domain/entities/city/city.ts';

export class CityTestFactory {
  public create(input: Partial<CityDraft> = {}): City {
    return new City({
      id: Generator.uuid(),
      name: Generator.city(),
      province: Generator.province(),
      latitude: Generator.latitude(),
      longitude: Generator.longitude(),
      ...input,
    });
  }

  public createRaw(input: Partial<CityRawEntity> = {}): CityRawEntity {
    return {
      id: Generator.uuid(),
      name: Generator.city(),
      province: Generator.province(),
      latitude: Generator.latitude(),
      longitude: Generator.longitude(),
      ...input,
    };
  }
}

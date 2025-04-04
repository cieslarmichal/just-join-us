import { Generator } from '../../../../../../tests/generator.ts';
import type { CompanyLocationRawEntity } from '../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companyLocationRawEntity.ts';
import { Location, type LocationDraft } from '../../../domain/entities/location/location.ts';

export class LocationTestFactory {
  public create(input: Partial<LocationDraft> = {}): Location {
    return new Location({
      id: Generator.uuid(),
      isRemote: false,
      latitude: Generator.latitude(),
      longitude: Generator.longitude(),
      cityId: Generator.uuid(),
      address: Generator.address(),
      name: Generator.string(10),
      companyId: Generator.uuid(),
      ...input,
    });
  }

  public createRaw(input: Partial<CompanyLocationRawEntity> = {}): CompanyLocationRawEntity {
    return {
      id: Generator.uuid(),
      is_remote: false,
      latitude: Generator.latitude(),
      longitude: Generator.longitude(),
      city_id: Generator.uuid(),
      address: Generator.address(),
      name: Generator.string(10),
      company_id: Generator.uuid(),
      ...input,
    };
  }
}

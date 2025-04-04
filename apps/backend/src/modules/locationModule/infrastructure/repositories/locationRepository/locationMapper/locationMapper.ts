import type { CompanyLocationRawEntity } from '../../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companyLocationRawEntity.ts';
import { Location } from '../../../../domain/entities/location/location.ts';

export class LocationMapper {
  public mapToDomain(entity: CompanyLocationRawEntity): Location {
    const { id, name, company_id, is_remote, address, city_id, latitude, longitude } = entity;

    return new Location({
      id,
      name,
      companyId: company_id,
      isRemote: is_remote,
      address,
      cityId: city_id,
      latitude,
      longitude,
    });
  }
}

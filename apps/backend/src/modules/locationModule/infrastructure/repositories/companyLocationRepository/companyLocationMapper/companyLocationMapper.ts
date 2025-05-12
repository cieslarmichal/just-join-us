import type {
  CompanyLocationRawEntity,
  CompanyLocationRawEntityExtended,
} from '../../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companyLocationRawEntity.ts';
import { CompanyLocation } from '../../../../domain/entities/companyLocation/companyLocation.ts';

export class CompanyLocationMapper {
  public mapToDomain(entity: CompanyLocationRawEntity): CompanyLocation {
    const { id, name, company_id, address, city_id, latitude, longitude } = entity;

    return new CompanyLocation({
      id,
      name,
      companyId: company_id,
      address,
      cityId: city_id,
      latitude,
      longitude,
    });
  }

  public mapExtendedToDomain(entity: CompanyLocationRawEntityExtended): CompanyLocation {
    const { id, name, company_id, address, city_id, city_name, latitude, longitude } = entity;

    return new CompanyLocation({
      id,
      name,
      companyId: company_id,
      address,
      cityId: city_id,
      cityName: city_name,
      latitude,
      longitude,
    });
  }
}

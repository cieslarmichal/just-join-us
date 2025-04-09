import type { CompanyLocationRawEntity } from '../../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companyLocationRawEntity.ts';
import { CompanyLocation } from '../../../../domain/entities/companyLocation/companyLocation.ts';

export class CompanyLocationMapper {
  public mapToDomain(entity: CompanyLocationRawEntity): CompanyLocation {
    const { id, name, company_id, is_remote, address, city_id, latitude, longitude } = entity;

    return new CompanyLocation({
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

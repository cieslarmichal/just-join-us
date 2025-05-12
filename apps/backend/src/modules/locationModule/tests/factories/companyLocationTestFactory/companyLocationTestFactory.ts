import { Generator } from '../../../../../../tests/generator.ts';
import type { CompanyLocationRawEntity } from '../../../../databaseModule/infrastructure/tables/companiesLocationsTable/companyLocationRawEntity.ts';
import {
  CompanyLocation,
  type CompanyLocationDraft,
} from '../../../domain/entities/companyLocation/companyLocation.ts';

export class CompanyLocationTestFactory {
  public create(input: Partial<CompanyLocationDraft> = {}): CompanyLocation {
    return new CompanyLocation({
      id: Generator.uuid(),
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

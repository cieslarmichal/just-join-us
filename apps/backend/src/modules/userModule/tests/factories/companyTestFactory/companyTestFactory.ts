import { Generator } from '../../../../../../tests/generator.ts';
import { userRoles } from '../../../../../common/types/userRole.ts';
import type { CompanyRawEntity } from '../../../../databaseModule/infrastructure/tables/companiesTable/companyRawEntity.ts';
import { Company, type CompanyDraft } from '../../../domain/entities/company/company.ts';

export class CompanyTestFactory {
  public create(input: Partial<CompanyDraft> = {}): Company {
    return new Company({
      id: Generator.uuid(),
      email: Generator.email(),
      password: Generator.password(),
      isEmailVerified: Generator.boolean(),
      isDeleted: false,
      role: userRoles.company,
      createdAt: Generator.pastDate(),
      taxId: Generator.taxId(),
      name: Generator.companyName(),
      isVerified: Generator.boolean(),
      logoUrl: Generator.imageUrl(),
      phone: Generator.phone(),
      ...input,
    });
  }

  public createRaw(input: Partial<CompanyRawEntity> = {}): CompanyRawEntity {
    return {
      id: Generator.uuid(),
      tax_id: Generator.taxId(),
      name: Generator.companyName(),
      is_verified: Generator.boolean(),
      logo_url: Generator.imageUrl(),
      phone: Generator.phone(),
      ...input,
    };
  }
}

import type { CompanyRawEntityExtended } from '../../../../../databaseModule/infrastructure/tables/companiesTable/companyRawEntity.ts';
import { Company } from '../../../../domain/entities/company/company.ts';

export class CompanyMapper {
  public mapToDomain(entity: CompanyRawEntityExtended): Company {
    const {
      id,
      email,
      password,
      is_email_verified: isEmailVerified,
      is_deleted: isDeleted,
      role,
      created_at: createdAt,
      name,
      tax_id: taxId,
      is_verified: isVerified,
      phone: phone,
      logo_url: logoUrl,
    } = entity;

    return new Company({
      id,
      email,
      password,
      isEmailVerified,
      isDeleted,
      role,
      createdAt,
      name,
      taxId,
      isVerified,
      phone,
      logoUrl,
    });
  }
}

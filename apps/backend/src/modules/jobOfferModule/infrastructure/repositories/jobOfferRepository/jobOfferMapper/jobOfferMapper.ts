import type {
  JobOfferRawEntity,
  JobOfferRawEntityExtended,
} from '../../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOfferRawEntity.ts';
import { JobOffer } from '../../../../domain/entities/jobOffer/jobOffer.ts';

export class JobOfferMapper {
  public mapToDomain(entity: JobOfferRawEntity): JobOffer {
    const {
      id,
      name,
      description,
      is_hidden: isHidden,
      category_id: categoryId,
      company_id: companyId,
      created_at: createdAt,
    } = entity;

    return new JobOffer({
      id,
      name,
      description,
      isHidden,
      categoryId,
      companyId,
      createdAt,
    });
  }

  public mapExtendedToDomain(entity: JobOfferRawEntityExtended): JobOffer {
    const {
      id,
      name,
      description,
      is_hidden: isHidden,
      created_at: createdAt,
      category_id: categoryId,
      category_name: categoryName,
      company_id: companyId,
      company_name: companyName,
      company_logo_url: companyLogoUrl,
    } = entity;

    return new JobOffer({
      id,
      name,
      description,
      isHidden,
      createdAt,
      categoryId,
      category: { name: categoryName },
      companyId,
      company: { name: companyName, logoUrl: companyLogoUrl },
    });
  }
}

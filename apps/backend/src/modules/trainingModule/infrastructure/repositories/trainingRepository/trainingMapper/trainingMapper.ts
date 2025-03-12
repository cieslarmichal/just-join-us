import type {
  TrainingRawEntity,
  TrainingRawEntityExtended,
} from '../../../../../databaseModule/infrastructure/tables/trainingsTable/trainingRawEntity.ts';
import { Training } from '../../../../domain/entities/training/training.ts';

export class TrainingMapper {
  public mapToDomain(entity: TrainingRawEntity): Training {
    const {
      id,
      name,
      description,
      is_hidden: isHidden,
      category_id: categoryId,
      company_id: companyId,
      created_at: createdAt,
    } = entity;

    return new Training({
      id,
      name,
      description,
      isHidden,
      categoryId,
      companyId,
      createdAt,
    });
  }

  public mapExtendedToDomain(entity: TrainingRawEntityExtended): Training {
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

    return new Training({
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

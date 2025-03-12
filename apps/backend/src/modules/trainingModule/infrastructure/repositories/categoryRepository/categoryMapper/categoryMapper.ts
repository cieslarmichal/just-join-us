import type { CategoryRawEntity } from '../../../../../databaseModule/infrastructure/tables/categoriesTable/categoryRawEntity.ts';
import { Category } from '../../../../domain/entities/category/category.ts';

export class CategoryMapper {
  public mapToDomain(entity: CategoryRawEntity): Category {
    const { id, name } = entity;

    return new Category({
      id,
      name,
    });
  }
}

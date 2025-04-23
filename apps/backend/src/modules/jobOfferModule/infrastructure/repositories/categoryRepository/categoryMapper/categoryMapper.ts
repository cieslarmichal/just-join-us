import type { CategoryRawEntity } from '../../../../../databaseModule/infrastructure/tables/categoriesTable/categoryRawEntity.ts';
import { Category } from '../../../../domain/entities/category/category.ts';

export class CategoryMapper {
  public mapToDomain(entity: CategoryRawEntity): Category {
    const { id, name, slug } = entity;

    return new Category({
      id,
      name,
      slug,
    });
  }
}

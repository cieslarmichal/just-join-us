import { Generator } from '../../../../../../tests/generator.ts';
import type { CategoryRawEntity } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoryRawEntity.ts';
import { type CategoryDraft, Category } from '../../../domain/entities/category/category.ts';

export class CategoryTestFactory {
  public create(input: Partial<CategoryDraft> = {}): Category {
    return new Category({
      id: Generator.uuid(),
      name: Generator.categoryName(),
      ...input,
    });
  }

  public createRaw(input: Partial<CategoryRawEntity> = {}): CategoryRawEntity {
    return {
      id: Generator.uuid(),
      name: Generator.categoryName(),
      ...input,
    };
  }
}

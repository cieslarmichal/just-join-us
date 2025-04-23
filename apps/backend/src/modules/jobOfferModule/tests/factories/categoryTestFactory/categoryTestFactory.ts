import { Generator } from '../../../../../../tests/generator.ts';
import type { CategoryRawEntity } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoryRawEntity.ts';
import { type CategoryDraft, Category } from '../../../domain/entities/category/category.ts';

export class CategoryTestFactory {
  public create(input: Partial<CategoryDraft> = {}): Category {
    const name = Generator.categoryName();
    const slug = name.replace(/\s+/g, '-').toLowerCase();

    return new Category({
      id: Generator.uuid(),
      name,
      slug,
      ...input,
    });
  }

  public createRaw(input: Partial<CategoryRawEntity> = {}): CategoryRawEntity {
    const name = Generator.categoryName();
    const slug = name.replace(/\s+/g, '-').toLowerCase();

    return {
      id: Generator.uuid(),
      name,
      slug,
      ...input,
    };
  }
}

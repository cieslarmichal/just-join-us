import type { CategoryRawEntity } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoryRawEntity.ts';
import type { Category } from '../../entities/category/category.ts';

export interface CreateCategoryPayload {
  readonly data: Omit<CategoryRawEntity, 'id' | 'createdAt'>;
}

export interface FindCategoryPayload {
  readonly id: string;
}

export interface FindCategoriesPayload {
  readonly name?: string | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export interface CountCategoriesPayload {
  readonly name?: string | undefined;
}

export interface CategoryRepository {
  createCategory(payload: CreateCategoryPayload): Promise<Category>;
  findCategory(payload: FindCategoryPayload): Promise<Category | null>;
  findCategories(payload: FindCategoriesPayload): Promise<Category[]>;
  countCategories(payload: CountCategoriesPayload): Promise<number>;
}

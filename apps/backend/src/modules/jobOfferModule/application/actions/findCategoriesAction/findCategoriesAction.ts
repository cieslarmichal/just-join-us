import { type Action } from '../../../../../common/types/action.ts';
import type { Category } from '../../../domain/entities/category/category.ts';

export interface FindCategoriesActionPayload {
  readonly name?: string | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export interface FindCategoriesActionResult {
  readonly data: Category[];
  readonly total: number;
}

export type FindCategoriesAction = Action<FindCategoriesActionPayload, FindCategoriesActionResult>;

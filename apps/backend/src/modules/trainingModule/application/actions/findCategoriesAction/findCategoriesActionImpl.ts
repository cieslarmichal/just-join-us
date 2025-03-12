import type { CategoryRepository } from '../../../domain/repositories/categoryRepository/categoryRepository.ts';

import {
  type FindCategoriesAction,
  type FindCategoriesActionPayload,
  type FindCategoriesActionResult,
} from './findCategoriesAction.ts';

export class FindCategoriesActionImpl implements FindCategoriesAction {
  private readonly categoryRepository: CategoryRepository;

  public constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public async execute(payload: FindCategoriesActionPayload): Promise<FindCategoriesActionResult> {
    const { name, page, pageSize } = payload;

    const [categories, total] = await Promise.all([
      this.categoryRepository.findCategories({ name, page, pageSize }),
      this.categoryRepository.countCategories({ name }),
    ]);

    return { data: categories, total };
  }
}

import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { type UuidService } from '../../../../../common/uuid/uuidService.ts';
import { categoriesTable } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoriesTable.ts';
import type { CategoryRawEntity } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoryRawEntity.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type Category } from '../../../domain/entities/category/category.ts';
import {
  type CategoryRepository,
  type CountCategoriesPayload,
  type CreateCategoryPayload,
  type FindCategoriesPayload,
  type FindCategoryPayload,
} from '../../../domain/repositories/categoryRepository/categoryRepository.ts';

import { type CategoryMapper } from './categoryMapper/categoryMapper.ts';

export class CategoryRepositoryImpl implements CategoryRepository {
  private readonly databaseClient: DatabaseClient;
  private readonly categoryMapper: CategoryMapper;
  private readonly uuidService: UuidService;

  public constructor(databaseClient: DatabaseClient, categoryMapper: CategoryMapper, uuidService: UuidService) {
    this.databaseClient = databaseClient;
    this.categoryMapper = categoryMapper;
    this.uuidService = uuidService;
  }

  public async createCategory(payload: CreateCategoryPayload): Promise<Category> {
    const {
      data: { name },
    } = payload;

    let rawEntities: CategoryRawEntity[];

    try {
      rawEntities = await this.databaseClient<CategoryRawEntity>(categoriesTable.name).insert(
        {
          id: this.uuidService.generateUuid(),
          name,
        },
        '*',
      );
    } catch (error) {
      throw new RepositoryError({
        entity: 'Category',
        operation: 'create',
        originalError: error,
      });
    }

    const rawEntity = rawEntities[0] as CategoryRawEntity;

    return this.categoryMapper.mapToDomain(rawEntity);
  }

  public async findCategory(payload: FindCategoryPayload): Promise<Category | null> {
    const { id } = payload;

    let rawEntity: CategoryRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient<CategoryRawEntity>(categoriesTable.name).select('*').where({ id }).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Category',
        operation: 'find',
        originalError: error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.categoryMapper.mapToDomain(rawEntity);
  }

  public async findCategories(payload: FindCategoriesPayload): Promise<Category[]> {
    const { name, page, pageSize } = payload;

    let rawEntities: CategoryRawEntity[];

    try {
      const query = this.databaseClient<CategoryRawEntity>(categoriesTable.name).select('*');

      if (name) {
        query.whereRaw(`${categoriesTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      rawEntities = await query
        .orderBy(categoriesTable.columns.name, 'asc')
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    } catch (error) {
      throw new RepositoryError({
        entity: 'Category',
        operation: 'find',
        originalError: error,
      });
    }

    return rawEntities.map((rawEntity) => this.categoryMapper.mapToDomain(rawEntity));
  }

  public async countCategories(payload: CountCategoriesPayload): Promise<number> {
    const { name } = payload;

    try {
      const query = this.databaseClient<CategoryRawEntity>(categoriesTable.name);

      if (name) {
        query.whereRaw(`${categoriesTable.columns.name} ILIKE ?`, `%${name}%`);
      }

      const countResult = await query.count().first();

      const count = countResult?.['count'];

      if (count === undefined) {
        throw new RepositoryError({
          entity: 'Category',
          operation: 'count',
          countResult,
        });
      }

      if (typeof count === 'string') {
        return parseInt(count, 10);
      }

      return count;
    } catch (error) {
      throw new RepositoryError({
        entity: 'Category',
        operation: 'count',
        originalError: error,
      });
    }
  }
}

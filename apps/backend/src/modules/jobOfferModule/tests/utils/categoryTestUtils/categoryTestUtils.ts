import { TestUtils } from '../../../../../../tests/testUtils.ts';
import { categoriesTable } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoriesTable.ts';
import type { CategoryRawEntity } from '../../../../databaseModule/infrastructure/tables/categoriesTable/categoryRawEntity.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { CategoryTestFactory } from '../../factories/categoryTestFactory/categoryTestFactory.ts';

interface CreateAndPersistPayload {
  readonly input?: Partial<CategoryRawEntity>;
}

interface FindByNamePayload {
  readonly name: string;
}

interface FindByIdPayload {
  readonly id: string;
}

export class CategoryTestUtils extends TestUtils {
  private readonly categoryTestFactory = new CategoryTestFactory();

  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient, categoriesTable.name);
  }

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<CategoryRawEntity> {
    const { input } = payload;

    const category = this.categoryTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<CategoryRawEntity>(categoriesTable.name).insert(category, '*');

    const rawEntity = rawEntities[0] as CategoryRawEntity;

    return rawEntity;
  }

  public async findByName(payload: FindByNamePayload): Promise<CategoryRawEntity> {
    const { name } = payload;

    const rawEntity = await this.databaseClient<CategoryRawEntity>(categoriesTable.name)
      .select('*')
      .where({ name })
      .first();

    return rawEntity as CategoryRawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<CategoryRawEntity> {
    const { id } = payload;

    const rawEntity = await this.databaseClient<CategoryRawEntity>(categoriesTable.name)
      .select('*')
      .where({ id })
      .first();

    return rawEntity as CategoryRawEntity;
  }
}

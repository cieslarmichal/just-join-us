import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../tests/generator.ts';
import { testSymbols } from '../../../../../../tests/symbols.ts';
import { TestContainer } from '../../../../../../tests/testContainer.ts';
import { RepositoryError } from '../../../../../common/errors/repositoryError.ts';
import { databaseSymbols } from '../../../../databaseModule/symbols.ts';
import type { DatabaseClient } from '../../../../databaseModule/types/databaseClient.ts';
import { type CategoryRepository } from '../../../domain/repositories/categoryRepository/categoryRepository.ts';
import { symbols } from '../../../symbols.ts';
import { CategoryTestFactory } from '../../../tests/factories/categoryTestFactory/categoryTestFactory.ts';
import { type CategoryTestUtils } from '../../../tests/utils/categoryTestUtils/categoryTestUtils.ts';

describe('CategoryRepositoryImpl', () => {
  let categoryRepository: CategoryRepository;

  let databaseClient: DatabaseClient;

  let categoryTestUtils: CategoryTestUtils;

  const categoryTestFactory = new CategoryTestFactory();

  beforeEach(async () => {
    const container = await TestContainer.create();

    categoryRepository = container.get<CategoryRepository>(symbols.categoryRepository);

    databaseClient = container.get<DatabaseClient>(databaseSymbols.databaseClient);

    categoryTestUtils = container.get<CategoryTestUtils>(testSymbols.categoryTestUtils);

    await categoryTestUtils.truncate();
  });

  afterEach(async () => {
    await categoryTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('Create', () => {
    it('creates a Category', async () => {
      const { name } = categoryTestFactory.createRaw();

      const createdCategory = await categoryRepository.createCategory({ data: { name } });

      const foundCategory = await categoryTestUtils.findByName({ name });

      expect(createdCategory.getName()).toEqual(name);

      expect(foundCategory).toEqual({
        id: createdCategory.getId(),
        name,
      });
    });

    it('throws an error when a Category with the same name already exists', async () => {
      const existingCategory = await categoryTestUtils.createAndPersist();

      try {
        await categoryRepository.createCategory({ data: { name: existingCategory.name } });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });
  });

  describe('Find', () => {
    it('finds a Category by id', async () => {
      const category = await categoryTestUtils.createAndPersist();

      const foundCategory = await categoryRepository.findCategory({ id: category.id });

      expect(foundCategory).not.toBeNull();
    });

    it('returns null if a Category with given id does not exist', async () => {
      const id = Generator.uuid();

      const foundCategory = await categoryRepository.findCategory({ id });

      expect(foundCategory).toBeNull();
    });

    it('finds Categories by name', async () => {
      const category = await categoryTestUtils.createAndPersist({ input: { name: 'Medycyna' } });
      await categoryTestUtils.createAndPersist({ input: { name: 'Samoobrona' } });

      const foundCategories = await categoryRepository.findCategories({ name: 'med', page: 1, pageSize: 10 });

      expect(foundCategories).toHaveLength(1);
      expect(foundCategories[0]?.getId()).toEqual(category.id);
      expect(foundCategories[0]?.getName()).toEqual(category.name);
    });
  });

  describe('Count', () => {
    it('counts all Categories', async () => {
      await categoryTestUtils.createAndPersist();
      await categoryTestUtils.createAndPersist();
      await categoryTestUtils.createAndPersist();

      const count = await categoryRepository.countCategories({});

      expect(count).toEqual(3);
    });

    it('counts Categories by name', async () => {
      await categoryTestUtils.createAndPersist({ input: { name: 'Medycyna' } });
      await categoryTestUtils.createAndPersist({ input: { name: 'Samoobrona' } });

      const count = await categoryRepository.countCategories({ name: 'sam' });

      expect(count).toEqual(1);
    });
  });
});

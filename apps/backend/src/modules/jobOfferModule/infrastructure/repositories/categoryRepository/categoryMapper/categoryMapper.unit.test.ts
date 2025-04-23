import { beforeEach, expect, describe, it } from 'vitest';

import { CategoryTestFactory } from '../../../../tests/factories/categoryTestFactory/categoryTestFactory.ts';

import { CategoryMapper } from './categoryMapper.ts';

describe('CategoryMapper', () => {
  let mapper: CategoryMapper;

  const categoryTestFactory = new CategoryTestFactory();

  beforeEach(async () => {
    mapper = new CategoryMapper();
  });

  it('maps from CategoryRawEntity to Category', async () => {
    const categoryEntity = categoryTestFactory.createRaw();

    const category = mapper.mapToDomain(categoryEntity);

    expect(category.getId()).toBe(categoryEntity.id);

    expect(category.getState()).toEqual({
      name: categoryEntity.name,
      slug: categoryEntity.slug,
    });
  });
});

import { beforeEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../../tests/generator.ts';
import { TrainingTestFactory } from '../../../../tests/factories/trainingTestFactory/trainingTestFactory.ts';

import { TrainingMapper } from './trainingMapper.ts';

describe('TrainingMapper', () => {
  let mapper: TrainingMapper;

  const trainingTestFactory = new TrainingTestFactory();

  beforeEach(async () => {
    mapper = new TrainingMapper();
  });

  it('maps from TrainingRawEntity to Training', async () => {
    const trainingEntity = trainingTestFactory.createRaw();

    const training = mapper.mapToDomain(trainingEntity);

    expect(training.getId()).toEqual(trainingEntity.id);

    expect(training.getState()).toEqual({
      name: trainingEntity.name,
      description: trainingEntity.description,
      isHidden: trainingEntity.is_hidden,
      categoryId: trainingEntity.category_id,
      companyId: trainingEntity.company_id,
      createdAt: trainingEntity.created_at,
    });
  });

  it('maps from TrainingRawEntityExtended to Training', async () => {
    const trainingEntity = trainingTestFactory.createRaw();
    const companyName = Generator.companyName();
    const companyLogo = Generator.imageUrl();
    const categoryName = Generator.categoryName();

    const training = mapper.mapExtendedToDomain({
      ...trainingEntity,
      company_name: companyName,
      company_logo_url: companyLogo,
      category_name: categoryName,
    });

    expect(training.getId()).toEqual(trainingEntity.id);

    expect(training.getState()).toEqual({
      name: trainingEntity.name,
      description: trainingEntity.description,
      isHidden: trainingEntity.is_hidden,
      categoryId: trainingEntity.category_id,
      category: { name: categoryName },
      companyId: trainingEntity.company_id,
      company: { name: companyName, logoUrl: companyLogo },
      createdAt: trainingEntity.created_at,
    });
  });
});

import { beforeEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../../tests/generator.ts';
import { TrainingEventTestFactory } from '../../../../tests/factories/trainingEventTestFactory/trainingEventTestFactory.ts';

import { TrainingEventMapper } from './trainingEventMapper.ts';

describe('TrainingEventMapper', () => {
  let mapper: TrainingEventMapper;

  const trainingEventTestFactory = new TrainingEventTestFactory();

  beforeEach(async () => {
    mapper = new TrainingEventMapper();
  });

  it('maps from TrainingEventRawEntityExtended to TrainingEvent', async () => {
    const companyName = Generator.companyName();
    const companyLogoUrl = Generator.imageUrl();
    const categoryName = Generator.categoryName();
    const trainingName = Generator.trainingName();
    const trainingDescription = Generator.trainingDescription();
    const trainingEventRawEntity = trainingEventTestFactory.createRaw();

    const trainingEvent = mapper.mapExtendedToDomain({
      ...trainingEventRawEntity,
      training_name: trainingName,
      training_description: trainingDescription,
      category_name: categoryName,
      company_name: companyName,
      company_logo_url: companyLogoUrl,
    });

    expect(trainingEvent.getId()).toEqual(trainingEventRawEntity.id);

    expect(trainingEvent.getState()).toEqual({
      city: trainingEventRawEntity.city,
      place: trainingEventRawEntity.place,
      latitude: trainingEventRawEntity.latitude,
      longitude: trainingEventRawEntity.longitude,
      centPrice: trainingEventRawEntity.cent_price,
      startsAt: trainingEventRawEntity.starts_at,
      endsAt: trainingEventRawEntity.ends_at,
      isHidden: trainingEventRawEntity.is_hidden,
      trainingId: trainingEventRawEntity.training_id,
      createdAt: trainingEventRawEntity.created_at,
      training: {
        name: trainingName,
        description: trainingDescription,
        categoryName,
        companyName,
        companyLogoUrl,
      },
    });
  });
});

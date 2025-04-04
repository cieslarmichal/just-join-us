import { beforeEach, expect, describe, it } from 'vitest';

import { Generator } from '../../../../../../../tests/generator.ts';
import { JobOfferTestFactory } from '../../../../tests/factories/jobOfferTestFactory/jobOfferTestFactory.ts';

import { JobOfferMapper } from './jobOfferMapper.ts';

describe('JobOfferMapper', () => {
  let mapper: JobOfferMapper;

  const jobOfferTestFactory = new JobOfferTestFactory();

  beforeEach(async () => {
    mapper = new JobOfferMapper();
  });

  it('maps from JobOfferRawEntity to JobOffer', async () => {
    const jobOfferEntity = jobOfferTestFactory.createRaw();

    const jobOffer = mapper.mapToDomain(jobOfferEntity);

    expect(jobOffer.getId()).toEqual(jobOfferEntity.id);

    expect(jobOffer.getState()).toEqual({
      name: jobOfferEntity.name,
      description: jobOfferEntity.description,
      isHidden: jobOfferEntity.is_hidden,
      categoryId: jobOfferEntity.category_id,
      companyId: jobOfferEntity.company_id,
      createdAt: jobOfferEntity.created_at,
    });
  });

  it('maps from JobOfferRawEntityExtended to JobOffer', async () => {
    const jobOfferEntity = jobOfferTestFactory.createRaw();
    const companyName = Generator.companyName();
    const companyLogo = Generator.imageUrl();
    const categoryName = Generator.categoryName();

    const jobOffer = mapper.mapExtendedToDomain({
      ...jobOfferEntity,
      company_name: companyName,
      company_logo_url: companyLogo,
      category_name: categoryName,
    });

    expect(jobOffer.getId()).toEqual(jobOfferEntity.id);

    expect(jobOffer.getState()).toEqual({
      name: jobOfferEntity.name,
      description: jobOfferEntity.description,
      isHidden: jobOfferEntity.is_hidden,
      categoryId: jobOfferEntity.category_id,
      category: { name: categoryName },
      companyId: jobOfferEntity.company_id,
      company: { name: companyName, logoUrl: companyLogo },
      createdAt: jobOfferEntity.created_at,
    });
  });
});

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

  it('maps from JobOfferRawEntityExtended to JobOffer', async () => {
    const jobOfferEntity = jobOfferTestFactory.createRaw();
    const companyName = Generator.companyName();
    const companyLogo = Generator.imageUrl();
    const categoryName = Generator.categoryName();
    const skillId = Generator.uuid();
    const skillName = Generator.skillName();
    const locationCity = Generator.city();

    const jobOffer = mapper.mapExtendedToDomain({
      ...jobOfferEntity,
      company_name: companyName,
      company_logo_url: companyLogo,
      category_name: categoryName,
      city_name: locationCity,
      skill_ids: [skillId],
      skill_names: [skillName],
    });

    expect(jobOffer.getId()).toEqual(jobOfferEntity.id);

    expect(jobOffer.getState()).toEqual({
      name: jobOfferEntity.name,
      description: jobOfferEntity.description,
      isHidden: jobOfferEntity.is_hidden,
      isRemote: jobOfferEntity.is_remote,
      categoryId: jobOfferEntity.category_id,
      locationId: jobOfferEntity.location_id,
      category: { name: categoryName },
      companyId: jobOfferEntity.company_id,
      company: { name: companyName, logoUrl: companyLogo },
      createdAt: jobOfferEntity.created_at,
      employmentType: jobOfferEntity.employment_type,
      workingTime: jobOfferEntity.working_time,
      experienceLevel: jobOfferEntity.experience_level,
      minSalary: jobOfferEntity.min_salary,
      maxSalary: jobOfferEntity.max_salary,
      skills: [
        {
          id: skillId,
          name: skillName,
        },
      ],
      location: {
        city: locationCity,
      },
    });
  });
});

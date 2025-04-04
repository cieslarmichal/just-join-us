import { Generator } from '../../../../../../tests/generator.ts';
import type { JobOfferRawEntity } from '../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOfferRawEntity.ts';
import { JobOffer, type JobOfferDraft } from '../../../domain/entities/jobOffer/jobOffer.ts';

export class JobOfferTestFactory {
  public create(input: Partial<JobOfferDraft> = {}): JobOffer {
    return new JobOffer({
      id: Generator.uuid(),
      name: Generator.jobOfferName(),
      description: Generator.jobOfferDescription(),
      isHidden: false,
      categoryId: Generator.uuid(),
      companyId: Generator.uuid(),
      createdAt: Generator.pastDate(),
      ...input,
    });
  }

  public createRaw(input: Partial<JobOfferRawEntity> = {}): JobOfferRawEntity {
    return {
      id: Generator.uuid(),
      name: Generator.jobOfferName(),
      description: Generator.jobOfferDescription(),
      is_hidden: false,
      category_id: Generator.uuid(),
      company_id: Generator.uuid(),
      created_at: Generator.pastDate(),
      ...input,
    };
  }
}

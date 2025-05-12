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
      isRemote: true,
      categoryId: Generator.uuid(),
      companyId: Generator.uuid(),
      employmentType: Generator.employmentType(),
      experienceLevel: Generator.experienceLevel(),
      workingTime: Generator.workingTime(),
      minSalary: Generator.minSalary(),
      maxSalary: Generator.maxSalary(),
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
      is_remote: true,
      category_id: Generator.uuid(),
      company_id: Generator.uuid(),
      employment_type: Generator.employmentType(),
      working_time: Generator.workingTime(),
      experience_level: Generator.experienceLevel(),
      min_salary: Generator.minSalary(),
      max_salary: Generator.maxSalary(),
      created_at: Generator.pastDate(),
      ...input,
    };
  }
}

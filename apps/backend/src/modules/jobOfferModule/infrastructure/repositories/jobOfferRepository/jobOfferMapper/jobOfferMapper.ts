import type { JobOfferRawEntityExtended } from '../../../../../databaseModule/infrastructure/tables/jobOffersTable/jobOfferRawEntity.ts';
import { JobOffer } from '../../../../domain/entities/jobOffer/jobOffer.ts';

export class JobOfferMapper {
  public mapExtendedToDomain(entity: JobOfferRawEntityExtended): JobOffer {
    const {
      id,
      name,
      description,
      is_hidden: isHidden,
      created_at: createdAt,
      category_id: categoryId,
      category_name: categoryName,
      company_id: companyId,
      company_name: companyName,
      company_logo_url: companyLogoUrl,
      employment_type: employmentType,
      working_time: workingTime,
      experience_level: experienceLevel,
      min_salary: minSalary,
      max_salary: maxSalary,
      skill_ids: skillIds,
      skill_names: skillNames,
      is_remote: isRemote,
      location_id: locationId,
      city_name: cityName,
    } = entity;

    return new JobOffer({
      id,
      name,
      description,
      isHidden,
      createdAt,
      categoryId,
      category: { name: categoryName },
      companyId,
      company: { name: companyName, logoUrl: companyLogoUrl },
      employmentType,
      workingTime,
      experienceLevel,
      minSalary,
      maxSalary,
      skills:
        skillIds && skillNames
          ? skillIds
              .filter((id) => id !== null)
              .map((id, index) => ({
                id,
                name: skillNames[index] as string,
              }))
          : [],
      isRemote,
      locationId: locationId || undefined,
      location: cityName
        ? {
            city: cityName,
          }
        : undefined,
    });
  }
}

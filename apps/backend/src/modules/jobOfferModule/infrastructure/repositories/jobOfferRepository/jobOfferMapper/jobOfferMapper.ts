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
      location_ids: locationIds,
      location_is_remote: locationIsRemote,
      location_cities: locationCities,
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
      locations:
        locationIds && locationIsRemote && locationCities
          ? locationIds
              .filter((id) => id !== null)
              .map((id, index) => ({
                id,
                isRemote: locationIsRemote[index] as boolean,
                city: locationCities[index] ?? undefined,
              }))
          : [],
    });
  }
}

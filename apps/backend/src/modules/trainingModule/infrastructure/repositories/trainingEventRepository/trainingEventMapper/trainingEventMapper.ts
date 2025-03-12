import type { TrainingEventRawEntityExtended } from '../../../../../databaseModule/infrastructure/tables/trainingEventTable/trainingEventRawEntity.ts';
import { TrainingEvent } from '../../../../domain/entities/trainingEvent/trainingEvent.ts';

export class TrainingEventMapper {
  public mapExtendedToDomain(entity: TrainingEventRawEntityExtended): TrainingEvent {
    const {
      id,
      city,
      place,
      latitude,
      longitude,
      cent_price: centPrice,
      starts_at: startsAt,
      ends_at: endsAt,
      is_hidden: isHidden,
      training_id: trainingId,
      created_at: createdAt,
      training_name,
      training_description,
      category_name,
      company_name,
      company_logo_url,
    } = entity;

    return new TrainingEvent({
      id,
      city,
      place,
      latitude,
      longitude,
      centPrice,
      startsAt,
      endsAt,
      isHidden,
      trainingId,
      createdAt,
      training: {
        name: training_name,
        description: training_description,
        categoryName: category_name,
        companyName: company_name,
        companyLogoUrl: company_logo_url,
      },
    });
  }
}

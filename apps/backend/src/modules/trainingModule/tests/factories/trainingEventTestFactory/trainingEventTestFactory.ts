import { Generator } from '../../../../../../tests/generator.ts';
import type { TrainingEventRawEntity } from '../../../../databaseModule/infrastructure/tables/trainingEventTable/trainingEventRawEntity.ts';
import { TrainingEvent, type TrainingEventDraft } from '../../../domain/entities/trainingEvent/trainingEvent.ts';

export class TrainingEventTestFactory {
  public create(input: Partial<TrainingEventDraft> = {}): TrainingEvent {
    const startsAt = Generator.futureDate();
    const endsAt = Generator.soonDate(startsAt);

    return new TrainingEvent({
      id: Generator.uuid(),
      city: Generator.city(),
      place: Generator.place(),
      latitude: Generator.latitude(),
      longitude: Generator.longitude(),
      startsAt,
      endsAt,
      centPrice: Generator.centPrice(),
      isHidden: false,
      trainingId: Generator.uuid(),
      createdAt: Generator.pastDate(),
      ...input,
    });
  }

  public createRaw(input: Partial<TrainingEventRawEntity> = {}): TrainingEventRawEntity {
    const startsAt = Generator.futureDate();
    const endsAt = Generator.soonDate(startsAt);

    return {
      id: Generator.uuid(),
      city: Generator.city(),
      place: Generator.place(),
      latitude: Generator.latitude(),
      longitude: Generator.longitude(),
      starts_at: startsAt,
      ends_at: endsAt,
      cent_price: Generator.centPrice(),
      is_hidden: false,
      training_id: Generator.uuid(),
      created_at: Generator.pastDate(),
      ...input,
    };
  }
}

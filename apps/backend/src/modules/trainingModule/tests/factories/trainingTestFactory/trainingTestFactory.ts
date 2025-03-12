import { Generator } from '../../../../../../tests/generator.ts';
import type { TrainingRawEntity } from '../../../../databaseModule/infrastructure/tables/trainingsTable/trainingRawEntity.ts';
import { Training, type TrainingDraft } from '../../../domain/entities/training/training.ts';

export class TrainingTestFactory {
  public create(input: Partial<TrainingDraft> = {}): Training {
    return new Training({
      id: Generator.uuid(),
      name: Generator.trainingName(),
      description: Generator.trainingDescription(),
      isHidden: false,
      categoryId: Generator.uuid(),
      companyId: Generator.uuid(),
      createdAt: Generator.pastDate(),
      ...input,
    });
  }

  public createRaw(input: Partial<TrainingRawEntity> = {}): TrainingRawEntity {
    return {
      id: Generator.uuid(),
      name: Generator.trainingName(),
      description: Generator.trainingDescription(),
      is_hidden: false,
      category_id: Generator.uuid(),
      company_id: Generator.uuid(),
      created_at: Generator.pastDate(),
      ...input,
    };
  }
}

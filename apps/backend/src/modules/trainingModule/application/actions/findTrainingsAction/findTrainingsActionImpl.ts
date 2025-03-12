import type { TrainingRepository } from '../../../domain/repositories/trainingRepository/trainingRepository.ts';

import {
  type FindTrainingsAction,
  type FindTrainingsActionPayload,
  type FindTrainingsActionResult,
} from './findTrainingsAction.ts';

export class FindTrainingsActionImpl implements FindTrainingsAction {
  private readonly trainingRepository: TrainingRepository;

  public constructor(trainingRepository: TrainingRepository) {
    this.trainingRepository = trainingRepository;
  }

  public async execute(payload: FindTrainingsActionPayload): Promise<FindTrainingsActionResult> {
    const { name, companyId, page, pageSize } = payload;

    const [trainings, total] = await Promise.all([
      this.trainingRepository.findTrainings({ companyId, name, page, pageSize }),
      this.trainingRepository.countTrainings({ companyId, name }),
    ]);

    return { data: trainings, total };
  }
}

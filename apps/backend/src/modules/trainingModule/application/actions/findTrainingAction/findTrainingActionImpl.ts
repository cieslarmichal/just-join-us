import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import { type TrainingRepository } from '../../../domain/repositories/trainingRepository/trainingRepository.ts';

import {
  type FindTrainingAction,
  type FindTrainingActionPayload,
  type FindTrainingActionResult,
} from './findTrainingAction.ts';

export class FindTrainingActionImpl implements FindTrainingAction {
  private readonly trainingRepository: TrainingRepository;

  public constructor(trainingRepository: TrainingRepository) {
    this.trainingRepository = trainingRepository;
  }

  public async execute(payload: FindTrainingActionPayload): Promise<FindTrainingActionResult> {
    const { id } = payload;

    const training = await this.trainingRepository.findTraining({ id });

    if (!training) {
      throw new ResourceNotFoundError({
        resource: 'Training',
        id,
      });
    }

    return { training };
  }
}

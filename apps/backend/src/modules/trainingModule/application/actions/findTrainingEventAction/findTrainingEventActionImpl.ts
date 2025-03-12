import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.ts';
import type { TrainingEventRepository } from '../../../domain/repositories/trainingEventRepository/trainingEventRepository.ts';

import {
  type FindTrainingEventAction,
  type FindTrainingEventActionPayload,
  type FindTrainingEventActionResult,
} from './findTrainingEventAction.ts';

export class FindTrainingEventActionImpl implements FindTrainingEventAction {
  private readonly trainingEventRepository: TrainingEventRepository;

  public constructor(trainingEventRepository: TrainingEventRepository) {
    this.trainingEventRepository = trainingEventRepository;
  }

  public async execute(payload: FindTrainingEventActionPayload): Promise<FindTrainingEventActionResult> {
    const { id } = payload;

    const trainingEvent = await this.trainingEventRepository.findTrainingEvent({ id });

    if (!trainingEvent) {
      throw new ResourceNotFoundError({
        resource: 'TrainingEvent',
        id,
      });
    }

    return { trainingEvent };
  }
}

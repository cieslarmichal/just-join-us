import type { TrainingEventRepository } from '../../../domain/repositories/trainingEventRepository/trainingEventRepository.ts';

import {
  type FindTrainingEventsAction,
  type FindTrainingEventsActionPayload,
  type FindTrainingEventsActionResult,
} from './findTrainingEventsAction.ts';

export class FindTrainingEventsActionImpl implements FindTrainingEventsAction {
  private readonly trainingEventRepository: TrainingEventRepository;

  public constructor(trainingEventRepository: TrainingEventRepository) {
    this.trainingEventRepository = trainingEventRepository;
  }

  public async execute(payload: FindTrainingEventsActionPayload): Promise<FindTrainingEventsActionResult> {
    const { trainingName, categoryId, companyId, latitude, longitude, radius, page, pageSize } = payload;

    const [trainingEvents, total] = await Promise.all([
      this.trainingEventRepository.findTrainingEvents({
        trainingName,
        companyId,
        categoryId,
        latitude,
        longitude,
        radius,
        page,
        pageSize,
      }),
      this.trainingEventRepository.countTrainingEvents({
        trainingName,
        companyId,
        categoryId,
        latitude,
        longitude,
        radius,
      }),
    ]);

    return { data: trainingEvents, total };
  }
}

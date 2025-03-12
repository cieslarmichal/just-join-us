import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { type TrainingEventRepository } from '../../../domain/repositories/trainingEventRepository/trainingEventRepository.ts';
import type { TrainingRepository } from '../../../domain/repositories/trainingRepository/trainingRepository.ts';

import {
  type CreateTrainingEventAction,
  type CreateTrainingEventActionPayload,
  type CreateTrainingEventActionResult,
} from './createTrainingEventAction.ts';

export class CreateTrainingEventActionImpl implements CreateTrainingEventAction {
  private readonly trainingEventRepository: TrainingEventRepository;
  private readonly trainingRepository: TrainingRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    trainingEventRepository: TrainingEventRepository,
    trainingRepository: TrainingRepository,
    loggerService: LoggerService,
  ) {
    this.trainingEventRepository = trainingEventRepository;
    this.trainingRepository = trainingRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: CreateTrainingEventActionPayload): Promise<CreateTrainingEventActionResult> {
    const { city, place, latitude, longitude, trainingId, centPrice, startsAt, endsAt } = payload;

    this.loggerService.debug({
      message: 'Creating TrainingEvent...',
      city,
      place,
      latitude,
      longitude,
      trainingId,
      centPrice,
      startsAt,
      endsAt,
    });

    const training = await this.trainingRepository.findTraining({ id: trainingId });

    if (!training) {
      throw new OperationNotValidError({
        reason: 'Training not found.',
        id: trainingId,
      });
    }

    const trainingEvent = await this.trainingEventRepository.createTrainingEvent({
      data: {
        city,
        place,
        latitude,
        longitude,
        centPrice,
        startsAt,
        endsAt,
        trainingId,
        isHidden: false,
      },
    });

    this.loggerService.debug({
      message: 'TrainingEvent created.',
      id: trainingEvent.getId(),
      trainingId: trainingEvent.getTrainingId(),
    });

    return { trainingEvent };
  }
}

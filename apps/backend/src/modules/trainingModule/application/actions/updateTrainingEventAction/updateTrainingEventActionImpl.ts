import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import { type TrainingEventRepository } from '../../../domain/repositories/trainingEventRepository/trainingEventRepository.ts';

import {
  type UpdateTrainingEventActionResult,
  type UpdateTrainingEventAction,
  type UpdateTrainingEventActionPayload,
} from './updateTrainingEventAction.ts';

export class UpdateTrainingEventActionImpl implements UpdateTrainingEventAction {
  private readonly trainingEventRepository: TrainingEventRepository;
  private readonly loggerService: LoggerService;

  public constructor(trainingEventRepository: TrainingEventRepository, loggerService: LoggerService) {
    this.trainingEventRepository = trainingEventRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: UpdateTrainingEventActionPayload): Promise<UpdateTrainingEventActionResult> {
    const { id, city, place, latitude, longitude, centPrice, startsAt, endsAt, isHidden } = payload;

    this.loggerService.debug({
      message: 'Updating TrainingEvent...',
      id,
      city,
      place,
      latitude,
      longitude,
      centPrice,
      startsAt,
      endsAt,
      isHidden,
    });

    const trainingEvent = await this.trainingEventRepository.findTrainingEvent({ id });

    if (!trainingEvent) {
      throw new OperationNotValidError({
        reason: 'TrainingEvent not found.',
        id,
      });
    }

    if (city) {
      trainingEvent.setCity({ city });
    }

    if (place) {
      trainingEvent.setPlace({ place });
    }

    if (latitude !== undefined) {
      trainingEvent.setLatitude({ latitude });
    }

    if (longitude !== undefined) {
      trainingEvent.setLongitude({ longitude });
    }

    if (centPrice !== undefined) {
      trainingEvent.setCentPrice({ centPrice });
    }

    if (startsAt) {
      trainingEvent.setStartsAt({ startsAt });
    }

    if (endsAt) {
      trainingEvent.setEndsAt({ endsAt });
    }

    if (isHidden !== undefined) {
      trainingEvent.setIsHidden({ isHidden });
    }

    await this.trainingEventRepository.updateTrainingEvent({ trainingEvent });

    this.loggerService.debug({ message: 'TrainingEvent updated.', id });

    return { trainingEvent };
  }
}

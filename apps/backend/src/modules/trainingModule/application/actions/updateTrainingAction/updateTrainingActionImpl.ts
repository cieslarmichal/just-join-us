import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CategoryRepository } from '../../../domain/repositories/categoryRepository/categoryRepository.ts';
import type { TrainingRepository } from '../../../domain/repositories/trainingRepository/trainingRepository.ts';

import {
  type UpdateTrainingEventActionResult,
  type UpdateTrainingAction,
  type UpdateTrainingActionPayload,
} from './updateTrainingAction.ts';

export class UpdateTrainingActionImpl implements UpdateTrainingAction {
  private readonly trainingRepository: TrainingRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    trainingRepository: TrainingRepository,
    categoryRepository: CategoryRepository,
    loggerService: LoggerService,
  ) {
    this.trainingRepository = trainingRepository;
    this.categoryRepository = categoryRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: UpdateTrainingActionPayload): Promise<UpdateTrainingEventActionResult> {
    const { id, name, description, categoryId, isHidden } = payload;

    this.loggerService.debug({
      message: 'Updating Training...',
      id,
      name,
      description,
      categoryId,
      isHidden,
    });

    const training = await this.trainingRepository.findTraining({ id });

    if (!training) {
      throw new OperationNotValidError({
        reason: 'Training not found.',
        id,
      });
    }

    if (name) {
      training.setName({ name });
    }

    if (description) {
      training.setDescription({ description });
    }

    if (categoryId) {
      const category = await this.categoryRepository.findCategory({ id: categoryId });

      if (!category) {
        throw new OperationNotValidError({
          reason: 'Category not found.',
          id: categoryId,
        });
      }

      training.setCategory({ category });
    }

    if (isHidden !== undefined) {
      training.setIsHidden({ isHidden });
    }

    await this.trainingRepository.updateTraining({ training });

    this.loggerService.debug({ message: 'Training updated.', id });

    return { training };
  }
}

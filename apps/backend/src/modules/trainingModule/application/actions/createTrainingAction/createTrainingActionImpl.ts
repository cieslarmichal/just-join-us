import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CompanyRepository } from '../../../../userModule/domain/repositories/companyRepository/companyRepository.ts';
import type { CategoryRepository } from '../../../domain/repositories/categoryRepository/categoryRepository.ts';
import type { TrainingRepository } from '../../../domain/repositories/trainingRepository/trainingRepository.ts';

import {
  type CreateTrainingAction,
  type CreateTrainingActionPayload,
  type CreateTrainingActionResult,
} from './createTrainingAction.ts';

export class CreateTrainingActionImpl implements CreateTrainingAction {
  private readonly trainingRepository: TrainingRepository;
  private readonly companyRepository: CompanyRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    trainingRepository: TrainingRepository,
    companyRepository: CompanyRepository,
    categoryRepository: CategoryRepository,
    loggerService: LoggerService,
  ) {
    this.trainingRepository = trainingRepository;
    this.companyRepository = companyRepository;
    this.categoryRepository = categoryRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: CreateTrainingActionPayload): Promise<CreateTrainingActionResult> {
    const { name, description, categoryId, companyId } = payload;

    this.loggerService.debug({
      message: 'Creating Training...',
      name,
      description,
      categoryId,
      companyId,
    });

    const existingTraining = await this.trainingRepository.findTraining({ name, companyId });

    if (existingTraining) {
      throw new ResourceAlreadyExistsError({
        resource: 'Training',
        id: existingTraining.getId(),
        name,
        companyId,
      });
    }

    const company = await this.companyRepository.findCompany({ id: companyId });

    if (!company) {
      throw new OperationNotValidError({
        reason: 'Company not found.',
        id: companyId,
      });
    }

    const category = await this.categoryRepository.findCategory({ id: categoryId });

    if (!category) {
      throw new OperationNotValidError({
        reason: 'Category not found.',
        id: categoryId,
      });
    }

    const training = await this.trainingRepository.createTraining({
      data: {
        name,
        description,
        isHidden: false,
        categoryId,
        companyId,
      },
    });

    this.loggerService.debug({
      message: 'Training created.',
      id: training.getId(),
      name,
      companyId,
    });

    return { training };
  }
}

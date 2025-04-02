import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';
import { type DependencyInjectionModule } from '../../common/dependencyInjection/dependencyInjectionModule.ts';
import { type LoggerService } from '../../common/logger/loggerService.ts';
import { type UuidService } from '../../common/uuid/uuidService.ts';
import { applicationSymbols } from '../applicationModule/symbols.ts';
import { type AccessControlService } from '../authModule/application/services/accessControlService/accessControlService.ts';
import { authSymbols } from '../authModule/symbols.ts';
import { databaseSymbols } from '../databaseModule/symbols.ts';
import type { DatabaseClient } from '../databaseModule/types/databaseClient.ts';
import type { CompanyRepository } from '../userModule/domain/repositories/companyRepository/companyRepository.ts';
import { userSymbols } from '../userModule/symbols.ts';

import { CategoryHttpController } from './api/httpControllers/categoryHttpController/categoryHttpController.ts';
import { TrainingHttpController } from './api/httpControllers/trainingHttpController/trainingHttpController.ts';
import type { CreateTrainingAction } from './application/actions/createTrainingAction/createTrainingAction.ts';
import { CreateTrainingActionImpl } from './application/actions/createTrainingAction/createTrainingActionImpl.ts';
import type { FindCategoriesAction } from './application/actions/findCategoriesAction/findCategoriesAction.ts';
import { FindCategoriesActionImpl } from './application/actions/findCategoriesAction/findCategoriesActionImpl.ts';
import type { FindTrainingAction } from './application/actions/findTrainingAction/findTrainingAction.ts';
import { FindTrainingActionImpl } from './application/actions/findTrainingAction/findTrainingActionImpl.ts';
import type { FindTrainingsAction } from './application/actions/findTrainingsAction/findTrainingsAction.ts';
import { FindTrainingsActionImpl } from './application/actions/findTrainingsAction/findTrainingsActionImpl.ts';
import type { UpdateTrainingAction } from './application/actions/updateTrainingAction/updateTrainingAction.ts';
import { UpdateTrainingActionImpl } from './application/actions/updateTrainingAction/updateTrainingActionImpl.ts';
import type { CategoryRepository } from './domain/repositories/categoryRepository/categoryRepository.ts';
import type { TrainingRepository } from './domain/repositories/trainingRepository/trainingRepository.ts';
import { CategoryMapper } from './infrastructure/repositories/categoryRepository/categoryMapper/categoryMapper.ts';
import { CategoryRepositoryImpl } from './infrastructure/repositories/categoryRepository/categoryRepositoryImpl.ts';
import { TrainingMapper } from './infrastructure/repositories/trainingRepository/trainingMapper/trainingMapper.ts';
import { TrainingRepositoryImpl } from './infrastructure/repositories/trainingRepository/trainingRepositoryImpl.ts';
import { symbols } from './symbols.ts';

export class TrainingModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<CategoryMapper>(symbols.categoryMapper, () => new CategoryMapper());

    container.bind<CategoryRepository>(
      symbols.categoryRepository,
      () =>
        new CategoryRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<CategoryMapper>(symbols.categoryMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<FindCategoriesAction>(
      symbols.findCategoriesAction,
      () => new FindCategoriesActionImpl(container.get<CategoryRepository>(symbols.categoryRepository)),
    );

    container.bind<TrainingMapper>(symbols.trainingMapper, () => new TrainingMapper());

    container.bind<TrainingRepository>(
      symbols.trainingRepository,
      () =>
        new TrainingRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<TrainingMapper>(symbols.trainingMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<CreateTrainingAction>(
      symbols.createTrainingAction,
      () =>
        new CreateTrainingActionImpl(
          container.get<TrainingRepository>(symbols.trainingRepository),
          container.get<CompanyRepository>(userSymbols.companyRepository),
          container.get<CategoryRepository>(symbols.categoryRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<FindTrainingAction>(
      symbols.findTrainingAction,
      () => new FindTrainingActionImpl(container.get<TrainingRepository>(symbols.trainingRepository)),
    );

    container.bind<FindTrainingsAction>(
      symbols.findTrainingsAction,
      () => new FindTrainingsActionImpl(container.get<TrainingRepository>(symbols.trainingRepository)),
    );

    container.bind<UpdateTrainingAction>(
      symbols.updateTrainingAction,
      () =>
        new UpdateTrainingActionImpl(
          container.get<TrainingRepository>(symbols.trainingRepository),
          container.get<CategoryRepository>(symbols.categoryRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<TrainingHttpController>(
      symbols.trainingHttpController,
      () =>
        new TrainingHttpController(
          container.get<CreateTrainingAction>(symbols.createTrainingAction),
          container.get<FindTrainingAction>(symbols.findTrainingAction),
          container.get<FindTrainingsAction>(symbols.findTrainingsAction),
          container.get<UpdateTrainingAction>(symbols.updateTrainingAction),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );

    container.bind<CategoryHttpController>(
      symbols.categoryHttpController,
      () =>
        new CategoryHttpController(
          container.get<FindCategoriesAction>(symbols.findCategoriesAction),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );
  }
}

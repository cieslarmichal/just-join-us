import { type DependencyInjectionContainer } from '../../common/dependencyInjection/dependencyInjectionContainer.ts';
import { type DependencyInjectionModule } from '../../common/dependencyInjection/dependencyInjectionModule.ts';
import { type LoggerService } from '../../common/logger/loggerService.ts';
import { type UuidService } from '../../common/uuid/uuidService.ts';
import { applicationSymbols } from '../applicationModule/symbols.ts';
import { type AccessControlService } from '../authModule/application/services/accessControlService/accessControlService.ts';
import { authSymbols } from '../authModule/symbols.ts';
import { databaseSymbols } from '../databaseModule/symbols.ts';
import type { DatabaseClient } from '../databaseModule/types/databaseClient.ts';
import type { CompanyLocationRepository } from '../locationModule/domain/repositories/companyLocationRepository/companyLocationRepository.ts';
import { locationSymbols } from '../locationModule/symbols.ts';
import type { CompanyRepository } from '../userModule/domain/repositories/companyRepository/companyRepository.ts';
import { userSymbols } from '../userModule/symbols.ts';

import { CategoryHttpController } from './api/httpControllers/categoryHttpController/categoryHttpController.ts';
import { JobOfferHttpController } from './api/httpControllers/jobOfferHttpController/jobOfferHttpController.ts';
import { SkillHttpController } from './api/httpControllers/skillHttpController/skillHttpController.ts';
import type { CreateJobOfferAction } from './application/actions/createJobOfferAction/createJobOfferAction.ts';
import { CreateJobOfferActionImpl } from './application/actions/createJobOfferAction/createJobOfferActionImpl.ts';
import type { FindCategoriesAction } from './application/actions/findCategoriesAction/findCategoriesAction.ts';
import { FindCategoriesActionImpl } from './application/actions/findCategoriesAction/findCategoriesActionImpl.ts';
import type { FindJobOfferAction } from './application/actions/findJobOfferAction/findJobOfferAction.ts';
import { FindJobOfferActionImpl } from './application/actions/findJobOfferAction/findJobOfferActionImpl.ts';
import type { FindJobOffersAction } from './application/actions/findJobOffersAction/findJobOffersAction.ts';
import { FindJobOffersActionImpl } from './application/actions/findJobOffersAction/findJobOffersActionImpl.ts';
import type { FindSkillsAction } from './application/actions/findSkillsAction/findSkillsAction.ts';
import { FindSkillsActionImpl } from './application/actions/findSkillsAction/findSkillsActionImpl.ts';
import type { UpdateJobOfferAction } from './application/actions/updateJobOfferAction/updateJobOfferAction.ts';
import { UpdateJobOfferActionImpl } from './application/actions/updateJobOfferAction/updateJobOfferActionImpl.ts';
import type { CategoryRepository } from './domain/repositories/categoryRepository/categoryRepository.ts';
import type { JobOfferRepository } from './domain/repositories/jobOfferRepository/jobOfferRepository.ts';
import type { SkillRepository } from './domain/repositories/skillRepository/skillRepository.ts';
import { CategoryMapper } from './infrastructure/repositories/categoryRepository/categoryMapper/categoryMapper.ts';
import { CategoryRepositoryImpl } from './infrastructure/repositories/categoryRepository/categoryRepositoryImpl.ts';
import { JobOfferMapper } from './infrastructure/repositories/jobOfferRepository/jobOfferMapper/jobOfferMapper.ts';
import { JobOfferRepositoryImpl } from './infrastructure/repositories/jobOfferRepository/jobOfferRepositoryImpl.ts';
import { SkillMapper } from './infrastructure/repositories/skillRepository/skillMapper/skillMapper.ts';
import { SkillRepositoryImpl } from './infrastructure/repositories/skillRepository/skillRepositoryImpl.ts';
import { symbols } from './symbols.ts';

export class JobOfferModule implements DependencyInjectionModule {
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

    container.bind<SkillMapper>(symbols.skillMapper, () => new SkillMapper());

    container.bind<SkillRepository>(
      symbols.skillRepository,
      () =>
        new SkillRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<SkillMapper>(symbols.skillMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<FindSkillsAction>(
      symbols.findSkillsAction,
      () => new FindSkillsActionImpl(container.get<SkillRepository>(symbols.skillRepository)),
    );

    container.bind<JobOfferMapper>(symbols.jobOfferMapper, () => new JobOfferMapper());

    container.bind<JobOfferRepository>(
      symbols.jobOfferRepository,
      () =>
        new JobOfferRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<JobOfferMapper>(symbols.jobOfferMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<CreateJobOfferAction>(
      symbols.createJobOfferAction,
      () =>
        new CreateJobOfferActionImpl(
          container.get<JobOfferRepository>(symbols.jobOfferRepository),
          container.get<CompanyRepository>(userSymbols.companyRepository),
          container.get<CategoryRepository>(symbols.categoryRepository),
          container.get<SkillRepository>(symbols.skillRepository),
          container.get<CompanyLocationRepository>(locationSymbols.companyLocationRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<FindJobOfferAction>(
      symbols.findJobOfferAction,
      () => new FindJobOfferActionImpl(container.get<JobOfferRepository>(symbols.jobOfferRepository)),
    );

    container.bind<FindJobOffersAction>(
      symbols.findJobOffersAction,
      () => new FindJobOffersActionImpl(container.get<JobOfferRepository>(symbols.jobOfferRepository)),
    );

    container.bind<UpdateJobOfferAction>(
      symbols.updateJobOfferAction,
      () =>
        new UpdateJobOfferActionImpl(
          container.get<JobOfferRepository>(symbols.jobOfferRepository),
          container.get<CategoryRepository>(symbols.categoryRepository),
          container.get<SkillRepository>(symbols.skillRepository),
          container.get<CompanyLocationRepository>(locationSymbols.companyLocationRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<JobOfferHttpController>(
      symbols.jobOfferHttpController,
      () =>
        new JobOfferHttpController(
          container.get<CreateJobOfferAction>(symbols.createJobOfferAction),
          container.get<FindJobOfferAction>(symbols.findJobOfferAction),
          container.get<FindJobOffersAction>(symbols.findJobOffersAction),
          container.get<UpdateJobOfferAction>(symbols.updateJobOfferAction),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );

    container.bind<CategoryHttpController>(
      symbols.categoryHttpController,
      () => new CategoryHttpController(container.get<FindCategoriesAction>(symbols.findCategoriesAction)),
    );

    container.bind<SkillHttpController>(
      symbols.skillHttpController,
      () => new SkillHttpController(container.get<FindSkillsAction>(symbols.findSkillsAction)),
    );
  }
}

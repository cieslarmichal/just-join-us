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

import { CityHttpController } from './api/httpControllers/cityHttpController/cityHttpController.ts';
import { CompanyLocationHttpController } from './api/httpControllers/companyLocationHttpController/companyLocationHttpController.ts';
import type { CreateCompanyLocationAction } from './application/actions/createCompanyLocationAction/createCompanyLocationAction.ts';
import { CreateCompanyLocationActionImpl } from './application/actions/createCompanyLocationAction/createCompanyLocationActionImpl.ts';
import type { CreateRemoteCompanyLocationAction } from './application/actions/createRemoteCompanyLocationAction/createRemoteCompanyLocationAction.ts';
import { CreateRemoteCompanyLocationActionImpl } from './application/actions/createRemoteCompanyLocationAction/createRemoteCompanyLocationActionImpl.ts';
import type { FindCitiesAction } from './application/actions/findCitiesAction/findCitiesAction.ts';
import { FindCitiesActionImpl } from './application/actions/findCitiesAction/findCitiesActionImpl.ts';
import type { UpdateCompanyLocationAction } from './application/actions/updateCompanyLocationAction/updateCompanyLocationAction.ts';
import { UpdateCompanyLocationActionImpl } from './application/actions/updateCompanyLocationAction/updateCompanyLocationActionImpl.ts';
import type { CityRepository } from './domain/repositories/cityRepository/cityRepository.ts';
import type { CompanyLocationRepository } from './domain/repositories/companyLocationRepository/companyLocationRepository.ts';
import { CityMapper } from './infrastructure/repositories/cityRepository/cityMapper/cityMapper.ts';
import { CityRepositoryImpl } from './infrastructure/repositories/cityRepository/cityRepositoryImpl.ts';
import { CompanyLocationMapper } from './infrastructure/repositories/companyLocationRepository/companyLocationMapper/companyLocationMapper.ts';
import { CompanyLocationRepositoryImpl } from './infrastructure/repositories/companyLocationRepository/companyLocationRepositoryImpl.ts';
import { symbols } from './symbols.ts';

export class LocationModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<CityMapper>(symbols.cityMapper, () => new CityMapper());

    container.bind<CityRepository>(
      symbols.cityRepository,
      () =>
        new CityRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<CityMapper>(symbols.cityMapper),
        ),
    );

    container.bind<FindCitiesAction>(
      symbols.findCitiesAction,
      () => new FindCitiesActionImpl(container.get<CityRepository>(symbols.cityRepository)),
    );

    container.bind<CompanyLocationMapper>(symbols.companyLocationMapper, () => new CompanyLocationMapper());

    container.bind<CompanyLocationRepository>(
      symbols.companyLocationRepository,
      () =>
        new CompanyLocationRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<CompanyLocationMapper>(symbols.companyLocationMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<CreateCompanyLocationAction>(
      symbols.createCompanyLocationAction,
      () =>
        new CreateCompanyLocationActionImpl(
          container.get<CompanyLocationRepository>(symbols.companyLocationRepository),
          container.get<CompanyRepository>(userSymbols.companyRepository),
          container.get<CityRepository>(symbols.cityRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<CreateRemoteCompanyLocationAction>(
      symbols.createRemoteCompanyLocationAction,
      () =>
        new CreateRemoteCompanyLocationActionImpl(
          container.get<CompanyLocationRepository>(symbols.companyLocationRepository),
          container.get<CompanyRepository>(userSymbols.companyRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<UpdateCompanyLocationAction>(
      symbols.updateCompanyLocationAction,
      () =>
        new UpdateCompanyLocationActionImpl(
          container.get<CompanyLocationRepository>(symbols.companyLocationRepository),
          container.get<CityRepository>(symbols.cityRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<CompanyLocationHttpController>(
      symbols.companyLocationHttpController,
      () =>
        new CompanyLocationHttpController(
          container.get<CreateCompanyLocationAction>(symbols.createCompanyLocationAction),
          container.get<CreateRemoteCompanyLocationAction>(symbols.createRemoteCompanyLocationAction),
          container.get<UpdateCompanyLocationAction>(symbols.updateCompanyLocationAction),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );

    container.bind<CityHttpController>(
      symbols.cityHttpController,
      () => new CityHttpController(container.get<FindCitiesAction>(symbols.findCitiesAction)),
    );
  }
}

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
import { LocationHttpController } from './api/httpControllers/locationHttpController/locationHttpController.ts';
import type { CreateLocationAction } from './application/actions/createLocationAction/createLocationAction.ts';
import { CreateLocationActionImpl } from './application/actions/createLocationAction/createLocationActionImpl.ts';
import type { CreateRemoteLocationAction } from './application/actions/createRemoteLocationAction/createRemoteLocationAction.ts';
import { CreateRemoteLocationActionImpl } from './application/actions/createRemoteLocationAction/createRemoteLocationActionImpl.ts';
import type { FindCitiesAction } from './application/actions/findCitiesAction/findCitiesAction.ts';
import { FindCitiesActionImpl } from './application/actions/findCitiesAction/findCitiesActionImpl.ts';
import type { UpdateLocationAction } from './application/actions/updateLocationAction/updateLocationAction.ts';
import { UpdateLocationActionImpl } from './application/actions/updateLocationAction/updateLocationActionImpl.ts';
import type { CityRepository } from './domain/repositories/cityRepository/cityRepository.ts';
import type { LocationRepository } from './domain/repositories/locationRepository/locationRepository.ts';
import { CityMapper } from './infrastructure/repositories/cityRepository/cityMapper/cityMapper.ts';
import { CityRepositoryImpl } from './infrastructure/repositories/cityRepository/cityRepositoryImpl.ts';
import { LocationMapper } from './infrastructure/repositories/locationRepository/locationMapper/locationMapper.ts';
import { LocationRepositoryImpl } from './infrastructure/repositories/locationRepository/locationRepositoryImpl.ts';
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

    container.bind<LocationMapper>(symbols.locationMapper, () => new LocationMapper());

    container.bind<LocationRepository>(
      symbols.locationRepository,
      () =>
        new LocationRepositoryImpl(
          container.get<DatabaseClient>(databaseSymbols.databaseClient),
          container.get<LocationMapper>(symbols.locationMapper),
          container.get<UuidService>(applicationSymbols.uuidService),
        ),
    );

    container.bind<CreateLocationAction>(
      symbols.createLocationAction,
      () =>
        new CreateLocationActionImpl(
          container.get<LocationRepository>(symbols.locationRepository),
          container.get<CompanyRepository>(userSymbols.companyRepository),
          container.get<CityRepository>(symbols.cityRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<CreateRemoteLocationAction>(
      symbols.createRemoteLocationAction,
      () =>
        new CreateRemoteLocationActionImpl(
          container.get<LocationRepository>(symbols.locationRepository),
          container.get<CompanyRepository>(userSymbols.companyRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<UpdateLocationAction>(
      symbols.updateLocationAction,
      () =>
        new UpdateLocationActionImpl(
          container.get<LocationRepository>(symbols.locationRepository),
          container.get<CityRepository>(symbols.cityRepository),
          container.get<LoggerService>(applicationSymbols.loggerService),
        ),
    );

    container.bind<LocationHttpController>(
      symbols.locationHttpController,
      () =>
        new LocationHttpController(
          container.get<CreateLocationAction>(symbols.createLocationAction),
          container.get<CreateRemoteLocationAction>(symbols.createRemoteLocationAction),
          container.get<UpdateLocationAction>(symbols.updateLocationAction),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );

    container.bind<CityHttpController>(
      symbols.cityHttpController,
      () => new CityHttpController(container.get<FindCitiesAction>(symbols.findCitiesAction)),
    );
  }
}

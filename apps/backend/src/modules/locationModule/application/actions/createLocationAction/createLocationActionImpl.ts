import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CompanyRepository } from '../../../../userModule/domain/repositories/companyRepository/companyRepository.ts';
import type { CityRepository } from '../../../domain/repositories/cityRepository/cityRepository.ts';
import type { LocationRepository } from '../../../domain/repositories/locationRepository/locationRepository.ts';

import {
  type CreateLocationAction,
  type CreateLocationActionPayload,
  type CreateLocationActionResult,
} from './createLocationAction.ts';

export class CreateLocationActionImpl implements CreateLocationAction {
  private readonly locationRepository: LocationRepository;
  private readonly companyRepository: CompanyRepository;
  private readonly cityRepository: CityRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    locationRepository: LocationRepository,
    companyRepository: CompanyRepository,
    cityRepository: CityRepository,
    loggerService: LoggerService,
  ) {
    this.locationRepository = locationRepository;
    this.companyRepository = companyRepository;
    this.cityRepository = cityRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: CreateLocationActionPayload): Promise<CreateLocationActionResult> {
    const { name, companyId, address, cityId, latitude, longitude } = payload;

    this.loggerService.debug({
      message: 'Creating Location...',
      name,
      companyId,
      address,
      cityId,
      latitude,
      longitude,
    });

    const company = await this.companyRepository.findCompany({ id: companyId });

    if (!company) {
      throw new OperationNotValidError({
        reason: 'Company not found.',
        id: companyId,
      });
    }

    const existingLocation = await this.locationRepository.findLocation({ name, companyId });

    if (existingLocation) {
      throw new ResourceAlreadyExistsError({
        resource: 'Location',
        id: existingLocation.getId(),
        name,
        companyId,
      });
    }

    const city = await this.cityRepository.findCity({ id: cityId });

    if (!city) {
      throw new OperationNotValidError({
        reason: 'City not found.',
        id: cityId,
      });
    }

    const location = await this.locationRepository.createLocation({
      data: {
        name,
        companyId,
        isRemote: false,
        address,
        cityId,
        latitude,
        longitude,
      },
    });

    this.loggerService.debug({
      message: 'Location created.',
      id: location.getId(),
      name,
      companyId,
    });

    return { location };
  }
}

import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CityRepository } from '../../../domain/repositories/cityRepository/cityRepository.ts';
import type { CompanyLocationRepository } from '../../../domain/repositories/companyLocationRepository/companyLocationRepository.ts';

import {
  type UpdateCompanyLocationActionResult,
  type UpdateCompanyLocationAction,
  type UpdateCompanyLocationActionPayload,
} from './updateCompanyLocationAction.ts';

export class UpdateCompanyLocationActionImpl implements UpdateCompanyLocationAction {
  private readonly companyLocationRepository: CompanyLocationRepository;
  private readonly cityRepository: CityRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    companyLocationRepository: CompanyLocationRepository,
    cityRepository: CityRepository,
    loggerService: LoggerService,
  ) {
    this.companyLocationRepository = companyLocationRepository;
    this.cityRepository = cityRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: UpdateCompanyLocationActionPayload): Promise<UpdateCompanyLocationActionResult> {
    const { id, name, address, latitude, longitude, cityId } = payload;

    this.loggerService.debug({
      message: 'Updating company location...',
      id,
      name,
      address,
      latitude,
      longitude,
      cityId,
    });

    const companyLocation = await this.companyLocationRepository.findCompanyLocation({ id });

    if (!companyLocation) {
      throw new OperationNotValidError({
        reason: 'CompanyLocation not found.',
        id,
      });
    }

    if (name) {
      companyLocation.setName({ name });
    }

    if (address) {
      companyLocation.setAddress({ address });
    }

    if (latitude !== undefined) {
      companyLocation.setLatitude({ latitude });
    }

    if (longitude !== undefined) {
      companyLocation.setLongitude({ longitude });
    }

    if (cityId) {
      const city = await this.cityRepository.findCity({ id: cityId });

      if (!city) {
        throw new OperationNotValidError({
          reason: 'City not found.',
          id: cityId,
        });
      }

      companyLocation.setCityId({ cityId });
    }

    const updatedLocation = await this.companyLocationRepository.updateCompanyLocation({ companyLocation });

    this.loggerService.debug({ message: 'Company location updated.', id });

    return { companyLocation: updatedLocation };
  }
}

import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CityRepository } from '../../../domain/repositories/cityRepository/cityRepository.ts';
import type { LocationRepository } from '../../../domain/repositories/locationRepository/locationRepository.ts';

import {
  type UpdateLocationActionResult,
  type UpdateLocationAction,
  type UpdateLocationActionPayload,
} from './updateLocationAction.ts';

export class UpdateLocationActionImpl implements UpdateLocationAction {
  private readonly locationRepository: LocationRepository;
  private readonly cityRepository: CityRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    locationRepository: LocationRepository,
    cityRepository: CityRepository,
    loggerService: LoggerService,
  ) {
    this.locationRepository = locationRepository;
    this.cityRepository = cityRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: UpdateLocationActionPayload): Promise<UpdateLocationActionResult> {
    const { id, name, address, latitude, longitude, cityId } = payload;

    this.loggerService.debug({
      message: 'Updating Location...',
      id,
      name,
      address,
      latitude,
      longitude,
      cityId,
    });

    const location = await this.locationRepository.findLocation({ id });

    if (!location) {
      throw new OperationNotValidError({
        reason: 'Location not found.',
        id,
      });
    }

    if (name) {
      location.setName({ name });
    }

    if (address) {
      location.setAddress({ address });
    }

    if (latitude !== undefined) {
      location.setLatitude({ latitude });
    }

    if (longitude !== undefined) {
      location.setLongitude({ longitude });
    }

    if (cityId) {
      const city = await this.cityRepository.findCity({ id: cityId });

      if (!city) {
        throw new OperationNotValidError({
          reason: 'City not found.',
          id: cityId,
        });
      }

      location.setCityId({ cityId });
    }

    const updatedLocation = await this.locationRepository.updateLocation({ location });

    this.loggerService.debug({ message: 'Location updated.', id });

    return { location: updatedLocation };
  }
}

import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CompanyRepository } from '../../../../userModule/domain/repositories/companyRepository/companyRepository.ts';
import type { CityRepository } from '../../../domain/repositories/cityRepository/cityRepository.ts';
import type { CompanyLocationRepository } from '../../../domain/repositories/companyLocationRepository/companyLocationRepository.ts';

import {
  type CreateCompanyLocationAction,
  type CreateCompanyLocationActionPayload,
  type CreateCompanyLocationActionResult,
} from './createCompanyLocationAction.ts';

export class CreateCompanyLocationActionImpl implements CreateCompanyLocationAction {
  private readonly companyLocationRepository: CompanyLocationRepository;
  private readonly companyRepository: CompanyRepository;
  private readonly cityRepository: CityRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    companyLocationRepository: CompanyLocationRepository,
    companyRepository: CompanyRepository,
    cityRepository: CityRepository,
    loggerService: LoggerService,
  ) {
    this.companyLocationRepository = companyLocationRepository;
    this.companyRepository = companyRepository;
    this.cityRepository = cityRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: CreateCompanyLocationActionPayload): Promise<CreateCompanyLocationActionResult> {
    const { name, companyId, address, cityId, latitude, longitude } = payload;

    this.loggerService.debug({
      message: 'Creating company location...',
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

    const existingLocation = await this.companyLocationRepository.findCompanyLocation({ name, companyId });

    if (existingLocation) {
      throw new ResourceAlreadyExistsError({
        resource: 'CompanyLocation',
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

    const companyLocation = await this.companyLocationRepository.createCompanyLocation({
      data: {
        name,
        companyId,
        address,
        cityId,
        latitude,
        longitude,
      },
    });

    this.loggerService.debug({
      message: 'Company location created.',
      id: companyLocation.getId(),
      name,
      companyId,
    });

    return { companyLocation };
  }
}

import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CompanyRepository } from '../../../../userModule/domain/repositories/companyRepository/companyRepository.ts';
import type { LocationRepository } from '../../../domain/repositories/locationRepository/locationRepository.ts';

import {
  type CreateRemoteLocationAction,
  type CreateRemoteLocationActionPayload,
  type CreateRemoteLocationActionResult,
} from './createRemoteLocationAction.ts';

export class CreateRemoteLocationActionImpl implements CreateRemoteLocationAction {
  private readonly locationRepository: LocationRepository;
  private readonly companyRepository: CompanyRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    locationRepository: LocationRepository,
    companyRepository: CompanyRepository,
    loggerService: LoggerService,
  ) {
    this.locationRepository = locationRepository;
    this.companyRepository = companyRepository;
    this.loggerService = loggerService;
  }

  public async execute(payload: CreateRemoteLocationActionPayload): Promise<CreateRemoteLocationActionResult> {
    const { companyId, name } = payload;

    this.loggerService.debug({
      message: 'Creating remote Location...',
      companyId,
      name,
    });

    const company = await this.companyRepository.findCompany({ id: companyId });

    if (!company) {
      throw new OperationNotValidError({
        reason: 'Company not found.',
        id: companyId,
      });
    }

    const existingRemoteLocations = await this.locationRepository.findLocations({ companyId, isRemote: true });

    if (existingRemoteLocations.length > 0) {
      throw new ResourceAlreadyExistsError({
        resource: 'RemoteLocation',
        id: existingRemoteLocations[0]?.getId(),
        companyId,
      });
    }

    const location = await this.locationRepository.createLocation({
      data: {
        name,
        companyId,
        isRemote: true,
      },
    });

    this.loggerService.debug({
      message: 'Remote Location created.',
      id: location.getId(),
      companyId,
    });

    return { location };
  }
}

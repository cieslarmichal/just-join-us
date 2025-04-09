import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.ts';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.ts';
import { type LoggerService } from '../../../../../common/logger/loggerService.ts';
import type { CompanyRepository } from '../../../../userModule/domain/repositories/companyRepository/companyRepository.ts';
import type { CompanyLocationRepository } from '../../../domain/repositories/companyLocationRepository/companyLocationRepository.ts';

import {
  type CreateRemoteCompanyLocationAction,
  type CreateRemoteCompanyLocationActionPayload,
  type CreateRemoteCompanyLocationActionResult,
} from './createRemoteCompanyLocationAction.ts';

export class CreateRemoteCompanyLocationActionImpl implements CreateRemoteCompanyLocationAction {
  private readonly companyLocationRepository: CompanyLocationRepository;
  private readonly companyRepository: CompanyRepository;
  private readonly loggerService: LoggerService;

  public constructor(
    companyLocationRepository: CompanyLocationRepository,
    companyRepository: CompanyRepository,
    loggerService: LoggerService,
  ) {
    this.companyLocationRepository = companyLocationRepository;
    this.companyRepository = companyRepository;
    this.loggerService = loggerService;
  }

  public async execute(
    payload: CreateRemoteCompanyLocationActionPayload,
  ): Promise<CreateRemoteCompanyLocationActionResult> {
    const { companyId, name } = payload;

    this.loggerService.debug({
      message: 'Creating remote company location...',
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

    const existingRemoteLocations = await this.companyLocationRepository.findCompanyLocations({
      companyId,
      isRemote: true,
    });

    if (existingRemoteLocations.length > 0) {
      throw new ResourceAlreadyExistsError({
        resource: 'RemoteLocation',
        id: existingRemoteLocations[0]?.getId(),
        companyId,
      });
    }

    const companyLocation = await this.companyLocationRepository.createCompanyLocation({
      data: {
        name,
        companyId,
        isRemote: true,
      },
    });

    this.loggerService.debug({
      message: 'Remote company location created.',
      id: companyLocation.getId(),
      companyId,
    });

    return { companyLocation };
  }
}

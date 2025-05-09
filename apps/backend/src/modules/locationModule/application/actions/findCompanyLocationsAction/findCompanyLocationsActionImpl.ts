import type { CompanyLocationRepository } from '../../../domain/repositories/companyLocationRepository/companyLocationRepository.ts';

import {
  type FindCompanyLocationsAction,
  type FindCompanyLocationsActionPayload,
  type FindCompanyLocationsActionResult,
} from './findCompanyLocationsAction.ts';

export class FindCompanyLocationsActionImpl implements FindCompanyLocationsAction {
  private readonly companyLocationRepository: CompanyLocationRepository;

  public constructor(companyLocationRepository: CompanyLocationRepository) {
    this.companyLocationRepository = companyLocationRepository;
  }

  public async execute(payload: FindCompanyLocationsActionPayload): Promise<FindCompanyLocationsActionResult> {
    const { companyId, page, pageSize } = payload;

    const [companyLocations, total] = await Promise.all([
      this.companyLocationRepository.findCompanyLocations({ companyId, page, pageSize }),
      this.companyLocationRepository.countCompanyLocations({ companyId }),
    ]);

    return { data: companyLocations, total };
  }
}

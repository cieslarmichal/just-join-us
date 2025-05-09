import { type Action } from '../../../../../common/types/action.ts';
import type { CompanyLocation } from '../../../domain/entities/companyLocation/companyLocation.ts';

export interface FindCompanyLocationsActionPayload {
  readonly companyId: string;
  readonly page: number;
  readonly pageSize: number;
}

export interface FindCompanyLocationsActionResult {
  readonly data: CompanyLocation[];
  readonly total: number;
}

export type FindCompanyLocationsAction = Action<FindCompanyLocationsActionPayload, FindCompanyLocationsActionResult>;

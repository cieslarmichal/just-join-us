import { type Action } from '../../../../../common/types/action.ts';
import type { CompanyLocation } from '../../../domain/entities/companyLocation/companyLocation.ts';

export interface UpdateCompanyLocationActionPayload {
  readonly id: string;
  readonly name?: string | undefined;
  readonly address?: string | undefined;
  readonly cityId?: string | undefined;
  readonly latitude?: number | undefined;
  readonly longitude?: number | undefined;
}

export interface UpdateCompanyLocationActionResult {
  readonly companyLocation: CompanyLocation;
}

export type UpdateCompanyLocationAction = Action<UpdateCompanyLocationActionPayload, UpdateCompanyLocationActionResult>;

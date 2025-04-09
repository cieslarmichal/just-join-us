import { type Action } from '../../../../../common/types/action.ts';
import type { CompanyLocation } from '../../../domain/entities/companyLocation/companyLocation.ts';

export interface CreateCompanyLocationActionPayload {
  readonly companyId: string;
  readonly name: string;
  readonly cityId: string;
  readonly address: string;
  readonly latitude: number;
  readonly longitude: number;
}

export interface CreateCompanyLocationActionResult {
  readonly companyLocation: CompanyLocation;
}

export type CreateCompanyLocationAction = Action<CreateCompanyLocationActionPayload, CreateCompanyLocationActionResult>;

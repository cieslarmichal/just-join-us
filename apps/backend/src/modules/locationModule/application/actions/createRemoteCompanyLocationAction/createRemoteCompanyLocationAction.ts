import { type Action } from '../../../../../common/types/action.ts';
import type { CompanyLocation } from '../../../domain/entities/companyLocation/companyLocation.ts';

export interface CreateRemoteCompanyLocationActionPayload {
  readonly name: string;
  readonly companyId: string;
}

export interface CreateRemoteCompanyLocationActionResult {
  readonly companyLocation: CompanyLocation;
}

export type CreateRemoteCompanyLocationAction = Action<
  CreateRemoteCompanyLocationActionPayload,
  CreateRemoteCompanyLocationActionResult
>;

import { type Action } from '../../../../../common/types/action.ts';
import { type Company } from '../../../domain/entities/company/company.ts';

export interface RegisterCompanyActionPayload {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly taxIdNumber: string;
  readonly phoneNumber: string;
  readonly logoUrl: string;
}

export interface RegisterCompanyActionResult {
  readonly company: Company;
}

export type RegisterCompanyAction = Action<RegisterCompanyActionPayload, RegisterCompanyActionResult>;

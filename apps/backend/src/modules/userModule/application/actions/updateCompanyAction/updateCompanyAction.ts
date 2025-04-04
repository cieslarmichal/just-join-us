import { type Action } from '../../../../../common/types/action.ts';
import { type Company } from '../../../domain/entities/company/company.ts';

export interface UpdateCompanyActionPayload {
  readonly id: string;
  readonly name?: string | undefined;
  readonly description?: string | undefined;
  readonly phone?: string | undefined;
  readonly logoUrl?: string | undefined;
  readonly isDeleted?: boolean | undefined;
}

export interface UpdateCompanyActionResult {
  readonly company: Company;
}

export type UpdateCompanyAction = Action<UpdateCompanyActionPayload, UpdateCompanyActionResult>;

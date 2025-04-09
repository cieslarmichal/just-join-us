import { type CompanyLocationState, type CompanyLocation } from '../../entities/companyLocation/companyLocation.ts';

export interface CreateCompanyLocationPayload {
  readonly data: Omit<CompanyLocationState, 'id'>;
}

export interface UpdateCompanyLocationPayload {
  readonly companyLocation: CompanyLocation;
}

export interface FindCompanyLocationPayload {
  readonly id?: string;
  readonly companyId?: string;
  readonly name?: string;
}

export interface FindCompanyLocationsPayload {
  readonly ids?: string[] | undefined;
  readonly name?: string | undefined;
  readonly companyId?: string | undefined;
  readonly isRemote?: boolean | undefined;
}

export interface CompanyLocationRepository {
  createCompanyLocation(payload: CreateCompanyLocationPayload): Promise<CompanyLocation>;
  updateCompanyLocation(payload: UpdateCompanyLocationPayload): Promise<CompanyLocation>;
  findCompanyLocation(payload: FindCompanyLocationPayload): Promise<CompanyLocation | null>;
  findCompanyLocations(payload: FindCompanyLocationsPayload): Promise<CompanyLocation[]>;
}

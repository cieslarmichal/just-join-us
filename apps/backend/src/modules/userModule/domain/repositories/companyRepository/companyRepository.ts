import { type Company, type CompanyDraft } from '../../entities/company/company.ts';

export interface CreateCompanyPayload {
  readonly data: Omit<CompanyDraft, 'id' | 'createdAt'>;
}

export interface UpdateCompanyPayload {
  readonly company: Company;
}

export interface FindCompanyPayload {
  readonly id?: string;
  readonly email?: string;
}

export interface FindCompaniesPayload {
  readonly name?: string;
  readonly page: number;
  readonly pageSize: number;
}

export interface CountCompaniesPayload {
  readonly name?: string;
}

export interface CompanyRepository {
  createCompany(payload: CreateCompanyPayload): Promise<Company>;
  updateCompany(payload: UpdateCompanyPayload): Promise<Company>;
  findCompany(payload: FindCompanyPayload): Promise<Company | null>;
  findCompanies(payload: FindCompaniesPayload): Promise<Company[]>;
  countCompanies(payload: CountCompaniesPayload): Promise<number>;
}

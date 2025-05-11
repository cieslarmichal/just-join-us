export interface CompanyLocation {
  readonly id: string;
  readonly name: string;
  readonly companyId: string;
  readonly isRemote: boolean;
  readonly address?: string;
  readonly cityId?: string;
  readonly cityName?: string;
  readonly latitude?: number;
  readonly longitude?: number;
}

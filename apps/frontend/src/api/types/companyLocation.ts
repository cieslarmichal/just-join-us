export interface CompanyLocation {
  readonly id: string;
  readonly name: string;
  readonly companyId: string;
  readonly address: string;
  readonly cityId: string;
  readonly cityName?: string;
  readonly latitude: number;
  readonly longitude: number;
}

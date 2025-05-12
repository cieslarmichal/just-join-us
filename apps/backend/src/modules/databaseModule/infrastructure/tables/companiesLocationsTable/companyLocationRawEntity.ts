export interface CompanyLocationRawEntity {
  readonly id: string;
  readonly name: string;
  readonly company_id: string;
  readonly city_id: string;
  readonly address: string;
  readonly geolocation?: string | undefined;
  readonly latitude: number;
  readonly longitude: number;
}

export interface CompanyLocationRawEntityExtended {
  readonly id: string;
  readonly name: string;
  readonly company_id: string;
  readonly city_id: string;
  readonly city_name: string;
  readonly address: string;
  readonly geolocation?: string | undefined;
  readonly latitude: number;
  readonly longitude: number;
}

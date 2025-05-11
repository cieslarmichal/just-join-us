export interface CompanyLocationRawEntity {
  readonly id: string;
  readonly name: string;
  readonly company_id: string;
  readonly is_remote: boolean;
  readonly city_id?: string | undefined;
  readonly address?: string | undefined;
  readonly geolocation?: string | undefined;
  readonly latitude?: number | undefined;
  readonly longitude?: number | undefined;
}

export interface CompanyLocationRawEntityExtended {
  readonly id: string;
  readonly name: string;
  readonly company_id: string;
  readonly is_remote: boolean;
  readonly city_id?: string | undefined;
  readonly city_name?: string | undefined;
  readonly address?: string | undefined;
  readonly geolocation?: string | undefined;
  readonly latitude?: number | undefined;
  readonly longitude?: number | undefined;
}

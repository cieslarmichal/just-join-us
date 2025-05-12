export interface JobOfferRawEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly is_hidden: boolean;
  readonly is_remote: boolean;
  readonly category_id: string;
  readonly company_id: string;
  readonly employment_type: string;
  readonly working_time: string;
  readonly experience_level: string;
  readonly min_salary: number;
  readonly max_salary: number;
  readonly created_at: Date;
  readonly location_id?: string | undefined;
}

export interface JobOfferRawEntityExtended {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly is_hidden: boolean;
  readonly is_remote: boolean;
  readonly employment_type: string;
  readonly working_time: string;
  readonly experience_level: string;
  readonly min_salary: number;
  readonly max_salary: number;
  readonly created_at: Date;
  readonly category_id: string;
  readonly category_name: string;
  readonly company_id: string;
  readonly company_name: string;
  readonly company_logo_url: string;
  readonly location_id?: string | undefined;
  readonly city_name?: string | undefined;

  readonly skill_ids?: (string | null)[];
  readonly skill_names?: (string | null)[];
}

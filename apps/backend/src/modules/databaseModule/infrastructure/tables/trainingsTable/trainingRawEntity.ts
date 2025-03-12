export interface TrainingRawEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly is_hidden: boolean;
  readonly category_id: string;
  readonly company_id: string;
  readonly created_at: Date;
}

export interface TrainingRawEntityExtended {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly is_hidden: boolean;
  readonly created_at: Date;
  readonly category_id: string;
  readonly category_name: string;
  readonly company_id: string;
  readonly company_name: string;
  readonly company_logo_url: string;
}

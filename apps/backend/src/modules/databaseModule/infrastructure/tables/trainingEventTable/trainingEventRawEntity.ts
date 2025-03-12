export interface TrainingEventRawEntity {
  readonly id: string;
  readonly city: string;
  readonly place?: string | undefined;
  readonly geolocation?: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly training_id: string;
  readonly cent_price: number;
  readonly starts_at: Date;
  readonly ends_at: Date;
  readonly is_hidden: boolean;
  readonly created_at: Date;
}

export interface TrainingEventRawEntityExtended {
  readonly id: string;
  readonly city: string;
  readonly place?: string | undefined;
  readonly latitude: number;
  readonly longitude: number;
  readonly cent_price: number;
  readonly starts_at: Date;
  readonly ends_at: Date;
  readonly is_hidden: boolean;
  readonly created_at: Date;
  readonly training_id: string;
  readonly training_name: string;
  readonly training_description: string;
  readonly category_name: string;
  readonly company_name: string;
  readonly company_logo_url: string;
}

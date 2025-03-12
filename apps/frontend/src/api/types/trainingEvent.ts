export interface TrainingEvent {
  readonly id: string;
  readonly name: string;
  readonly companyName: string;
  readonly companyLogoUrl: string;
  readonly description: string;
  readonly category: string;
  readonly startDate: Date;
  readonly duration: string;
  readonly location: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly price: number;
}

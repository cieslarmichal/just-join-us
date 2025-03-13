export interface JobOffer {
  readonly id: string;
  readonly name: string;
  readonly companyName: string;
  readonly companyLogoUrl: string;
  readonly description: string;
  readonly category: string;
  readonly location: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly salaryMin: number;
  readonly salaryMax: number;
}

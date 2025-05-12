export interface JobOffer {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: {
    readonly name: string;
  };
  readonly categoryId: string;
  readonly isHidden: boolean;
  readonly employmentType: string;
  readonly workingTime: string;
  readonly experienceLevel: string;
  readonly minSalary: number;
  readonly maxSalary: number;
  readonly skills: { id: string; name: string }[];
  readonly locationId?: string | undefined;
  readonly location?: {
    readonly city: string;
    readonly latitude: number;
    readonly longitude: number;
  };
  readonly companyId: string;
  readonly company?: { name: string; logoUrl: string };
  readonly createdAt: Date;
}

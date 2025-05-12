import { config } from '../../config.ts';
import { JobOffer } from '../types/jobOffer.ts';

type CreateJobOfferRequest = {
  name: string;
  description: string;
  isRemote: boolean;
  categoryId: string;
  companyId: string;
  employmentType: string;
  workingTime: string;
  experienceLevel: string;
  minSalary: number;
  maxSalary: number;
  skillIds: string[];
  locationId: string;
  accessToken: string;
};

export const createJobOffer = async (request: CreateJobOfferRequest): Promise<JobOffer> => {
  const {
    name,
    description,
    isRemote,
    categoryId,
    companyId,
    employmentType,
    experienceLevel,
    locationId,
    maxSalary,
    minSalary,
    skillIds,
    workingTime,
    accessToken,
  } = request;

  const response = await fetch(`${config.backendUrl}/job-offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name,
      description,
      isRemote,
      categoryId,
      companyId,
      employmentType,
      experienceLevel,
      locationId,
      maxSalary,
      minSalary,
      skillIds,
      workingTime,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create job offer');
  }

  const data = await response.json();

  return data as JobOffer;
};

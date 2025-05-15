import { config } from '../../config.ts';
import { JobOffer } from '../types/jobOffer.ts';

type UpdateJobOfferRequest = {
  id: string;
  name?: string | undefined;
  description?: string | undefined;
  isRemote?: boolean | undefined;
  isHidden?: boolean | undefined;
  categoryId?: string | undefined;
  employmentType?: string | undefined;
  workingTime?: string | undefined;
  experienceLevel?: string | undefined;
  minSalary?: number | undefined;
  maxSalary?: number | undefined;
  skillIds?: string[] | undefined;
  locationId?: string | undefined;
  accessToken: string;
};

export const createJobOffer = async (request: UpdateJobOfferRequest): Promise<JobOffer> => {
  const { id, accessToken, ...rest } = request;

  let body = {};

  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined) {
      body = {
        ...body,
        [key]: value,
      };
    }
  }

  const response = await fetch(`${config.backendUrl}/job-offers/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to update job offer');
  }

  const data = await response.json();

  return data as JobOffer;
};

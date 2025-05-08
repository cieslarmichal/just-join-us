import { config } from '../../config.ts';
import { JobOffer } from '../types/jobOffer.ts';

type CreateJobOfferRequest = {
  name: string;
  description: string;
  categoryId: string;
  companyId: string;
  accessToken: string;
};

export const createJobOffer = async (request: CreateJobOfferRequest): Promise<JobOffer> => {
  const { name, description, categoryId, companyId, accessToken } = request;

  const response = await fetch(`${config.backendUrl}/job-offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name,
      description,
      categoryId,
      companyId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create job offer');
  }

  const data = await response.json();

  return data as JobOffer;
};

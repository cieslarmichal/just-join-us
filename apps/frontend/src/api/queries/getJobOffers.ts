import { config } from '../../config.ts';
import { JobOffer } from '../types/jobOffer.ts';

interface GetJobOffersOptions {
  readonly name?: string | undefined;
  readonly city?: string | undefined;
  readonly category?: string | undefined;
  readonly companyId?: string | undefined;
  readonly sort?: string | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export const getJobOffers = async (options: GetJobOffersOptions): Promise<JobOffer[]> => {
  const { name, city, category, companyId, page, pageSize, sort } = options;

  let url = `${config.backendUrl}/job-offers?page=${page}&pageSize=${pageSize}`;

  const params: string[] = [];

  if (category) {
    params.push(`category=${category}`);
  }

  if (companyId) {
    params.push(`companyId=${companyId}`);
  }

  if (name) {
    params.push(`name=${name}`);
  }

  if (city) {
    params.push(`city=${city}`);
  }

  if (sort) {
    params.push(`sort=${sort}`);
  }

  if (params.length > 0) {
    url += `&${params.join('&')}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get job offers');
  }

  const jsonData = await response.json();

  return jsonData.data as JobOffer[];
};

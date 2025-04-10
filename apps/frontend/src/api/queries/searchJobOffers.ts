import { config } from '../../config';
import { JobOffer } from '../types/jobOffer';

interface SearchJobOffersOptions {
  readonly name?: string | undefined;
  readonly cityId?: string | undefined;
  readonly categoryId?: string | undefined;
}

export const searchJobOffers = async (options: SearchJobOffersOptions): Promise<JobOffer[]> => {
  const { name, cityId, categoryId } = options;

  let url = `${config.backendUrl}/job-offers`;

  if (name) {
    url += `?name=${name}`;
  }

  if (cityId) {
    url += `&cityId=${cityId}`;
  }

  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }

  const response = await fetch(`${url}?pageSize=10`, {
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

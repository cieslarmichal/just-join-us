import { config } from '../../config';
import { JobOffer } from '../types/jobOffer';

export async function getJobOffer(id: string): Promise<JobOffer | null> {
  const response = await fetch(`${config.backendUrl}/job-offers/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return null;
  }

  const jsonData = await response.json();

  return jsonData as JobOffer;
}

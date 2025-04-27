import { type Params } from 'react-router-dom';
import { getJobOffer } from '../api/queries/getJobOffer';
import { JobOffer } from '../api/types/jobOffer';

export interface DetailsLoaderResult {
  readonly jobOffer: JobOffer;
}

export async function detailsLoader({ params }: { params: Params }): Promise<DetailsLoaderResult> {
  const { id } = params;

  if (!id) {
    throw new Error('Missing job offer id');
  }

  const jobOffer = await getJobOffer(id);

  if (!jobOffer) {
    throw new Error('Job offer not found');
  }

  return {
    jobOffer,
  };
}

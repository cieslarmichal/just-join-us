import { JobOffer } from '../api/types/jobOffer';
import JobOffersListItem from './JobOffersListItem';

interface Props {
  readonly jobOffers: JobOffer[];
}

export default function JobOffersList({ jobOffers }: Props) {
  const renderedResults = jobOffers.map((jobOffer) => {
    return (
      <JobOffersListItem
        key={jobOffer.id}
        jobOffer={jobOffer}
      />
    );
  });

  return (
    <div className="space-y-3 mt-1 md:mt-2 flex-1/2 mb-10">
      {renderedResults.length === 0 ? <div className="text-center">No offers</div> : renderedResults}
    </div>
  );
}

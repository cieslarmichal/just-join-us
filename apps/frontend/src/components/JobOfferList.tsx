import { JobOffer } from '../api/types/jobOffer';

interface Props {
  readonly jobOffers: JobOffer[];
}

export default function JobOfferList({ jobOffers }: Props) {
  const renderedResults = jobOffers.map((jobOffer) => {
    return <div>{jobOffer.name}</div>;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-3 mb-8 gap-x-5 gap-y-13">
      {renderedResults.length === 0 ? 'No results' : renderedResults}
    </div>
  );
}

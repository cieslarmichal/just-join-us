// import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import JobOfferDetails from '../components/JobOfferDetails.tsx';
import { DetailsLoaderResult } from './detailsLoader.ts';
import { Breadcrumbs } from '../components/ui/Breadcrumbs.tsx';

export default function DetailsPage() {
  const { jobOffer } = useLoaderData<DetailsLoaderResult>();

  // const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="sm:px-4 md:px-6 lg:px-8 mt-6 mb-8">
      <Breadcrumbs
        previousItems={[{ label: 'All offers', href: '/' }]}
        currentItem={{ label: jobOffer.name }}
      />
      <JobOfferDetails jobOffer={jobOffer} />
    </div>
  );
}

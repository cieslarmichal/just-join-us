// import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import type { DetailsLoaderResult } from './detailsLoader';
import Breadcrumbs from '../../components/Breadcrumbs';
import JobOfferDetails from '../../components/JobOfferDetails';

export default function DetailsPage() {
  const { jobOffer } = useLoaderData<DetailsLoaderResult>();

  // const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="sm:px-4 md:px-6 lg:px-8">
      <Breadcrumbs />
      <JobOfferDetails jobOffer={jobOffer} />

      <div className="md:hidden sticky bottom-0">
        <button
          className="w-full py-2.5 bg-green-800 text-white rounded-lg shadow text-sm font-medium"
          // onClick={() => setIsSignupOpen(true)}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

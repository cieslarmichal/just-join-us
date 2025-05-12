import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobOffers } from '../api/queries/getJobOffers.ts';
import { type JobOffer } from '../api/types/jobOffer.ts';
import JobOffersList from '../components/JobOffersList.tsx';
import JobOffersMap from '../components/JobOffersMap.tsx';
import SearchInput from '../components/SearchInput.tsx';
import CityFilter from '../components/CityFilter.tsx';
import SortButton from '../components/SortButton.tsx';
import Categories from '../components/Categories.tsx';

export default function SearchPage() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [searchParams] = useSearchParams();

  const fetchJobOffers = useCallback(async () => {
    try {
      const results = await getJobOffers({
        name: searchParams.get('query') || undefined,
        city: searchParams.get('city') || undefined,
        category: searchParams.get('category') || undefined,
        sort: searchParams.get('sort') || undefined,
        page: Number(searchParams.get('page')) || 1,
        pageSize: 20,
      });
      setJobOffers(results);
    } catch (error) {
      console.error('Failed to fetch job offers', error);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchJobOffers();
  }, [searchParams, fetchJobOffers]);

  return (
    <div className="sm:px-4 md:px-6">
      <div className="flex items-center my-3 md:my-5">
        <div className="flex items-center justify-center gap-4">
          <SearchInput />
          <CityFilter />
        </div>
        <Categories />
        <div className="ml-auto"></div>
      </div>

      <div className="grid grid-cols-2 mt-1 gap-4 h-full">
        <div
          className="flex flex-col max-h-dvh overflow-scroll"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex justify-between items-center sticky top-0 bg-white z-10 px-4 py-2 border-b border-gray-200">
            <h2 className="text-gray-600 font-medium text-base">{`Work: All offers - ${jobOffers.length} offers`}</h2>
            <SortButton />
          </div>
          <JobOffersList jobOffers={jobOffers} />
        </div>
        <JobOffersMap locations={[]} />
      </div>
    </div>
  );
}

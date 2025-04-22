import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobOffers } from '../../api/queries/getJobOffers';
import { type JobOffer } from '../../api/types/jobOffer';
import JobOffersList from '../../components/JobOffersList';
import JobOffersMap from '../../components/JobOffersMap';
import SearchInput from '../../components/SearchInput';
import CityFilter from '../../components/CityFilter';
import CategoryFilterButton from '../../components/CategoryFilterButton';
import SortButton from '../../components/SortButton';
import Categories from '../../components/Categories';

export default function SearchPage() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('name') || '');
  const [filters, setFilters] = useState({
    company: searchParams.get('company') || '',
    category: searchParams.get('category') || '',
    page: searchParams.get('page') || 1,
  });

  const fetchJobOffers = async () => {
    try {
      const results = await getJobOffers({});
      setJobOffers(results);
    } catch (error) {
      console.error('Failed to fetch job offers', error);
    }
  };

  useEffect(() => {
    fetchJobOffers();
  }, [filters]);

  return (
    <div className="sm:px-4 md:px-6">
      <div className="flex items-center my-3 md:my-5">
        <div className="flex items-center justify-center gap-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <CityFilter />
        </div>
        <Categories />
        <div className="ml-auto"></div>
      </div>

      <div className="grid grid-cols-2 mt-1 gap-4 h-full">
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-600 font-medium text-base">{`Work: All offers - ${jobOffers.length} offers`}</h2>
            <SortButton />
          </div>
          <JobOffersList jobOffers={jobOffers} />
        </div>
        <JobOffersMap />
      </div>
    </div>
  );
}

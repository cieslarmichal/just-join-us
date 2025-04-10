import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchJobOffers } from '../../api/queries/searchJobOffers';
import { type JobOffer } from '../../api/types/jobOffer';
import JobOffersList from '../../components/JobOffersList';
import JobOffersMap from '../../components/JobOffersMap';
import SearchInput from '../../components/SearchInput';
import LocationFilter from '../../components/CityFilter';
import CategoryFilterButton from '../../components/CategoryFilterButton';
import SortButton from '../../components/SortButton';

export default function SearchPage() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('name') || '');
  const [filters, setFilters] = useState({
    company: searchParams.get('company') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    page: searchParams.get('page') || 1,
  });

  const fetchJobOffers = async () => {
    try {
      const results = await searchJobOffers({});
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
          <LocationFilter
            initialCity={filters.city}
            setCity={(city) => setFilters({ ...filters, city })}
          />
        </div>
        <div className="flex items-center justify-center gap-4 ml-4">
          <div className="flex flex-wrap gap-2">
            <CategoryFilterButton
              category="JS"
              color="text-blue-500"
            />
            <CategoryFilterButton
              category="Python"
              color="text-red-500"
            />
            <CategoryFilterButton
              category="Java"
              color="text-orange-500"
            />
            <CategoryFilterButton
              category="AI/ML"
              color="text-green-500"
            />
            <CategoryFilterButton
              category="Data"
              color="text-purple-500"
            />
            <CategoryFilterButton
              category="Game"
              color="text-teal-500"
            />
          </div>
        </div>
        <div className="ml-auto"></div>
      </div>

      <div className="grid grid-cols-2 mt-1 gap-4 h-full">
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-600 font-medium text-base">Work: All offers - 133 offers</h2>
            <SortButton />
          </div>
          <JobOffersList jobOffers={jobOffers} />
        </div>
        <JobOffersMap />
      </div>
    </div>
  );
}

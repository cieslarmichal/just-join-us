import { useEffect, useState } from 'react';
import { VscSearch } from 'react-icons/vsc';
import { useSearchParams } from 'react-router-dom';
import { searchLocations } from '../../api/queries/searchLocations';
import { searchJobOffers } from '../../api/queries/searchJobOffers';
import { type Location } from '../../api/types/location';
import { type JobOffer } from '../../api/types/jobOffer';
import JobOfferItem from '../../components/JobOfferItem';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '../../components/ui/input';
import { IoIosArrowDown } from 'react-icons/io';
import { MdComputer } from 'react-icons/md';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CiLocationOn } from 'react-icons/ci';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MapPicker from '../../components/MapPicker';

export default function SearchPage() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('name') || '');
  const [filters, setFilters] = useState({
    company: searchParams.get('company') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    radius: searchParams.get('location') || '',
    page: searchParams.get('page') || 1,
  });

  const debouncedLocation = useDebounce(filters.location, 500);

  const fetchTrainings = async () => {
    try {
      const results = await searchJobOffers(searchQuery || '');
      setJobOffers(results);
    } catch (error) {
      console.error('Failed to fetch job offers', error);
    }
  };

  const fetchLocations = async () => {
    if (debouncedLocation === '') {
      setLocations([]);
      return;
    }

    try {
      const results = await searchLocations(debouncedLocation);
      setLocations(results);
    } catch (error) {
      console.error('Failed to fetch locations', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [debouncedLocation]);

  useEffect(() => {
    fetchTrainings();
  }, [filters]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const renderedResults = jobOffers.map((jobOffer) => {
    return (
      <JobOfferItem
        key={jobOffer.id}
        jobOffer={jobOffer}
      />
    );
  });

  return (
    <div className="sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center my-3 md:my-5">
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 flex items-center pl-3">
              <VscSearch className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search job offer..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              className="pl-12 h-12 w-120 border border-gray-300 hover:border-gray-400 rounded-3xl"
            />
          </div>
          <Popover>
            <PopoverTrigger>
              <div className="h-12 flex items-center gap-2 border border-gray-300 hover:border-gray-400 rounded-3xl px-4 py-2">
                <CiLocationOn className="w-5 h-5" />
                Location
                <IoIosArrowDown className="w-5 h-5" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-wrap gap-8 mb-4">
                <div className="flex flex-col relative">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium text-gray-700 pb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Location"
                  />
                  {locations.length > 0 && (
                    <div className="absolute z-10 top-[calc(100%-0.5rem)] bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                      {locations.map((location) => (
                        <div
                          key={location.id}
                          className="p-1 text-sm cursor-pointer hover:bg-gray-200"
                          onClick={() => {
                            setFilters({
                              ...filters,
                              location: location.name,
                            });
                            setLocations([]);
                          }}
                        >
                          {location.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-center gap-4 ml-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <MdComputer className="w-6 h-6 text-blue-500" />
              <div className="text-sm">JS</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <MdComputer className="w-6 h-6 text-red-500" />
              <div className="text-sm">Python</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <MdComputer className="w-6 h-6 text-orange-500" />
              <div className="text-sm">Java</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <MdComputer className="w-6 h-6 text-green-500" />
              <div className="text-sm">AI/ML</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <MdComputer className="w-6 h-6 text-purple-500" />
              <div className="text-sm">Data</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <MdComputer className="w-6 h-6 text-teal-500" />
              <div className="text-sm">Game</div>
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 rounded-3xl px-4 py-2">
                <span>Sort</span>
                <IoIosArrowDown className="w-5 h-5" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="option-one"
                    id="option-one"
                  />
                  <Label htmlFor="option-one">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="option-two"
                    id="option-two"
                  />
                  <Label htmlFor="option-two">Option Two</Label>
                </div>
              </RadioGroup>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <h2>Jobs: 133 offers</h2>
      <div className="flex items-center justify-between mt-3">
        <div className="space-y-1 md:space-y-1.5 mt-1 md:mt-2 flex-1/2">
          {renderedResults.length === 0 ? 'No offers' : renderedResults}
        </div>
        <div className="flex-1/2">
          <MapPicker
            latitude={52.231641}
            longitude={21.00618}
            readOnly
            zoom={10}
          />
        </div>
      </div>
    </div>
  );
}

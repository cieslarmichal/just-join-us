import { useEffect, useState } from 'react';
import { VscSearch } from 'react-icons/vsc';
import { useSearchParams } from 'react-router-dom';
import { searchLocations } from '../../api/queries/searchLocations';
import { searchTrainingEvents } from '../../api/queries/searchTrainingEvents';
import { type Location } from '../../api/types/location';
import { type TrainingEvent } from '../../api/types/trainingEvent';
import TrainingEventItem from '../../components/TrainingEventItem';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '../../components/ui/input';
import { AiOutlineMedicineBox } from 'react-icons/ai';
import { GiBoxingGlove, GiDeliveryDrone, GiPistolGun } from 'react-icons/gi';
import { IoIosArrowDown, IoMdBonfire } from 'react-icons/io';
import { MdComputer } from 'react-icons/md';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CiLocationOn } from 'react-icons/ci';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SearchPage() {
  const [trainingsEvents, setTrainingEvents] = useState<TrainingEvent[]>([]);
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

  const areFiltersModified = () => {
    return filters.company !== '' || filters.category !== '' || filters.location !== '' || filters.radius !== '';
  };

  const fetchTrainings = async () => {
    try {
      const results = await searchTrainingEvents(searchQuery || '');
      setTrainingEvents(results);
    } catch (error) {
      console.error('Failed to fetch training events', error);
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

  const renderedResults = trainingsEvents.map((trainingEvent) => {
    return (
      <TrainingEventItem
        key={trainingEvent.id}
        trainingEvent={trainingEvent}
      />
    );
  });

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      company: '',
      category: '',
      location: '',
      radius: '',
      page: 1,
    });
  };

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
              placeholder="Wyszukaj szkolenie..."
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
                Lokalizacja
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
                    Lokalizacja
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Lokalizacja"
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

                <div className="flex flex-col">
                  <label
                    htmlFor="radius"
                    className="text-sm font-medium text-gray-700 pb-1"
                  >
                    Promień od lokalizacji
                  </label>
                  <select
                    id="radius"
                    name="radius"
                    value={filters.radius}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md p-2 bg-white text-gray-700"
                    disabled={filters.location === ''}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      hidden
                    >
                      Wybierz promień
                    </option>
                    <option value="50">50 km</option>
                    <option value="100">100 km</option>
                    <option value="200">200 km</option>
                    <option value="300">300 km</option>
                    <option value="400">400 km</option>
                    <option value="500">500 km</option>
                    <option value="600">600 km</option>
                  </select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-center gap-4 ml-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <AiOutlineMedicineBox className="w-6 h-6 text-blue-500" />
              <div className="text-sm">Medycyna</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <GiPistolGun className="w-6 h-6 text-red-500" />
              <div className="text-sm">Strzelectwo</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <IoMdBonfire className="w-6 h-6 text-orange-500" />
              <div className="text-sm">Przetrwanie</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <GiBoxingGlove className="w-6 h-6 text-green-500" />
              <div className="text-sm">Samoobrona</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <GiDeliveryDrone className="w-6 h-6 text-purple-500" />
              <div className="text-sm">Drony</div>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
              <MdComputer className="w-6 h-6 text-teal-500" />
              <div className="text-sm">Cyberbezpieczeństwo</div>
            </div>
          </div>
        </div>
        <div className="ml-auto">
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 rounded-3xl px-4 py-2">
                <span>Sortuj</span>
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

      <h2>Szkolenia: 233 ofert</h2>
      <div className="space-y-1 md:space-y-1.5 mt-1 md:mt-2">
        {renderedResults.length === 0 ? 'Brak szkoleń' : renderedResults}
      </div>
    </div>
  );
}

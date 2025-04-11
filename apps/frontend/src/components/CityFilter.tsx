import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { IoIosArrowDown } from 'react-icons/io';
import { searchCities } from '../api/queries/searchCities';
import { useDebounce } from '../hooks/useDebounce';
import { City } from '../api/types/city';
import { useSearchParams } from 'react-router-dom';
import { IoCloseCircleOutline } from 'react-icons/io5';

export default function CityFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  // TODO: add slug to backend and translate back to name
  const [city, setCity] = useState<string>(searchParams.get('city') || '');

  const [suggestedCities, setSuggestedCities] = useState<City[]>([]);

  const [suggestionSelected, setSuggestionSelected] = useState<boolean>(city !== '');

  const debouncedCity = useDebounce(city, 500);

  const fetchSuggestedCities = async () => {
    if (debouncedCity === '' || city === '') {
      setSuggestedCities([]);
      return;
    }

    try {
      const results = await searchCities(debouncedCity);
      setSuggestedCities(results);
    } catch (error) {
      console.error('Failed to fetch suggested cities', error);
    }
  };

  useEffect(() => {
    if (suggestionSelected) {
      return;
    }

    fetchSuggestedCities();
  }, [debouncedCity, suggestionSelected]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = event.target;

    setCity(value);

    setSuggestionSelected(false);
  };

  const handleApplyClick = () => {
    setSearchParams((currentSearchParams) => ({
      ...currentSearchParams,
      city,
    }));
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="h-10 flex items-center gap-2 border border-gray-300 hover:border-gray-500 rounded-3xl px-8 py-2 cursor-pointer text-sm font-semibold">
          <CiLocationOn className="w-5 h-5" />
          Location
          {/* add arrow up when popover selected */}
          <IoIosArrowDown className="w-4 h-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="border border-gray-300 rounded-lg px-10 py-6 bg-white shadow-md w-full mt-2 translate-x-[33%] z-[1]">
        <div className="flex flex-col relative w-full">
          <div className="text-xl font-semibold text-gray-500">Location</div>
          <div className="flex flex-col gap-y-4 mt-6">
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={city}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-md p-3 w-full text-sm"
                placeholder="Where do you want to work?"
              />
              <IoCloseCircleOutline
                className="absolute right-4 top-2.5 w-6 h-6 cursor-pointer text-gray-800"
                onClick={() => {
                  setCity('');
                  setSuggestedCities([]);
                  setSuggestionSelected(false);
                }}
              />
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Most Popular Cities</h3>
              <div className="flex flex-wrap gap-2">
                {['Warszawa', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań', 'Łódź'].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-full cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setCity(city);
                      setSuggestedCities([]);
                      setSuggestionSelected(true);
                    }}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {suggestedCities.length > 0 && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-11 w-full max-h-40 overflow-y-auto">
                {suggestedCities.map((city) => (
                  <div
                    key={city.id}
                    className="p-2 text-sm cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setCity(city.name);
                      setSuggestedCities([]);
                      setSuggestionSelected(true);
                    }}
                  >
                    {city.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="bg-pink-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-pink-600 mt-4 cursor-pointer"
            onClick={handleApplyClick}
          >
            Show Offers
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

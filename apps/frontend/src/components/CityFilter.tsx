import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { IoIosArrowDown } from 'react-icons/io';
import { searchCities } from '../api/queries/searchCities';
import { useDebounce } from '../hooks/useDebounce';
import { City } from '../api/types/city';

interface Props {
  readonly initialCity: string;
  readonly setCity: (location: string) => void;
}

export default function LocationFilter({ initialCity, setCity }: Props) {
  const [cities, setCities] = useState<City[]>([]);

  const debouncedCity = useDebounce(initialCity, 500);

  const fetchCities = async () => {
    if (debouncedCity === '') {
      setCities([]);
      return;
    }

    try {
      const results = await searchCities(debouncedCity);
      setCities(results);
    } catch (error) {
      console.error('Failed to fetch cities', error);
    }
  };

  console.log({ debouncedCity });

  useEffect(() => {
    fetchCities();
  }, [debouncedCity]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = event.target;

    setCity(value);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="h-10 flex items-center gap-2 border border-gray-300 hover:border-gray-500 rounded-3xl px-8 py-2 cursor-pointer text-sm font-semibold">
          <CiLocationOn className="w-5 h-5" />
          Location
          <IoIosArrowDown className="w-4 h-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="border border-gray-300 rounded-lg px-10 py-6 bg-white shadow-md w-full mt-2 translate-x-[33%] z-[1]">
        <div className="flex flex-col relative w-full">
          <div className="text-xl font-semibold text-gray-500">Location</div>
          <div className="flex flex-col gap-y-4 mt-6">
            <input
              type="text"
              id="location"
              name="location"
              value={initialCity}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md p-3 w-full text-sm"
              placeholder="Where do you want to work?"
            />

            {/* Most Popular Cities Section */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Most Popular Cities</h3>
              <div className="flex flex-wrap gap-2">
                {['Warszawa', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań', 'Łódź'].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-full cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setCity(city);
                      setCities([]);
                    }}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Dropdown for City Search Results */}
            {cities.length > 0 && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-11 w-full max-h-40 overflow-y-auto">
                {cities.map((city) => (
                  <div
                    key={city.id}
                    className="p-2 text-sm cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setCity(city.name);
                      setCities([]);
                    }}
                  >
                    {city.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Show Offers Button */}
          <button
            className="bg-pink-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-pink-600 mt-4"
            onClick={() => {
              console.log('Show Offers clicked');
            }}
          >
            Show Offers
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

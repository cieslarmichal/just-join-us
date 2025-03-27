import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { IoIosArrowDown } from 'react-icons/io';
import { searchLocations } from '../api/queries/searchLocations';
import { useDebounce } from '../hooks/useDebounce';
import { Location } from '../api/types/location';

interface Props {
  readonly initialLocation: string;
  readonly setLocation: (location: string) => void;
}

export default function LocationFilter({ initialLocation, setLocation }: Props) {
  const [locations, setLocations] = useState<Location[]>([]);

  const debouncedLocation = useDebounce(initialLocation, 500);

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

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = event.target;

    setLocation(value);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="h-12 flex items-center gap-2 border border-gray-300 hover:border-gray-500 rounded-3xl px-4 py-2 cursor-pointer">
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
              value={initialLocation}
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
                      setLocation(location.name);
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
  );
}

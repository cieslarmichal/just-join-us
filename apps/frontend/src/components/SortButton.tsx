import { useEffect, useMemo, useRef, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useSearchParams } from 'react-router-dom';

type SortOption = {
  value: string;
  label: string;
};

const sortOptions: SortOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'latest', label: 'Latest' },
  { value: 'highestSalary', label: 'Highest salary' },
  { value: 'lowestSalary', label: 'Lowest salary' },
];

export default function SortButton() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsSort = searchParams.get('sort');
  const activeSort =
    useMemo(() => sortOptions.find((sortOption) => sortOption.value === searchParamsSort), [searchParamsSort]) ||
    sortOptions[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: SortOption) => {
    if (option.value === 'default') {
      searchParams.delete('sort');
    } else {
      searchParams.set('sort', option.value);
    }

    setSearchParams(searchParams);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <div
        className="flex select-none items-center gap-2 px-4 py-2 cursor-pointer rounded-md hover:bg-gray-100"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <span className="text-sm font-semibold select-none">{activeSort.label}</span>
        {isDropdownOpen ? <IoIosArrowUp className="w-4 h-4" /> : <IoIosArrowDown className="w-4 h-4" />}
      </div>

      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-md rounded-md border border-gray-300">
          {sortOptions.map((option) => (
            <li
              key={option.value}
              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleOptionClick(option)}
            >
              <span
                className={`${activeSort.value === option.value ? 'text-pink-600' : 'text-gray-500'} text-sm font-medium`}
              >
                {option.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

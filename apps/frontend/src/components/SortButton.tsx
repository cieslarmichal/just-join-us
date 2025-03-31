import { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

export default function SortButton() {
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'default', label: 'Default' },
    { value: 'latest', label: 'Latest' },
    { value: 'highestSalary', label: 'Highest salary' },
    { value: 'lowestSalary', label: 'Lowest salary' },
  ];

  const handleOptionClick = (optionNumber: number) => {
    setSelectedOption(optionNumber);
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
        <span className="text-sm">{options[selectedOption].label}</span>
        {isDropdownOpen ? <IoIosArrowUp className="w-4 h-4" /> : <IoIosArrowDown className="w-4 h-4" />}
      </div>

      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-md rounded-md border border-gray-300">
          {options.map((option, index) => (
            <li
              key={option.value}
              className="flex items-center justify-between select-none px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(index)}
            >
              <span className={`${selectedOption === index ? 'text-pink-600' : ''}`}>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

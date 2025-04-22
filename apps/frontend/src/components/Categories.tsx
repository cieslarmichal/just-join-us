import { useEffect, useMemo, useState, useRef } from 'react';
import CategoryFilterButton from './CategoryFilterButton';
import { getCategories } from '../api/queries/getCategories';
import { Category } from '../api/types/category';
import { useSearchParams } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsCategory = searchParams.get('category');
  const activeCategory = useMemo(
    () => categories.find((category) => category.id === searchParamsCategory),
    [categories, searchParamsCategory],
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchCategories = async () => {
    try {
      const results = await getCategories();
      setCategories(results);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderedCategories = categories.map((category) => (
    <CategoryFilterButton
      key={category.id}
      category={category.name}
      color={activeCategory?.id === category.id ? 'bg-blue-500' : 'bg-gray-200'}
      onClick={() => {
        if (activeCategory?.id === category.id) {
          searchParams.delete('category');
        } else {
          searchParams.set('category', category.id);
        }
        setSearchParams(searchParams);
      }}
      isActive={activeCategory?.id === category.id}
    />
  ));

  return (
    <div className="relative mx-auto w-[calc(100%-430px)]">
      {/* Horizontal Scrolling Container */}
      <div
        className="flex overflow-x-hidden gap-4 px-4 py-2"
        style={{ scrollBehavior: 'smooth' }}
        ref={scrollContainerRef} // Attach the ref here
      >
        {renderedCategories}
      </div>

      {/* Left Navigation Button */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
        onClick={() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.offsetWidth; // Scroll by the width of the container
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          }
        }}
      >
        &lt;
      </button>

      {/* Right Navigation Button */}
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300"
        onClick={() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.offsetWidth; // Scroll by the width of the container
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }}
      >
        &gt;
      </button>
    </div>
  );
}

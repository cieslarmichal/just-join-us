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
    () => categories.find((category) => category.slug === searchParamsCategory),
    [categories, searchParamsCategory],
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLeftButtonVisible, setIsLeftButtonVisible] = useState(false);
  const [isRightButtonVisible, setIsRightButtonVisible] = useState(false);

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

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      console.log({ left: scrollContainerRef.current.scrollLeft });
      console.log({ width: scrollContainerRef.current.clientWidth });
      console.log({ scrollWidth: scrollContainerRef.current.scrollWidth });
      const container = scrollContainerRef.current;
      setIsLeftButtonVisible(container.scrollLeft > 0); // Show left button only if scrolled
      setIsRightButtonVisible(container.scrollLeft + container.clientWidth < container.scrollWidth - 5); // Show right button only if not at the end
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      handleScroll(); // Initialize button visibility
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const renderedCategories = categories.map((category) => (
    <CategoryFilterButton
      key={category.slug}
      category={category.name}
      onClick={() => {
        if (activeCategory?.slug === category.slug) {
          searchParams.delete('category');
        } else {
          searchParams.set('category', category.slug);
        }
        setSearchParams(searchParams);
      }}
      isActive={activeCategory?.slug === category.slug}
    />
  ));

  return (
    <div className="relative w-[calc(100%-490px)] ml-10">
      <div
        className="flex overflow-x-hidden gap-3 py-2"
        style={{ scrollBehavior: 'smooth' }}
        ref={scrollContainerRef}
      >
        {renderedCategories}
      </div>

      {isLeftButtonVisible && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-7 bg-gray-200 px-1.5 py-0.5 rounded-full shadow-md hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if (scrollContainerRef.current) {
              const container = scrollContainerRef.current;
              const scrollAmount = container.offsetWidth / 2;
              container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
          }}
        >
          &lt;
        </button>
      )}

      {isRightButtonVisible && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8 bg-gray-200 px-1.5 py-0.5 rounded-full shadow-md hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if (scrollContainerRef.current) {
              const container = scrollContainerRef.current;
              const scrollAmount = container.offsetWidth / 2;
              container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
          }}
        >
          &gt;
        </button>
      )}
    </div>
  );
}

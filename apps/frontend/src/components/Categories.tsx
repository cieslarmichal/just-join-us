import { useEffect, useMemo, useState, useRef } from 'react';
import CategoryFilterButton from './CategoryFilterButton';
import { getCategories } from '../api/queries/getCategories';
import { Category } from '../api/types/category';
import { useSearchParams } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

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
      setIsLeftButtonVisible(container.scrollLeft > 0);
      setIsRightButtonVisible(container.scrollLeft + container.clientWidth <= container.scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const timeout = setTimeout(() => {
        handleScroll();
        container.addEventListener('scroll', handleScroll);
      }, 0);

      return () => {
        clearTimeout(timeout);
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [categories]);

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
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-7 bg-gray-200 px-1 py-1 rounded-full shadow-md hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if (scrollContainerRef.current) {
              const container = scrollContainerRef.current;
              const scrollAmount = container.offsetWidth / 2;
              container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
          }}
        >
          <MdOutlineKeyboardArrowLeft className="size-5" />
        </button>
      )}

      {isRightButtonVisible && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8 bg-gray-200 px-1 py-1 rounded-full shadow-md hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if (scrollContainerRef.current) {
              const container = scrollContainerRef.current;
              const scrollAmount = container.offsetWidth / 2;
              container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
          }}
        >
          <MdOutlineKeyboardArrowRight className="size-5" />
        </button>
      )}
    </div>
  );
}

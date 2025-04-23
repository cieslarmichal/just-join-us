import { VscSearch } from 'react-icons/vsc';
import { Input } from './ui/Input';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsQuery = searchParams.get('query');
  const [queryInput, setQueryInput] = useState<string>(searchParamsQuery || '');

  const handleQueryApply = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const query = event.currentTarget.value.trim();

    if (query === '') {
      setSearchParams((currentSearchParams) => {
        currentSearchParams.delete('query');
        return new URLSearchParams(currentSearchParams);
      });

      return;
    }

    setSearchParams((currentSearchParams) => ({
      ...currentSearchParams,
      query,
    }));
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 flex items-center pl-3">
        <VscSearch className="h-5 w-5" />
      </div>
      <Input
        type="text"
        placeholder="Search"
        value={queryInput}
        onChange={(event) => {
          setQueryInput(event.target.value);
        }}
        onSubmit={handleQueryApply}
        className="pl-12 h-10 w-50 border border-gray-300 hover:border-gray-500 rounded-3xl"
      />
    </div>
  );
}

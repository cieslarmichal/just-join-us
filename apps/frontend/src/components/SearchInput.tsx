import { VscSearch } from 'react-icons/vsc';
import { Input } from './ui/Input';

interface Props {
  readonly searchQuery: string;
  readonly setSearchQuery: (searchQuery: string) => void;
}

export default function SearchInput({ searchQuery, setSearchQuery }: Props) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 flex items-center pl-3">
        <VscSearch className="h-5 w-5" />
      </div>
      <Input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.target.value);
        }}
        className="pl-12 h-10 w-50 border border-gray-300 hover:border-gray-500 rounded-3xl"
      />
    </div>
  );
}

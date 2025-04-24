import { MdComputer } from 'react-icons/md';

interface Props {
  readonly category: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export default function CategoryFilterButton({ category, onClick, isActive }: Props) {
  return (
    <div
      className={`flex items-center justify-center gap-2 px-3 py-1 rounded-full cursor-pointer ${isActive ? ' text-white border-1 bg-pink-600 hover:bg-pink-700' : 'border hover:bg-gray-100 border-gray-300 bg-white shadow-md'} ${category}`}
      onClick={onClick}
    >
      <MdComputer className={'w-5 h-5'} />
      <div className="text-sm font-medium">{category}</div>
    </div>
  );
}

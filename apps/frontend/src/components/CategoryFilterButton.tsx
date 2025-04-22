import { MdComputer } from 'react-icons/md';

interface Props {
  readonly category: string;
  readonly color: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export default function CategoryFilterButton({ category, onClick, isActive }: Props) {
  return (
    <div
      className={`flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white hover:bg-gray-100 cursor-pointer ${isActive ? 'border-1 border-pink-600' : 'border border-gray-300 shadow-md'} ${category}`}
      onClick={onClick}
    >
      <MdComputer className={'w-6 h-6'} />
      <div className="text-sm">{category}</div>
    </div>
  );
}

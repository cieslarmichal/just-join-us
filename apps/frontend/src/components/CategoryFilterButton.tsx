import { MdComputer } from 'react-icons/md';

interface Props {
  readonly category: string;
  readonly color: string;
}

export default function CategoryFilterButton({ category, color }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100 cursor-pointer">
      <MdComputer className={`w-6 h-6 ${color}`} />
      <div className="text-sm">{category}</div>
    </div>
  );
}

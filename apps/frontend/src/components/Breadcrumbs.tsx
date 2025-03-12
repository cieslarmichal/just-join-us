import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  return (
    <nav className="mb-4 mt-4 text-sm">
      <Link
        to="/"
        className="hover:underline"
      >
        <div className="inline-flex items-center gap-1">
          <IoIosArrowBack />
          Wróć do wyszukiwarki szkoleń
        </div>
      </Link>
    </nav>
  );
};

export default Breadcrumbs;

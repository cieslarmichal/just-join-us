import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="px-4 sm:px-6 lg:px-10 flex justify-between items-center h-18">
        <div className="text-sm">
          Just Join Us &copy; {new Date().getFullYear()} - All Rights Reserved - Production:{' '}
          <strong>Michał Cieślar</strong>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/about"
            className="hover:underline"
          >
            O nas
          </Link>
          <Link
            to="/contact"
            className="hover:underline"
          >
            Kontakt
          </Link>
          <Link
            to="/privacy"
            className="hover:underline"
          >
            Polityka prywatności
          </Link>
        </div>
      </div>
    </footer>
  );
}

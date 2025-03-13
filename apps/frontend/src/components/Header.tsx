import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const navItems = [
  { name: 'Job Offers', href: '/' },
  { name: 'About us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-background shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-18">
          <Link
            to="/"
            className="font-bold text-xl"
          >
            <a>justjoin.us</a>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="hover:bg-gray-100 px-3 py-2 rounded-lg"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <Button
              className="px-3 sm:px-6 rounded-lg whitespace-nowrap font-medium bg-white text-black hover:bg-gray-100"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
            <Button
              className="px-3 sm:px-6 rounded-lg whitespace-nowrap bg-orange-700 font-medium"
              onClick={() => navigate('/register')}
            >
              Sing up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

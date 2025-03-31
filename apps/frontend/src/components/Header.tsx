import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { name: 'Job Offers', href: '/' },
  { name: 'About us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const { userData } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <header className="bg-background shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex gap-2 items-center">
            <Link
              to="/"
              className="font-bold text-2xl"
            >
              justjoin.us
            </Link>
            <div className="text-xs text-gray-500 mt-1">#1 Job Board for tech industry in Poland</div>
          </div>

          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="hover:bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-600 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            {userData ? (
              <>
                <Button
                  className="px-3 sm:px-6 rounded-lg whitespace-nowrap font-medium bg-white text-black hover:bg-gray-100"
                  onClick={() => navigate('/profiles/id')}
                >
                  My profile
                </Button>
                <Button
                  className="px-3 sm:px-6 rounded-lg whitespace-nowrap font-medium bg-white text-black hover:bg-gray-100"
                  onClick={() => navigate('/logout')}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="px-3 sm:px-6 rounded-lg whitespace-nowrap font-medium bg-white text-black hover:bg-gray-100"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
                <Button
                  className="px-3 sm:px-6 rounded-lg whitespace-nowrap bg-pink-600 font-medium"
                  onClick={() => navigate('/register')}
                >
                  Sing up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

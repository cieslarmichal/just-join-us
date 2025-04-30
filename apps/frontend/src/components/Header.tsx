import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserRole } from '../api/types/userRole';

const navItems = [
  { name: 'Job Offers', href: '/' },
  { name: 'About us', href: '/about' },
];

const userProfiles: Record<UserRole, { url: string; label: string }> = {
  candidate: {
    url: '/candidates/:id',
    label: 'My profile',
  },
  company: {
    url: '/companies/:id',
    label: 'My company',
  },
  admin: {
    url: '/profiles/admin',
    label: 'Admin panel',
  },
};

export default function Header() {
  const { userData, userDataInitialized } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const renderedAuthSection = !userDataInitialized ? null : userData ? (
    <>
      <Link
        className="hover:bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700 font-medium mr-2"
        to={userProfiles[userData.role].url.replace(':id', userData.id)}
      >
        {userProfiles[userData.role].label}
      </Link>
      <Link
        className="hover:bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700 font-medium"
        to={'/logout'}
      >
        Logout
      </Link>
    </>
  ) : (
    <>
      <Link
        className="hover:bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700 font-medium mr-2"
        to={'/login?tab=login'}
      >
        Sign in
      </Link>

      <Button
        className="px-3 sm:px-6 rounded-lg whitespace-nowrap bg-pink-600 font-medium"
        onClick={() => navigate('/login?tab=register')}
      >
        Sign up
      </Button>
    </>
  );

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
            <nav className="hidden md:flex items-center space-x-4 mr-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === item.href ? 'text-pink-600' : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="w-[2px] h-6 bg-pink-500/20 mx-2" />

            <div
              className="flex items-center"
              style={{ width: '175px' }}
            >
              {renderedAuthSection}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

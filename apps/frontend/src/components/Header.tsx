import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from './ui/Menubar';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Job offers', href: '/' },
  { name: 'About us', href: '/about' },
];

const userProfiles: Record<string, { url: string; label: string }> = {
  candidate: {
    url: '/candidates/:id',
    label: 'My profile',
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

  const linkClasses =
    '[&.active]:font-extrabold hover:text-primary [&.active]:text-primary underline-offset-8 decoration-[3px] text-nowrap';

  const renderedAuthSection = !userDataInitialized ? null : userData ? (
    <>
      {userData.role === 'company' ? (
        <Menubar className="rounded-none space-x-0 border-none data-[state=open]:!bg-none">
          <MenubarMenu>
            <MenubarTrigger
              omitOpenBg
              className={cn(linkClasses, 'text-gray-700')}
            >
              <Link
                to={'/my-company'}
                className={cn(
                  linkClasses,
                  location.pathname.includes('/my-company') ? 'text-pink-600' : 'text-gray-700',
                )}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                My company
              </Link>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => {
                  navigate('/my-company/job-offers');
                }}
                className="pt-2 hover:text-primary"
              >
                Job offers
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  navigate('/my-company/locations');
                }}
                className="pt-2 hover:text-primary"
              >
                Locations
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => {
                  navigate('/my-company');
                }}
                className="pt-2 hover:text-primary"
              >
                Details
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ) : (
        <>
          <Link
            className={cn(
              'hover:bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700 font-medium',
              location.pathname === userProfiles[userData.role].url ? 'text-pink-600' : 'text-gray-700',
            )}
            to={userProfiles[userData.role].url}
          >
            {userProfiles[userData.role].label}
          </Link>
        </>
      )}
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

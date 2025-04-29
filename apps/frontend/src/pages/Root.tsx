import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { Toaster } from '../components/ui/Sonner';

export default function Root() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="w-full flex-[1]">
        <Outlet />
        <Toaster />
      </div>
      <Footer />
    </div>
  );
}

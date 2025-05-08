import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DetailsPage from './pages/DetailsPage';
import Root from './pages/Root';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './auth/privateRoute';
import LogoutPage from './pages/LogoutPage';
import { StrictMode } from 'react';
import { AuthContextProvider } from './context/AuthContextProvider';
import { CookiesProvider } from 'react-cookie';
import { detailsLoader } from './pages/detailsLoader';
import NewPasswordPage from './pages/NewPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AboutPage from './pages/AboutPage';
import CandidatePage from './components/CandidatePage';
import CompanyPage from './pages/CompanyPage';
import CompanyJobOffersPage from './pages/CompanyJobOffersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <SearchPage />,
      },
      {
        path: '/job-offers/:id',
        element: <DetailsPage />,
        loader: detailsLoader,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/new-password',
        element: <NewPasswordPage />,
      },
      {
        path: '/verify-email',
        element: <VerifyEmailPage />,
      },
      {
        path: '/logout',
        element: (
          <PrivateRoute>
            <LogoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/my-profile',
        element: <CandidatePage />,
      },
      {
        path: '/my-company',
        element: <CompanyPage />,
      },
      {
        path: '/my-company/job-offers',
        element: <CompanyJobOffersPage />,
      },
    ],
  },
]);

function App() {
  return (
    <StrictMode>
      <CookiesProvider>
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </CookiesProvider>
    </StrictMode>
  );
}

export default App;

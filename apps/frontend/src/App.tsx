import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { detailsLoader } from './pages/details/detailsLoader';
import DetailsPage from './pages/details/DetailsPage';
import Root from './pages/Root';
import SearchPage from './pages/search/SearchPage';
import RegisterPage from './pages/register/RegisterPage';
import LoginPage from './pages/login/LoginPage';
import PrivateRoute from './auth/privateRoute';
import LogoutPage from './pages/logout/LogoutPage';
import { StrictMode } from 'react';
import { AuthContextProvider } from './context/AuthContextProvider';
import { CookiesProvider } from 'react-cookie';

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
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/logout',
        element: (
          <PrivateRoute>
            <LogoutPage />
          </PrivateRoute>
        ),
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

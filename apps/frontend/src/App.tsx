import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { detailsLoader } from './pages/details/detailsLoader';
import DetailsPage from './pages/details/detailsPage';
import Root from './pages/Root';
import SearchPage from './pages/search/searchPage';
import RegisterPage from './pages/register/registerPage';
import LoginPage from './pages/login/loginPage';
import PrivateRoute from './auth/privateRoute';
import LogoutPage from './pages/logout/logoutPage';

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
        path: '/trainings/:id',
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
  return <RouterProvider router={router} />;
}

export default App;

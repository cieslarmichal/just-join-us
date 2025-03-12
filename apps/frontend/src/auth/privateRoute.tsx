import { useContext } from 'react';
import { AuthContext } from '../context/authContext.tsx';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { userData } = useContext(AuthContext);

  const location = useLocation();

  if (!userData) {
    <Navigate
      to="/login"
      state={{ from: location }}
    />;

    return;
  }

  return <>{children}</>;
}

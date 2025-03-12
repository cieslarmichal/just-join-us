import { useContext } from 'react';
import { AuthContext } from '../context/authContext.tsx';
import { Navigate, useLocation } from 'react-router-dom';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { userData } = useContext(AuthContext);

  const location = useLocation();

  if (!userData || !userData.role || userData.role !== 'admin') {
    <Navigate
      to="/login"
      state={{ from: location }}
    />;

    return;
  }

  return <>{children}</>;
}

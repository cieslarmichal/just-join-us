import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

export default function LogoutPage() {
  const navigate = useNavigate();

  const { clearUserData } = useContext(AuthContext);

  useEffect(() => {
    clearUserData();

    navigate('/');
  }, [clearUserData, navigate]);

  return <div>Logging out...</div>;
}

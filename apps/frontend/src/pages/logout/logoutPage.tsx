import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutPage() {
  const navigate = useNavigate();

  const { updateUserData } = useContext(AuthContext);

  useEffect(() => {
    updateUserData(null);

    navigate('/');
  }, [updateUserData, navigate]);

  return <div>Wylogowanie...</div>;
}

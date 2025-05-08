import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userRoles } from '../api/types/userRole';

export default function CompanyPage() {
  const { userData } = useContext(AuthContext);

  if (!(userData?.role === userRoles.company)) {
    return <div></div>;
  }

  return <div className="min-h-dvh">{userData.name}</div>;
}

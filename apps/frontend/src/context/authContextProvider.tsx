import { useEffect, useState } from 'react';

import { ReactNode } from 'react';
import { AuthContext } from './authContext';

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const existingUser = localStorage.getItem('user');

  const [userData, setUserData] = useState(existingUser ? JSON.parse(existingUser) : null);

  const updateUserData = (data: unknown) => {
    setUserData(data);
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(userData));
  }, [userData]);

  return <AuthContext.Provider value={{ userData, updateUserData }}>{children}</AuthContext.Provider>;
};

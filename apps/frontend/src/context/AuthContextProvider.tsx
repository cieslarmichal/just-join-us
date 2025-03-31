import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../api/types/user';

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);

  const [userData, setUserData] = useState<User | null>(null);

  const updateUserData = (data: User | null) => {
    setUserData(data);
  };

  const [accessToken, setAccessToken] = useState(cookies.accessToken || null);

  const [refreshToken, setRefreshToken] = useState(cookies.refreshToken || null);

  const updateAccessToken = (newAccessToken: string | null) => {
    setAccessToken(newAccessToken);

    if (newAccessToken) {
      setCookie('accessToken', newAccessToken, {
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 12 * 60 * 60,
      });
    } else {
      removeCookie('accessToken');
    }
  };

  const updateRefreshToken = (newRefreshToken: string | null) => {
    setRefreshToken(newRefreshToken);

    if (newRefreshToken) {
      setCookie('refreshToken', newRefreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 7 * 24 * 60 * 60,
      });
    } else {
      removeCookie('refreshToken');
    }
  };

  return (
    <AuthContext.Provider
      value={{ userData, updateUserData, accessToken, refreshToken, updateAccessToken, updateRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

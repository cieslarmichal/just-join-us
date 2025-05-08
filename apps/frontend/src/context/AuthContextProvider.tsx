import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../api/types/user';
import { getMyUser } from '../api/queries/getMyUser';

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['just-join-us-access-token', 'just-join-us-refresh-token']);

  const [userData, setUserData] = useState<User | null>(null);

  const [userDataInitialized, setUserDataInitialized] = useState<boolean>(false);

  const clearUserData = () => {
    setUserData(null);

    setAccessToken(null);
    setRefreshToken(null);
    removeCookie('just-join-us-access-token');
    removeCookie('just-join-us-refresh-token');
  };

  const [accessToken, setAccessToken] = useState(cookies['just-join-us-access-token'] || null);

  const [refreshToken, setRefreshToken] = useState(cookies['just-join-us-refresh-token'] || null);

  const updateAccessToken = (newAccessToken: string) => {
    setAccessToken(newAccessToken);

    if (newAccessToken) {
      setCookie('just-join-us-access-token', newAccessToken, {
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
        sameSite: 'strict',
        secure: true,
        maxAge: 12 * 60 * 60,
      });
    } else {
      removeCookie('just-join-us-access-token');
    }
  };

  const updateRefreshToken = (newRefreshToken: string) => {
    setRefreshToken(newRefreshToken);

    if (newRefreshToken) {
      setCookie('just-join-us-refresh-token', newRefreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sameSite: 'strict',
        secure: true,
        maxAge: 7 * 24 * 60 * 60,
      });
    } else {
      removeCookie('just-join-us-refresh-token');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData && accessToken) {
        try {
          const user = await getMyUser({ accessToken });

          setUserData(user);
          setUserDataInitialized(true);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setUserData(null);
          setUserDataInitialized(true);
        }
      } else {
        setUserDataInitialized(true);
      }
    };

    fetchUserData();
  }, [userData, accessToken]);

  return (
    <AuthContext.Provider
      value={{
        userData,
        userDataInitialized,
        clearUserData,
        accessToken,
        refreshToken,
        updateAccessToken,
        updateRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

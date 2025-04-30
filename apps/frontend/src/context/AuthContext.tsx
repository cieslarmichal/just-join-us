import { createContext } from 'react';
import { User } from '../api/types/user';

export type AuthContextType = {
  userData: User | null;
  clearUserData: () => void;
  userDataInitialized: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  updateAccessToken: (newAccessToken: string | null) => void;
  updateRefreshToken: (newRefreshToken: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  userData: null,
  clearUserData: () => {},
  userDataInitialized: false,
  accessToken: null,
  refreshToken: null,
  updateAccessToken: () => {},
  updateRefreshToken: () => {},
});

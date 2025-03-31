import { createContext } from 'react';
import { User } from '../api/types/user';

export type AuthContextType = {
  userData: User | null;
  updateUserData: (data: User | null) => void;
  accessToken: string | null;
  refreshToken: string | null;
  updateAccessToken: (newAccessToken: string | null) => void;
  updateRefreshToken: (newRefreshToken: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  userData: null,
  updateUserData: () => {},
  accessToken: null,
  refreshToken: null,
  updateAccessToken: () => {},
  updateRefreshToken: () => {},
});

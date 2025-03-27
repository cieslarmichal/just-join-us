import { createContext } from 'react';

export type AuthContextType = {
  userData: {
    id: string;
    email: string;
    role: string;
  } | null;
  updateUserData: (data: unknown) => void;
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

import { createContext } from 'react';

export type AuthContextType = {
  userData: {
    id: string;
    email: string;
    role: string;
  } | null;
  updateUserData: (data: unknown) => void;
};

export const AuthContext = createContext<AuthContextType>({
  userData: null,
  updateUserData: () => {},
});

import { config } from '../../config';
import { User } from '../types/user';

type RegisterUserRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export const registerUser = async (input: RegisterUserRequest): Promise<User> => {
  const response = await fetch(`${config.api.baseUrl}/students/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
      birthDate: '1990-01-01',
      phone: input.phone,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.context?.reason);
  }

  return data as User;
};

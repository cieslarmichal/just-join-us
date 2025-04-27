import { config } from '../../config';
import { User } from '../types/user';

type GetMyUserRequest = {
  accessToken: string;
};

export const getMyUser = async (input: GetMyUserRequest): Promise<User> => {
  const response = await fetch(`${config.backendUrl}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${input.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get my user');
  }

  const data = await response.json();

  return data as User;
};

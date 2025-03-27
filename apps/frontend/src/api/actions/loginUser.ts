import { config } from '../../config';

type LoginUserRequest = {
  email: string;
  password: string;
};

type LoginUserResponse = {
  accessToken: string;
  refreshToken: string;
};

export const loginUser = async (input: LoginUserRequest): Promise<LoginUserResponse> => {
  const response = await fetch(`${config.api.baseUrl}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to login user');
  }

  const data = await response.json();

  return data as LoginUserResponse;
};

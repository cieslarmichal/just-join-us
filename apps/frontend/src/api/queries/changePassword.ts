import { config } from '../../config';

type ChangePasswordRequest = {
  token: string;
  password: string;
};

export const changePassword = async (input: ChangePasswordRequest): Promise<void> => {
  const response = await fetch(`${config.backendUrl}/users/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: input.token,
      password: input.password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to reset password');
  }
};

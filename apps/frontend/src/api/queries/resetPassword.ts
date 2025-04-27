import { config } from '../../config';

type ResetPasswordRequest = {
  email: string;
};

export const resetPassword = async (input: ResetPasswordRequest): Promise<void> => {
  await fetch(`${config.backendUrl}/users/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
    }),
  });
};

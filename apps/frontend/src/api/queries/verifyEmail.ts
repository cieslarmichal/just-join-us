import { config } from '../../config';

type VerifyEmailRequest = {
  token: string;
};

export const verifyEmail = async (input: VerifyEmailRequest): Promise<void> => {
  const response = await fetch(`${config.backendUrl}/users/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: input.token,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to verify email');
  }
};

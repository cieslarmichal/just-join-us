import { config } from '../../config.ts';

type SendVerificationEmailRequest = {
  email: string;
};

export const sendVerificationEmail = async (input: SendVerificationEmailRequest): Promise<void> => {
  await fetch(`${config.backendUrl}/users/send-verification-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
    }),
  });
};

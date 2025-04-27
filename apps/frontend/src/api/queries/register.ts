import { config } from '../../config';
import { User } from '../types/user';

type RegisterCandidateRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const registerCandidate = async (input: RegisterCandidateRequest): Promise<User> => {
  const response = await fetch(`${config.backendUrl}/candidates/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
    }),
  });

  if (response.status === 409) {
    throw new Error('User with this email already exists');
  }

  if (!response.ok) {
    throw new Error('Error during registration');
  }

  const data = await response.json();

  return data as User;
};

type RegisterCompanyRequest = {
  email: string;
  password: string;
  phone: string;
  name: string;
  logoUrl: string;
};

export const registerCompany = async (input: RegisterCompanyRequest): Promise<User> => {
  const response = await fetch(`${config.backendUrl}/companies/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      phone: input.phone,
      name: input.name,
      logoUrl: input.logoUrl,
      description: '',
    }),
  });

  if (response.status === 409) {
    throw new Error('User with this email already exists');
  }

  if (!response.ok) {
    throw new Error('Error during registration');
  }

  const data = await response.json();

  return data as User;
};

import { config } from '../../config.ts';
import { CompanyLocation } from '../types/companyLocation.ts';

type CreateCompanyLocationRequest = {
  name: string;
  companyId: string;
  cityId: string;
  address: string;
  latitude: number;
  longitude: number;
  accessToken: string;
};

export const createCompanyLocation = async (request: CreateCompanyLocationRequest): Promise<CompanyLocation> => {
  const { name, address, cityId, latitude, longitude, companyId, accessToken } = request;

  const response = await fetch(`${config.backendUrl}/companies/${companyId}/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name,
      companyId,
      address,
      cityId,
      latitude,
      longitude,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create company location');
  }

  const data = await response.json();

  return data as CompanyLocation;
};

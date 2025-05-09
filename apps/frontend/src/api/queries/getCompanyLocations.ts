import { config } from '../../config.ts';
import { CompanyLocation } from '../types/companyLocation.ts';

type GetCompanyLocationsRequest = {
  companyId: string;
  accessToken: string;
};

export const getCompanyLocations = async (request: GetCompanyLocationsRequest): Promise<CompanyLocation[]> => {
  const { companyId, accessToken } = request;

  const response = await fetch(`${config.backendUrl}/companies/${companyId}/locations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get company locations');
  }

  const jsonData = await response.json();

  return jsonData.data as CompanyLocation[];
};

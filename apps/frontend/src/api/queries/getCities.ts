import { config } from '../../config.ts';
import { City } from '../types/city.ts';

export const getCities = async (city: string): Promise<City[]> => {
  const response = await fetch(`${config.backendUrl}/cities?name=${city}&pageSize=5`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get cities');
  }

  const jsonData = await response.json();

  return jsonData.data as City[];
};

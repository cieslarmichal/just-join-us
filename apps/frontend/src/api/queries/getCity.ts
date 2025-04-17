import { config } from '../../config.ts';
import { City } from '../types/city.ts';

export const getCity = async (slug: string): Promise<City | null> => {
  const response = await fetch(`${config.backendUrl}/cities/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return null;
  }

  const jsonData = await response.json();

  return jsonData as City;
};

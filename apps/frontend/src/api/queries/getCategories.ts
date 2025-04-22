import { config } from '../../config.ts';
import { Category } from '../types/category.ts';

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${config.backendUrl}/categories?pageSize=25`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get categories');
  }

  const jsonData = await response.json();

  return jsonData.data as Category[];
};

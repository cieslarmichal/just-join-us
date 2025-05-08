import { config } from '../../config.ts';
import { Skill } from '../types/skill.ts';

export const getSkills = async (): Promise<Skill[]> => {
  const response = await fetch(`${config.backendUrl}/skills?pageSize=100`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get skills');
  }

  const jsonData = await response.json();

  return jsonData.data as Skill[];
};

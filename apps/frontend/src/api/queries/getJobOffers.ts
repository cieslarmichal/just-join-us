import { config } from '../../config.ts';
import { JobOffer } from '../types/jobOffer.ts';

interface GetJobOffersOptions {
  readonly name?: string | undefined;
  readonly city?: string | undefined;
  readonly category?: string | undefined;
  readonly sort?: string | undefined;
  readonly page: number;
  readonly pageSize: number;
}

export const getJobOffers = async (): Promise<JobOffer[]> => {
  // const { name, city, category, page, pageSize, sort } = options;

  // let url = `${config.backendUrl}/job-offers?page=${page}&pageSize=${pageSize}`;

  // const params: string[] = [];

  // if (category) {
  //   params.push(`category=${category}`);
  // }

  // if (name) {
  //   params.push(`name=${name}`);
  // }

  // if (city) {
  //   params.push(`city=${city}`);
  // }

  // if (sort) {
  //   params.push(`sort=${sort}`);
  // }

  // if (params.length > 0) {
  //   url += `&${params.join('&')}`;
  // }

  // const response = await fetch(url, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to get job offers');
  // }

  // const jsonData = await response.json();

  return Array.from({ length: 20 }).map(() => ({
    id: '1',
    name: 'Software Engineer',
    description: 'We are looking for a Software Engineer to join our team.',
    categoryId: '1',
    isHidden: false,
    employmentType: 'Full-time',
    workingTime: 'Remote',
    experienceLevel: 'Mid-level',
    minSalary: 60000,
    maxSalary: 80000,
    skills: [
      { id: '1', name: 'JavaScript' },
      { id: '2', name: 'React' },
      { id: '3', name: 'Node.js' },
    ],
    locations: [
      { id: '1', isRemote: true, city: undefined },
      { id: '2', isRemote: false, city: 'New York' },
    ],
    companyId: '1',
    company: {
      name: 'Tech Company',
      logoUrl:
        'https://imgproxy.justjoinit.tech/-G8wYD5LaluT715y84Nav2yJZap2LK2GsScPoXhO650/h:200/w:200/plain/https://public.justjoin.it/companies/logos/original/d737abb7568d970a98e3132277330c7bff5b434f.png',
    },
    createdAt: new Date(),
  }));
};

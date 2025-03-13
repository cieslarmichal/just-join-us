import { type JobOffer } from '../types/jobOffer';

const jobOffers = [
  {
    id: '1',
    name: 'Node.js Developer',
    description: 'We are looking for a Node.js Developer to join our team.',
    companyName: 'Schibsted',
    companyLogoUrl: 'https://cdn.schibsted.com/wp-content/uploads/2019/12/14155528/schibsted_logotype_black_rgb.png',
    category: 'Node.js',
    location: 'Kraków',
    latitude: 50.067861,
    longitude: 19.947389,
    salaryMin: 12000,
    salaryMax: 24000,
  },
  {
    id: '2',
    name: 'React Developer',
    description: 'We are looking for a React Developer to join our team.',
    companyName: 'Schibsted',
    companyLogoUrl: 'https://cdn.schibsted.com/wp-content/uploads/2019/12/14155528/schibsted_logotype_black_rgb.png',
    category: 'React',
    location: 'Kraków',
    latitude: 50.067861,
    longitude: 19.947389,
    salaryMin: 10000,
    salaryMax: 18000,
  },
  {
    id: '3',
    name: 'DevOps Engineer',
    description: 'We are looking for a DevOps Engineer to join our team.',
    companyName: 'Schibsted',
    companyLogoUrl: 'https://cdn.schibsted.com/wp-content/uploads/2019/12/14155528/schibsted_logotype_black_rgb.png',
    category: 'DevOps',
    location: 'Kraków',
    latitude: 50.067861,
    longitude: 19.947389,
    salaryMin: 14000,
    salaryMax: 26000,
  },
] satisfies JobOffer[];

export async function searchJobOffers(name: string): Promise<JobOffer[]> {
  return jobOffers.filter((jobOffer) => jobOffer.name.toLowerCase().includes(name.toLowerCase()));
}

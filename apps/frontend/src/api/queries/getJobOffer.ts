import type { JobOffer } from '../types/jobOffer';

export async function getJobOffer(id: string): Promise<JobOffer> {
  return {
    id,
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
  };
}

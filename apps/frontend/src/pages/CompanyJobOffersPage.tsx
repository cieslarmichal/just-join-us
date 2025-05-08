import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userRoles } from '../api/types/userRole';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { getJobOffers } from '../api/queries/getJobOffers';
import { JobOffer } from '../api/types/jobOffer';
import { CreateJobOfferModal } from '../components/CreateJobOfferModal';
import JobOfferList from '../components/JobOfferList';

export default function CompanyJobOffersPage() {
  const { userData } = useContext(AuthContext);

  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [searchParams] = useSearchParams();

  const fetchJobOffers = useCallback(async () => {
    if (!userData) {
      return;
    }

    try {
      const results = await getJobOffers({
        companyId: userData.id,
        page: Number(searchParams.get('page')) || 1,
        pageSize: 20,
      });
      setJobOffers(results);
    } catch (error) {
      console.error('Failed to fetch company job offers', error);
    }
  }, [userData, searchParams]);

  useEffect(() => {
    fetchJobOffers();
  }, [searchParams, fetchJobOffers]);

  if (!(userData?.role === userRoles.company)) {
    return <div></div>;
  }

  return (
    <div className="sm:px-4 md:px-6 mt-4 mb-4 min-h-dvh">
      <div className="flex items-center my-3 md:my-5">
        <Breadcrumbs
          previousItems={[{ label: 'My company', href: '/my-company' }]}
          currentItem={{ label: 'Job offers' }}
        />
        <div className="ml-auto">
          <CreateJobOfferModal onSuccess={fetchJobOffers} />
        </div>
      </div>

      <JobOfferList jobOffers={jobOffers} />
    </div>
  );
}

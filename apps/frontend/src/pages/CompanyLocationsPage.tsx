import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import { userRoles } from '../api/types/userRole.ts';
import { Breadcrumbs } from '../components/ui/Breadcrumbs.tsx';
import { getCompanyLocations } from '../api/queries/getCompanyLocations.ts';
import { CompanyLocation } from '../api/types/companyLocation.ts';
import { CreateCompanyLocationModal } from '../components/CreateCompanyLocationModal.tsx';
import CompanyLocationList from '../components/CompanyLocationList.tsx';

export default function CompanyLocationsPage() {
  const { userData, accessToken } = useContext(AuthContext);

  const [locations, setLocations] = useState<CompanyLocation[]>([]);

  const fetchLocations = useCallback(async () => {
    if (!userData || !accessToken) {
      return;
    }

    try {
      const results = await getCompanyLocations({
        companyId: userData.id,
        accessToken,
      });
      setLocations(results);
    } catch (error) {
      console.error('Failed to fetch company locations', error);
    }
  }, [userData, accessToken]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  if (!(userData?.role === userRoles.company)) {
    return <div></div>;
  }

  return (
    <div className="sm:px-4 md:px-6 mt-4 mb-4 min-h-dvh">
      <div className="flex items-center my-3 md:my-5">
        <Breadcrumbs
          previousItems={[{ label: 'My company', href: '/my-company' }]}
          currentItem={{ label: 'Locations' }}
        />
        <div className="ml-auto">
          <CreateCompanyLocationModal
            onSuccess={fetchLocations}
            companyId={userData.id}
          />
        </div>
      </div>

      <CompanyLocationList locations={locations} />
    </div>
  );
}

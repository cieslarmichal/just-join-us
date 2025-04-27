import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { CiLocationOn } from 'react-icons/ci';
import { Link } from 'react-router-dom';

import { JobOffer } from '../api/types/jobOffer';

interface Props {
  readonly jobOffer: JobOffer;
}

export default function JobOffersListItem({ jobOffer }: Props) {
  return (
    <Link
      to={`/job-offers/${jobOffer.id}`}
      className="block"
    >
      <div className="bg-white border p-1 md:p-2 md:py-4 flex items-center rounded-2xl hover:shadow-lg transition-shadow duration-200 ease-in-out">
        <img
          src={jobOffer.company?.logoUrl}
          alt={jobOffer.name}
          className="w-12 h-8 sm:w-20 sm:h-10 rounded md:ml-2 object-contain"
        ></img>
        <div className="flex flex-col gap-2 ml-6 flex-grow">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold sm:text-lg whitespace-nowrap">{jobOffer.name}</div>
            <div className="text-sm sm:text-base whitespace-nowrap ml-auto pr-4 text-green-600">
              {jobOffer.minSalary} - {jobOffer.maxSalary} PLN/month
            </div>
          </div>
          <div className="flex gap-4">
            <div className="items-center hidden md:flex">
              <HiOutlineBuildingOffice2 className="mr-1" />
              <div className="text-sm whitespace-nowrap">{jobOffer.company?.name}</div>
            </div>
            <div className="flex items-center">
              <CiLocationOn className="mr-0.5" />
              <div className="text-xs sm:text-sm whitespace-nowrap">{jobOffer.locations[0].city}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

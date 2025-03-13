import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { CiLocationOn } from 'react-icons/ci';
import { Link } from 'react-router-dom';

import { JobOffer } from '../api/types/jobOffer';

interface JobOfferItemProps {
  readonly jobOffer: JobOffer;
}

export default function JobOfferItem({ jobOffer }: JobOfferItemProps) {
  return (
    <Link
      to={`/job-offers/${jobOffer.id}`}
      className="block"
    >
      <div className="bg-white border p-1 md:p-2 md:py-4 flex items-center rounded-3xl hover:shadow-lg transition-shadow duration-200 ease-in-out">
        <img
          src={jobOffer.companyLogoUrl}
          alt={jobOffer.name}
          className="w-12 h-8 sm:w-20 sm:h-10 rounded md:ml-2 object-contain"
        ></img>
        <div className="flex flex-col gap-2 ml-6 flex-grow">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold sm:text-lg whitespace-nowrap">{jobOffer.name}</div>
            <div className="text-sm sm:text-lg font-semibold whitespace-nowrap ml-auto">
              {jobOffer.salaryMin} - {jobOffer.salaryMax} PLN
            </div>
          </div>
          <div className="flex gap-4">
            <div className="items-center hidden md:flex">
              <HiOutlineBuildingOffice2 className="mr-1" />
              <div className="text-sm whitespace-nowrap">{jobOffer.companyName}</div>
            </div>
            <div className="flex items-center">
              <CiLocationOn className="mr-0.5" />
              <div className="text-xs sm:text-sm whitespace-nowrap">{jobOffer.location}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

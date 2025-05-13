import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { CiLocationOn } from 'react-icons/ci';
import { Link } from 'react-router-dom';

import { JobOffer } from '../api/types/jobOffer';
import { MdComputer } from 'react-icons/md';

interface Props {
  readonly jobOffer: JobOffer;
}

export default function JobOffersListItem({ jobOffer }: Props) {
  const skillsTruncated = jobOffer.skills.map((skill) => skill.name).slice(0, 4);

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
            <div className="text-lg whitespace-nowrap ml-auto pr-4 text-green-600 font-medium">
              {jobOffer.minSalary} - {jobOffer.maxSalary} PLN/month
            </div>
          </div>
          <div className="flex">
            <div className="flex gap-4">
              <div className="items-center hidden md:flex">
                <HiOutlineBuildingOffice2 className="mr-1" />
                <div className="text-sm whitespace-nowrap">{jobOffer.company?.name}</div>
              </div>
              <div className="flex items-center">
                <CiLocationOn className="mr-0.5" />
                <div className="text-xs sm:text-sm whitespace-nowrap">{jobOffer.location?.city}</div>
              </div>
              <div className="flex items-center">
                <MdComputer className="mr-1" />
                <div className="text-xs sm:text-sm whitespace-nowrap">{jobOffer.category.name}</div>
              </div>
            </div>
            <div className="flex ml-auto">
              <div className="flex flex-wrap gap-1">
                {skillsTruncated.map((skill) => (
                  <div
                    key={skill}
                    className="px-2 py-0.5 bg-gray-100 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

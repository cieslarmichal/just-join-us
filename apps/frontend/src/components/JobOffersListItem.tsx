import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { CiLocationOn } from 'react-icons/ci';
import { Link } from 'react-router-dom';

import { JobOffer } from '../api/types/jobOffer';
import { MdComputer } from 'react-icons/md';
import { formatSalary } from '../common/formatSalary';

interface Props {
  readonly jobOffer: JobOffer;
}

export default function JobOffersListItem({ jobOffer }: Props) {
  const skillsTruncated = jobOffer.skills.map((skill) => skill.name).slice(0, 3);

  return (
    <Link
      to={`/job-offers/${jobOffer.id}`}
      className="block"
    >
      <div className="bg-white border px-4 py-2.5 flex items-center rounded-lg hover:shadow-lg transition-shadow duration-200 ease-in-out">
        <img
          src={jobOffer.company?.logoUrl}
          alt={jobOffer.name}
          className="w-12 h-8 sm:w-20 sm:h-10 rounded md:ml-2 object-contain"
        ></img>
        <div className="flex flex-col gap-2 ml-6 flex-grow">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-lg whitespace-nowrap">{jobOffer.name}</div>
            <div className="text-lg whitespace-nowrap ml-auto text-green-600 font-medium">
              {formatSalary(jobOffer.minSalary, jobOffer.maxSalary)}
            </div>
          </div>
          <div className="flex">
            <div className="flex gap-4">
              <div className="items-center hidden md:flex">
                <HiOutlineBuildingOffice2 className="mr-1.5 text-gray-700" />
                <div className="text-xs whitespace-nowrap text-gray-700">{jobOffer.company?.name}</div>
              </div>
              <div className="flex items-center">
                <CiLocationOn className="mr-1 text-gray-700" />
                <div className="text-xs whitespace-nowrap text-gray-700">{jobOffer.location?.city}</div>
              </div>
              <div className="flex items-center">
                <MdComputer className="mr-1.5 text-gray-700" />
                <div className="text-xs whitespace-nowrap text-gray-700">{jobOffer.category.name}</div>
              </div>
            </div>
            <div className="flex ml-auto">
              <div className="flex flex-wrap gap-1">
                {skillsTruncated.map((skill) => (
                  <div
                    key={skill}
                    className="px-2 py-0.5 border border-gray-200 rounded-full text-xs font-medium"
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

import DOMPurify from 'dompurify';
import { useMemo } from 'react';

import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { CiLocationOn } from 'react-icons/ci';
import { JobOffer } from '../api/types/jobOffer';
import MapPicker from './MapPicker';
import { Button } from './ui/Button';
import JobOfferDetailsSection from './JobOfferDetailsSection';
import { MdComputer } from 'react-icons/md';
import { CiWallet } from 'react-icons/ci';
import { FaRegStar } from 'react-icons/fa';

interface Props {
  readonly jobOffer: JobOffer;
}

export default function JobOfferDetails({ jobOffer }: Props) {
  const {
    name,
    description: rawDescription,
    company,
    employmentType,
    maxSalary,
    minSalary,
    category,
    location,
    experienceLevel,
  } = jobOffer;

  const description = useMemo(() => DOMPurify.sanitize(rawDescription), [rawDescription]);

  return (
    <div
      className="px-4 py-6 bg-white rounded-2xl md:px-12 flex gap-25 mt-5"
      style={{
        boxShadow: '0px 0px 9px 1px rgba(200, 203, 208, 0.72)',
      }}
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6 xl:gap-16 mb-3 md:mb-5">
            <img
              src={company?.logoUrl}
              alt={company?.name}
              className="w-30 object-contain"
            />
            <div className="flex flex-col gap-2.5">
              <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
              <div className="flex gap-6">
                <JobOfferDetailsSection
                  sectionValue={company?.name as string}
                  Icon={HiOutlineBuildingOffice2}
                />
                <JobOfferDetailsSection
                  sectionValue={location?.city || ''}
                  Icon={CiLocationOn}
                />
                <JobOfferDetailsSection
                  sectionValue={category.name}
                  Icon={MdComputer}
                />
                <JobOfferDetailsSection
                  sectionValue={experienceLevel}
                  Icon={FaRegStar}
                />
              </div>
              <div className="whitespace-nowrap font-medium flex items-center">
                <CiWallet className="inline mr-4 text-3xl" />
                <div className="flex flex-col gap-0.5">
                  <div>
                    {minSalary} - {maxSalary} PLN / month
                  </div>
                  <div className="text-xs">
                    {employmentType === 'B2B' ? 'Net' : 'Gross'} per month - {employmentType}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 w-full gap-8 mt-8 items-start">
          <h2 className="text-2xl font-medium">Tech stack</h2>
          <div className="flex flex-wrap gap-4">
            {jobOffer?.skills.map((skill) => (
              <div
                key={skill.name}
                className="px-4 py-1.5 bg-gray-100 rounded-full text-base font-medium"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-4 w-full gap-8 mt-8 items-start">
          <h2 className="text-2xl font-medium">Job description</h2>
          <div
            className="text-base"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <div className="flex justify-center items-center mt-6 mb-4 relative right-16">
          <Button
            className="px-30 py-6 rounded-4xl whitespace-nowrap bg-pink-600 font-medium text-lg "
            // onClick={() => setIsSignupOpen(true)}
          >
            Apply
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start min-w-[40vw]">
        <div className="flex flex-col justify-center items-center w-full">
          <MapPicker
            latitude={location?.latitude || 52.2297}
            longitude={location?.longitude || 21.0122}
            readOnly
            className="w-full h-50 md:h-[500px]"
            zoom={14}
          />
        </div>
      </div>
    </div>
  );
}

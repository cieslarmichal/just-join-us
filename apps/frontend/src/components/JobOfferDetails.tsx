import DOMPurify from 'dompurify';
import { useMemo } from 'react';

import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { CiLocationOn } from 'react-icons/ci';
import { JobOffer } from '../api/types/jobOffer';
import MapPicker from './MapPicker';
import { Button } from './ui/Button';

interface Props {
  readonly jobOffer: JobOffer;
}

export default function JobOfferDetails({ jobOffer }: Props) {
  const {
    name,
    description: rawDescription,
    category,
    companyName,
    location,
    latitude,
    longitude,
    companyLogoUrl,
    salaryMin,
    salaryMax,
  } = jobOffer;

  const description = useMemo(() => DOMPurify.sanitize(rawDescription), [rawDescription]);

  return (
    <div className="px-4 py-6 bg-white shadow-lg rounded-2xl md:px-12">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap:8 md:gap-16 mb-3 md:mb-5">
          <img
            src={companyLogoUrl}
            alt={companyName}
            className="w-30 md:w-40 object-contain"
          />
          <h1 className="text-xl md:text-3xl font-bold">{name}</h1>
        </div>
        <div className="inline-flex items-center px-6 py-0.5">
          <div className="whitespace-nowrap text-xl font-bold">
            {salaryMin} - {salaryMax} PLN
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-8 mt-8">
        <div className="flex-1 space-y-4 w-full">
          <div className="flex gap-12 mb-10">
            <div className="flex items-center">
              <HiOutlineBuildingOffice2 className="mr-2.5 text-4xl" />
              <div className="flex-col gap-2">
                <div className="whitespace-nowrap text-gray-500 text-sm">Company</div>
                <div className="whitespace-nowrap text-base">{companyName}</div>
              </div>
            </div>
            <div className="flex items-center">
              <CiLocationOn className="mr-2.5 text-4xl" />
              <div className="flex-col gap-2">
                <div className="whitespace-nowrap text-gray-500 text-sm">Location</div>
                <div className="whitespace-nowrap text-base">{location}</div>
              </div>
            </div>
            <div className="flex items-center">
              <CiLocationOn className="mr-2.5 text-4xl" />
              <div className="flex-col gap-2">
                <div className="whitespace-nowrap text-gray-500 text-sm">Category</div>
                <div className="whitespace-nowrap text-base">{category}</div>
              </div>
            </div>
          </div>
          <div className="text-2xl font-medium">Job description</div>
          <div
            className="text-base"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className="flex-[0.9] flex-col justify-center items-center">
          <MapPicker
            latitude={latitude}
            longitude={longitude}
            readOnly
            className="w-full h-50 md:h-96"
            zoom={14}
          />
          <div className="flex justify-end items-center mt-4">
            <Button
              className="hidden md:flex px-3 sm:px-6 rounded-lg whitespace-nowrap bg-orange-700 font-medium"
              // onClick={() => setIsSignupOpen(true)}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

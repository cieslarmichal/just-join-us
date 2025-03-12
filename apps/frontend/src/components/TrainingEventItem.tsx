import { CiClock1 } from 'react-icons/ci';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { CiLocationOn } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { CiCalendar } from 'react-icons/ci';

import { type TrainingEvent } from '../api/types/trainingEvent';
import { formatDate } from '../common/formatDate';
import { getTrainingCategoryIcon } from '../common/trainingCategoryIcon';

interface TrainingEventItemProps {
  readonly trainingEvent: TrainingEvent;
}

export default function TrainingEventItem({ trainingEvent }: TrainingEventItemProps) {
  return (
    <Link
      to={`/trainings/${trainingEvent.id}`}
      className="block"
    >
      <div className="bg-white border p-1 md:p-2 md:py-4 flex items-center rounded-3xl hover:shadow-lg transition-shadow duration-200 ease-in-out">
        <img
          src={trainingEvent.companyLogoUrl}
          alt={trainingEvent.name}
          className="w-12 h-8 sm:w-20 sm:h-10 rounded md:ml-2 object-contain"
        ></img>
        <div className="flex flex-col gap-2 ml-6 flex-grow">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold sm:text-lg whitespace-nowrap">{trainingEvent.name}</div>
            <div className="text-sm sm:text-lg font-semibold whitespace-nowrap sm:hidden ml-auto">
              {trainingEvent.price} PLN
            </div>
          </div>
          <div className="flex gap-4">
            <div className="items-center hidden md:flex">
              <HiOutlineBuildingOffice2 className="mr-1" />
              <div className="text-sm whitespace-nowrap">{trainingEvent.companyName}</div>
            </div>
            <div className="flex items-center">
              <CiLocationOn className="mr-0.5" />
              <div className="text-xs sm:text-sm whitespace-nowrap">{trainingEvent.location}</div>
            </div>
            <div className="flex items-center">
              <CiCalendar className="mr-1" />
              <div className="text-xs sm:text-sm whitespace-nowrap">{formatDate(trainingEvent.startDate)}</div>
            </div>
            <div className="items-center hidden sm:flex">
              <CiClock1 className="mr-1" />
              <div className="text-sm whitespace-nowrap">{trainingEvent.duration}</div>
            </div>
          </div>
        </div>
        <div className="sm:flex-row sm:gap-2 sm:ml-2 text-right mr-1 sm:mr-2 hidden sm:flex">
          {getTrainingCategoryIcon(trainingEvent.category, 8)}
          <div className="text-sm sm:text-lg font-semibold whitespace-nowrap">{trainingEvent.price} PLN</div>
        </div>
      </div>
    </Link>
  );
}

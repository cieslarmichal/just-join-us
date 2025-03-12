import { AiOutlineMedicineBox } from 'react-icons/ai';
import { GiBoxingGlove, GiDeliveryDrone, GiPistolGun } from 'react-icons/gi';
import { IoMdBonfire } from 'react-icons/io';
import { MdComputer } from 'react-icons/md';

export function getTrainingCategoryIcon(category: string, size: number) {
  switch (category) {
    case 'Medycyna':
      return <AiOutlineMedicineBox className={`w-${size} h-${size}`} />;

    case 'Samoobrona':
      return <GiBoxingGlove className={`w-${size} h-${size}`} />;

    case 'Drony':
      return <GiDeliveryDrone className={`w-${size} h-${size}`} />;

    case 'Cyberbezpieczeństwo':
      return <MdComputer className={`w-${size} h-${size}`} />;

    case 'Strzelectwo':
      return <GiPistolGun className={`w-${size} h-${size}`} />;

    case 'Przetrwanie':
      return <IoMdBonfire className={`w-${size} h-${size}`} />;

    default:
      return null;
  }
}

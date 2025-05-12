import { IconType } from 'react-icons/lib';

interface Props {
  readonly sectionValue: string;
  readonly Icon: IconType;
}

export default function JobOfferDetailsSection({ sectionValue, Icon }: Props) {
  return (
    <div className="flex items-center">
      <div>
        <Icon className="mr-2 text-xl" />
      </div>
      <div className="flex-col gap-2">
        <div className="whitespace-nowrap text-base">{sectionValue}</div>
      </div>
    </div>
  );
}

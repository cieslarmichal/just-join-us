import { IconType } from "react-icons/lib";

interface Props {
  readonly sectionName: string;
  readonly sectionValue: string;
  readonly Icon: IconType;
}

export default function JobOfferDetailsSection({ sectionName, sectionValue, Icon }: Props) {
  return (
    <div className="flex items-center">
      <div><Icon className="mr-2.5 text-4xl"/></div>
      <div className="flex-col gap-2">
        <div className="whitespace-nowrap text-gray-500 text-sm">{sectionName}</div>
        <div className="whitespace-nowrap text-base">{sectionValue}</div>
      </div>
    </div>
  );
}

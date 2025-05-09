import { CompanyLocation } from '../api/types/companyLocation';

interface Props {
  readonly locations: CompanyLocation[];
}

export default function CompanyLocationList({ locations }: Props) {
  const renderedResults = locations.map((locations) => {
    return <div>{locations.name}</div>;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-3 mb-8 gap-x-5 gap-y-13">
      {renderedResults.length === 0 ? 'No results' : renderedResults}
    </div>
  );
}

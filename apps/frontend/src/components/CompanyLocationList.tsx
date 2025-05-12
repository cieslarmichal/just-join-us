import { CompanyLocation } from '../api/types/companyLocation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { HiPencil, HiTrash } from 'react-icons/hi2';

interface Props {
  readonly locations: CompanyLocation[];
}

export default function CompanyLocationList({ locations }: Props) {
  return (
    <div className="flex mt-3 mb-8 px-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Coordinates</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.cityName}</TableCell>
              <TableCell>{location.address}</TableCell>
              <TableCell>
                {location.latitude}, {location.longitude}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    // onClick={() => onEdit(location.id)}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="Edit location"
                  >
                    <HiPencil className="w-5 h-5" />
                  </button>
                  <button
                    // onClick={() => onDelete(location.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete location"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

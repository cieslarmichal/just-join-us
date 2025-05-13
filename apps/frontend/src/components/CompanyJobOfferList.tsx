import { HiPencil, HiTrash } from 'react-icons/hi2';
import { JobOffer } from '../api/types/jobOffer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { formatSalary } from '../common/formatSalary';

interface Props {
  readonly jobOffers: JobOffer[];
}

export default function JobOfferList({ jobOffers }: Props) {
  return (
    <div className="flex mt-3 mb-8 px-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Employment type</TableHead>
            <TableHead>Experience level</TableHead>
            <TableHead>Salary (PLN/month)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobOffers.map((jobOffer) => (
            <TableRow key={jobOffer.id}>
              <TableCell>{jobOffer.name}</TableCell>
              <TableCell>{jobOffer.category.name}</TableCell>
              <TableCell>{jobOffer.location?.city}</TableCell>
              <TableCell>{jobOffer.employmentType}</TableCell>
              <TableCell>{jobOffer.experienceLevel}</TableCell>
              <TableCell>{formatSalary(jobOffer.minSalary, jobOffer.maxSalary)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button
                    // onClick={() => onEdit(jobOffer.id)}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="Edit jobOffer"
                  >
                    <HiPencil className="w-5 h-5" />
                  </button>
                  <button
                    // onClick={() => onDelete(jobOffer.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete jobOffer"
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

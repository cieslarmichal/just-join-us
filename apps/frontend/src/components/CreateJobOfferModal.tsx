import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';
import { createJobOffer } from '../api/queries/createJobOffer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/Dialog';
import { Button } from './ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/Form';
import { Input } from './ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Category } from '../api/types/category';
import { getCategories } from '../api/queries/getCategories';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';

const employmentTypes = ['Permanent', 'Contract', 'Internship'];

const workingTimes = ['Full-time', 'Part-time'];

const experienceLevels = ['Intern', 'Junior', 'Mid', 'Senior'];

const formSchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().min(1).max(10000),
  categoryId: z.string().min(1),
  employmentType: z.string(),
  workingTime: z.string(),
  experienceLevel: z.string(),
  minSalary: z.number().min(1),
  maxSalary: z.number().min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSuccess: () => void;
}

export const CreateJobOfferModal = ({ onSuccess }: Props): ReactNode => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const results = await getCategories();
      setCategories(results);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  }, [setCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const { userData, accessToken } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (payload: FormValues): Promise<void> => {
    if (!userData || !accessToken) {
      setError('Cannot create a job offer. User is not authenticated.');
      return;
    }

    try {
      await createJobOffer({
        companyId: userData?.id as string,
        name: payload.name,
        description: payload.description,
        categoryId: payload.categoryId,
        accessToken,
      });

      toast.success('Job offer created.');

      onSuccess();

      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        return setError(error.message);
      }

      throw error;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => {
        setIsOpen(val);

        form.reset();

        form.clearErrors();

        setError('');
      }}
    >
      <DialogTrigger asChild>
        <Button className="px-3 sm:px-6 rounded-lg whitespace-nowrap bg-pink-600 py-5 font-medium">
          Create job offer
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{
          borderRadius: '30px',
        }}
        className="sm:max-w-2xl py-8"
      >
        <DialogHeader className="font-semibold text-center flex justify-center items-center">
          <DialogTitle>Create job offer</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-4 justify-center items-center">
          <p className={error ? 'text-red-500' : 'hidden'}>{error}</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 w-140"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Job offer name"
                        type="string"
                        maxLength={64}
                        inputMode="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <ReactQuill
                        className="min-h-[15rem] max-h-[25rem] resize-none mb-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Employment type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employmentTypes.map((employmentType) => (
                          <SelectItem
                            key={employmentType}
                            value={employmentType}
                          >
                            {employmentType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workingTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Working time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a working time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workingTimes.map((workingTime) => (
                          <SelectItem
                            key={workingTime}
                            value={workingTime}
                          >
                            {workingTime}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Experience level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experienceLevels.map((experienceLevel) => (
                          <SelectItem
                            key={experienceLevel}
                            value={experienceLevel}
                          >
                            {experienceLevel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-8 gap-2 flex sm:justify-center justify-center sm:items-center items-center">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="bg-orange-700 w-full disabled:bg-gray-400 text-black enabled:text-white py-5"
                >
                  Create
                </Button>
              </div>
            </form>
          </Form>
          {form.formState.errors.root && (
            <div className="text-red-600 text-sm mt-2">{form.formState.errors.root.message}</div>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { MultiSelect } from './ui/MultiSelect';
import { Skill } from '../api/types/skill';
import { getSkills } from '../api/queries/getSkills';
import { getCompanyLocations } from '../api/queries/getCompanyLocations';
import { CompanyLocation } from '../api/types/companyLocation';

const employmentTypes = ['Permanent', 'B2B'];

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
  companyLocation: z.string(),
  isRemote: z.boolean(),
  skills: z.array(z.string().min(1)).min(1).nonempty('Please select at least one skill.'),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSuccess: () => void;
}

export const CreateJobOfferModal = ({ onSuccess }: Props): ReactNode => {
  const { userData, accessToken } = useContext(AuthContext);

  const [categories, setCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [locations, setLocations] = useState<CompanyLocation[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const results = await getCategories();
      setCategories(results);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  }, [setCategories]);

  const fetchLocations = useCallback(async () => {
    if (!userData || !accessToken) {
      return;
    }

    try {
      const results = await getCompanyLocations({
        companyId: userData.id,
        accessToken,
      });
      setLocations(results);
    } catch (error) {
      console.error('Failed to fetch company locations', error);
    }
  }, [userData, accessToken]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const fetchSkills = useCallback(async () => {
    try {
      const results = await getSkills();
      setSkills(results);
    } catch (error) {
      console.error('Failed to fetch skills', error);
    }
  }, [setSkills]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      employmentType: '',
      workingTime: '',
      experienceLevel: '',
      companyLocation: '',
      isRemote: undefined,
      minSalary: 0,
      maxSalary: 0,
      skills: [],
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
        isRemote: payload.isRemote,
        description: payload.description,
        categoryId: payload.categoryId,
        employmentType: payload.employmentType,
        workingTime: payload.workingTime,
        experienceLevel: payload.experienceLevel,
        minSalary: payload.minSalary,
        maxSalary: payload.maxSalary,
        skillIds: payload.skills,
        locationId: payload.companyLocation,
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

  const skillList = useMemo(() => {
    return skills.map((skill) => ({
      value: skill.id,
      label: skill.name,
    }));
  }, [skills]);

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
        className="sm:max-w-7xl py-8"
      >
        <DialogHeader className="font-semibold text-center flex justify-center items-center">
          <DialogTitle>Create job offer</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-4 justify-center items-center">
          <p className={error ? 'text-red-500' : 'hidden'}>{error}</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {/* Left Column */}
                <div className="flex flex-col gap-4">
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
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select category" />
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
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={skillList}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            placeholder="Select options"
                            animation={2}
                            maxCount={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4">
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
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select employment type" />
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
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select working time" />
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
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select experience level" />
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

                  <FormField
                    control={form.control}
                    name="companyLocation"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Company location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem
                                key={location.id}
                                value={location.id}
                              >
                                {location.name}
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
                    name="isRemote"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Is remote work allowed</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value === 'true');
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="minSalary"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>Min salary in PLN</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Minimum salary"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.currentTarget.valueAsNumber);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxSalary"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>Max salary in PLN</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Maximum salary"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.currentTarget.valueAsNumber);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 gap-2 flex sm:justify-center justify-center sm:items-center items-center">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="bg-pink-600 w-full disabled:bg-gray-400 text-black enabled:text-white py-5"
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

'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { EyeIcon, EyeOffIcon, InfoIcon } from 'lucide-react';
import { z } from 'zod';
import { uploadImage } from '../api/queries/uploadImage';
import { registerCompany, registerCandidate } from '../api/queries/register';

const allowedImageTypes = ['image/jpeg', 'image/png'];

const formSchema = z.union([
  z
    .object({
      isCompany: z.literal(false),
      firstName: z
        .string()
        .min(3)
        .max(64)
        .regex(/^[a-ząćęłńóśźż]+(-[a-ząćęłńóśźż]+)?$/i, 'Invalid first name'),
      lastName: z
        .string()
        .min(3)
        .max(64)
        .regex(/^[a-ząćęłńóśźż]+(-[a-ząćęłńóśźż]+)?$/i, 'Invalid last name'),
      email: z.string().email().max(64),
      password: z
        .string()
        .min(8)
        .max(64)
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/\d/, 'Password must contain at least one digit'),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords must match',
      path: ['passwordConfirmation'],
    }),
  z
    .object({
      isCompany: z.literal(true),
      name: z.string().min(3).max(100),
      logo: z.any().refine((file) => {
        if (!file) {
          return false;
        }

        const maxSizeInBytes = 10 * 1024 * 1024;

        if (file?.size > maxSizeInBytes) {
          return false;
        }

        return true;
      }, 'File must be an image with size less than 10MB'),
      email: z.string().email().max(64),
      phone: z
        .string()
        .min(9)
        .max(15)
        .regex(/^\+?[0-9]{9,15}$/, 'Numer telefonu musi być poprawny'),
      password: z
        .string()
        .min(8)
        .max(64)
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/\d/, 'Password must contain at least one digit'),
      passwordConfirmation: z.string(),
    })
    .superRefine(({ passwordConfirmation, password }, context) => {
      if (passwordConfirmation !== password) {
        context.addIssue({
          code: 'custom',
          message: 'Passwords must match',
          path: ['passwordConfirmation'],
        });
      }
    }),
]);

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isCompany, setIsCompany] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: isCompany
      ? {
          isCompany: true,
          name: '',
          logo: null,
          email: '',
          phone: '',
          password: '',
          passwordConfirmation: '',
        }
      : {
          isCompany: false,
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          passwordConfirmation: '',
        },
  });

  async function onSubmit(values: FormValues) {
    try {
      const payload = values.isCompany
        ? {
            email: values.email,
            password: values.password,
            name: values.name,
            logo: values.logo,
            phone: values.phone,
          }
        : {
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
          };

      if (values.isCompany) {
        const logoUrl = await uploadImage(payload.logo as File);

        await registerCompany({
          email: payload.email,
          password: payload.password,
          name: payload.name as string,
          logoUrl: logoUrl,
          phone: payload.phone as string,
        });
      } else {
        await registerCandidate({
          email: payload.email,
          password: payload.password,
          firstName: payload.firstName as string,
          lastName: payload.lastName as string,
        });
      }

      onSuccess();
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Error during registration',
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="isCompany"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center">
                <FormControl>
                  <Checkbox
                    id="isCompany"
                    className="border-2"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      setIsCompany(!!checked);
                      field.onChange(!!checked);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Register as a company</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {!isCompany && (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {isCompany && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+48 795 232 544"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={() => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <div>
                        <div className="flex items-center gap-4">
                          <label
                            htmlFor="logo"
                            className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-pink-700"
                          >
                            Select a file
                          </label>
                          <span className="text-sm text-gray-600">
                            {form.watch('logo')?.name || 'No file selected'}
                          </span>
                        </div>
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && allowedImageTypes.includes(file.type)) {
                              form.setValue('logo', file);
                              form.clearErrors('logo');
                            } else {
                              form.setError('logo', {
                                type: 'manual',
                                message: 'Invalid file type.',
                              });
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@domain.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Password
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-gray-500 cursor-pointer">
                          <InfoIcon className="w-4 h-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Password must be at least 8 characters long and contain at least one uppercase letter, one
                          lowercase letter, and one digit.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="At least 8 characters"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                    >
                      {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Repeat password"
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                    >
                      {showPasswordConfirmation ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center w-full mt-8">
            <Button
              type="submit"
              className={'w-full px-6 py-6 sm:px-10 rounded-2xl font-medium bg-pink-600'}
            >
              Sign up
            </Button>
          </div>
        </form>
      </Form>
      {form.formState.errors.root && (
        <div className="text-red-600 text-sm mt-2">{form.formState.errors.root.message}</div>
      )}
    </div>
  );
}

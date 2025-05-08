'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip';
import { EyeIcon, EyeOffIcon, InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { changePassword } from '../api/queries/changePassword';
import { toast } from 'sonner';

const formSchema = z
  .object({
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
    message: 'Hasła muszą być takie same',
    path: ['passwordConfirmation'],
  });

type FormValues = z.infer<typeof formSchema>;

export default function NewPasswordForm() {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await changePassword({
        token: token || '',
        password: values.password,
      });

      toast.success('Password changed.');

      navigate('/login');
    } catch (error) {
      console.error('Failed to reset password', error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                New password
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
            className={`w-full px-6 py-6 sm:px-10 rounded-2xl font-medium ${
              form.formState.isValid ? 'bg-pink-600' : 'bg-gray-400 text-black cursor-not-allowed border-black border-1'
            }`}
            disabled={!form.formState.isValid}
          >
            Set new password
          </Button>
        </div>
      </form>
    </Form>
  );
}

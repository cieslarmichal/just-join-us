'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/queries/resetPassword';

const formSchema = z.object({
  email: z.string().email().max(64),
});

type FormValues = z.infer<typeof formSchema>;

export interface Props {
  onSuccess: () => void;
}

export default function ResetPasswordForm({ onSuccess }: Props) {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: FormValues) {
    await resetPassword({ email: values.email });

    onSuccess();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
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
        <div className="flex justify-center w-full mt-8">
          <Button
            type="submit"
            className={`w-full px-6 py-6 sm:px-10 rounded-2xl font-medium ${
              form.formState.isValid ? 'bg-pink-600' : 'bg-gray-400 text-black cursor-not-allowed border-black border-1'
            }`}
            disabled={!form.formState.isValid}
          >
            Reset password
          </Button>
        </div>
      </form>
      <div className="text-center mt-1">
        <button
          type="button"
          onClick={() => navigate('/login?tab=login')}
          className="text-xs text-gray-500 hover:underline cursor-pointer"
        >
          Back to login
        </button>
      </div>
    </Form>
  );
}

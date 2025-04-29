'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { loginUser } from '../api/queries/loginUser';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const formSchema = z.object({
  email: z.string().email().max(50),
  password: z.string().min(8).max(50),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const { updateAccessToken, updateRefreshToken } = useContext(AuthContext);

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const tokens = await loginUser({ email: values.email, password: values.password });

      updateAccessToken(tokens.accessToken);
      updateRefreshToken(tokens.refreshToken);

      navigate('/');
    } catch {
      form.setError('root', {
        message: 'Invalid email or password',
      });
    }
  }

  return (
    <div>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
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
                form.formState.isValid
                  ? 'bg-pink-600'
                  : 'bg-gray-400 text-black cursor-not-allowed border-black border-1'
              }`}
              disabled={!form.formState.isValid}
            >
              Sign in
            </Button>
          </div>
        </form>
        <div className="text-center mt-1">
          <button
            type="button"
            onClick={() => navigate('/login?tab=reset-password')}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
      </Form>
      {form.formState.errors.root && (
        <div className="text-red-600 text-sm mt-2">{form.formState.errors.root.message}</div>
      )}
    </div>
  );
}

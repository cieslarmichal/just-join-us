'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { loginUser } from '../api/actions/loginUser';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyUser } from '../api/queries/getMyUser';

const formSchema = z.object({
  email: z.string().email().max(50),
  password: z.string().min(8).max(50),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const { updateUserData, updateAccessToken, updateRefreshToken } = useContext(AuthContext);

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const tokens = await loginUser({ email: values.email, password: values.password });
      const user = await getMyUser({ accessToken: tokens.accessToken });

      updateAccessToken(tokens.accessToken);
      updateRefreshToken(tokens.refreshToken);
      updateUserData(user);

      const redirectPath = '/';

      navigate(redirectPath);
    } catch (error) {
      console.error('Failed to login user', error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
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

        <div className="flex justify-center w-full">
          <Button
            type="submit"
            className="w-full px-6 py-6 sm:px-10 rounded-2xl bg-pink-600 text-base font-medium"
          >
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
}

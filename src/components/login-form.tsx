import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { z } from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { useCallback, useState } from 'react'
import apiService from '@/lib/apiService'
import { Link, useNavigate } from 'react-router-dom';
import { mutate } from 'swr';

const formSchema = z.object({
  username: z.string(),
  password: z.string()
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isError, setError] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const navigate = useNavigate();

  const handleLogin = useCallback((values: z.infer<typeof formSchema>) => {
    setError(false);
    apiService().post('/login', values)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        mutate('/user');

        setTimeout(() => {
          navigate('/');
        }, 1000);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Masukkan username dan password anda untuk masuk ke akun
          </CardDescription>
          {isError && <p className="text-red-500 text-center text-sm pt-4">Username atau password salah</p>}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Masukkan username"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Masukkan password"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link to="/register" className="underline underline-offset-4">
              Buat akun
            </Link>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}

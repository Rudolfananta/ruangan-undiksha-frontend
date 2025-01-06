import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useCallback, useState } from 'react';
import apiService from '@/lib/apiService';
import { Link, useNavigate } from 'react-router-dom';
import { mutate } from 'swr';

const passwordSchema = z
  .string()
  .min(8, { message: "Password harus terdiri dari minimal 8 karakter." })
  .max(100, { message: 'Maksimal 100 karakter' })
  .regex(/[A-Z]/, { message: "Password harus mengandung setidaknya satu huruf kapital." })
  .regex(/[a-z]/, { message: "Password harus mengandung setidaknya satu huruf kecil." })
  .regex(/[0-9]/, { message: "Password harus mengandung setidaknya satu angka." })
  .regex(/[@$!%*?&]/, { message: "Password harus mengandung setidaknya satu karakter spesial (@$!%*?&)." });


const formSchema = z.object({
  name: z.string().min(5, 'Minimal 5 karakter'),
  username: z.string().min(5, 'Minimal 5 karakter').max(100, 'Maksimal 100 karakter'),
  password: passwordSchema,
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Password tidak sama.",
  path: ["confirm_password"], // Points the error to the confirmPassword field
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isError, setError] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      confirm_password: ''
    }
  });

  const navigate = useNavigate();

  const handleRegister = useCallback((values: z.infer<typeof formSchema>) => {
    setError(false);
    apiService().post('/register', values)
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
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Masukkan data diri anda untuk membuat akun
          </CardDescription>
          {isError && <p className="text-red-500 text-center text-sm pt-4">Terjadi kesalahan</p>}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
            <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Masukkan nama"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
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
              <FormField
                name="confirm_password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Konfirmasi password"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <Button type="submit" className="w-full">
                Buat Akun
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Masuk
            </Link>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}

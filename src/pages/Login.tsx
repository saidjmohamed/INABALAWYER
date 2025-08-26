import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('يجب أن يكون بريداً إلكترونياً صالحاً').min(1, 'البريد الإلكتروني مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { session, profile } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setIsLoading(false);

    if (error) {
      showError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
    // On success, the SessionProvider will handle the redirect.
  };

  if (session && profile) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">INABALAWYER</CardTitle>
          <CardDescription>تسجيل الدخول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ادخل بريدك الإلكتروني" {...field} />
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
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="ادخل كلمة المرور" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'تسجيل الدخول'}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4 text-sm">
            <p>
              ليس لديك حساب؟{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                إنشاء حساب
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
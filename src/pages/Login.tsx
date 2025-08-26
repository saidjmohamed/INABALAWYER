import { useEffect, useState } from 'react';
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
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { session, profile, loading: sessionLoading } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!sessionLoading) {
      if (session && profile) {
        // Successfully logged in and profile is active/admin, Navigate will handle redirect
      } else if (loginAttempted && !session && !profile) {
        // Login was attempted, but no session/profile means it was rejected (e.g., pending)
        setLoginError('تم تسجيل الدخول بنجاح، ولكن حسابك قيد المراجعة من قبل الإدارة. يرجى الانتظار حتى يتم تفعيله.');
        showError('حسابك قيد المراجعة.');
        setLoginAttempted(false); // Reset after showing message
      }
    }
  }, [session, profile, sessionLoading, loginAttempted]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setLoginAttempted(true); // Mark that a login attempt is being made
    setLoginError(null); // Clear previous errors

    const email = `${values.username.toLowerCase()}@local-user.com`;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: values.password,
    });

    if (signInError) {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة.');
      showError('اسم المستخدم أو كلمة المرور غير صحيحة.');
      setIsLoading(false);
      setLoginAttempted(false); // Reset if direct sign-in error
      return;
    }
    // If no direct signInError, SessionContext will handle the session and profile.
    // The useEffect above will catch the state change if the profile is pending.
    setIsLoading(false);
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المستخدم</FormLabel>
                    <FormControl>
                      <Input placeholder="ادخل اسم المستخدم" {...field} />
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
              {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
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
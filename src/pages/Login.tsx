import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Navigate, Link } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

const Login = () => {
  const { session } = useSession();

  if (session) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">إنابة و معلومة بين المحامين</CardTitle>
          <CardDescription>تسجيل الدخول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            theme="light"
            view="sign_in"
            showLinks={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'البريد الإلكتروني',
                  password_label: 'كلمة المرور',
                  button_label: 'تسجيل الدخول',
                  loading_button_label: 'جاري تسجيل الدخول...',
                  social_provider_text: 'تسجيل الدخول عبر {{provider}}',
                  link_text: 'هل لديك حساب بالفعل؟ سجل الدخول',
                },
              },
            }}
          />
          <div className="text-center mt-4 text-sm">
            <p>
              ليس لديك حساب؟{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                أنشئ حسابًا جديدًا
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
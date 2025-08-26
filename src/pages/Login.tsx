import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
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
                sign_up: {
                  email_label: 'البريد الإلكتروني',
                  password_label: 'كلمة المرور',
                  button_label: 'إنشاء حساب',
                  loading_button_label: 'جاري إنشاء الحساب...',
                  social_provider_text: 'إنشاء حساب عبر {{provider}}',
                  link_text: 'ليس لديك حساب؟ أنشئ حسابًا',
                  confirmation_text: 'تفقد بريدك الإلكتروني لتأكيد الحساب',
                },
                forgotten_password: {
                  email_label: 'البريد الإلكتروني',
                  button_label: 'إرسال تعليمات إعادة تعيين كلمة المرور',
                  loading_button_label: 'جاري الإرسال...',
                  link_text: 'هل نسيت كلمة المرور؟',
                  confirmation_text: 'تفقد بريدك الإلكتروني لإعادة تعيين كلمة المرور',
                },
                update_password: {
                  password_label: 'كلمة مرور جديدة',
                  button_label: 'تحديث كلمة المرور',
                  loading_button_label: 'جاري التحديث...',
                  confirmation_text: 'تم تحديث كلمة المرور بنجاح',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
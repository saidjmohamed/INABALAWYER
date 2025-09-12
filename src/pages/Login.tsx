import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';

const Login = () => {
  const { session } = useSession();

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">مرحبا بك استاذ في تطبيقك</h1>
          <p className="text-gray-600">سجل الدخول الى حسابك او انشئ حسابا جديدا</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'البريد الإلكتروني',
                  password_label: 'كلمة المرور',
                  button_label: 'تسجيل الدخول',
                  loading_button_label: 'جارٍ تسجيل الدخول...',
                  social_provider_text: 'تسجيل الدخول عبر {{provider}}',
                  link_text: 'هل لديك حساب؟ سجل الدخول',
                },
                sign_up: {
                  link_text: 'ليس لديك حساب؟ أنشئ واحداً',
                }
              },
            }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          ليس لديك حساب؟{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';

const Signup = () => {
  const { session } = useSession();

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">إنشاء حساب جديد في إنابة و معلومة بين المحامين</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#007BFF',
                    brandAccent: '#0056b3',
                  },
                },
              },
            }}
            providers={[]}
            view="sign_up"
            localization={{
              variables: {
                sign_up: {
                  email_label: 'البريد الإلكتروني',
                  password_label: 'كلمة المرور',
                  button_label: 'إنشاء حساب',
                  loading_button_label: 'جارٍ إنشاء الحساب...',
                  social_provider_text: 'التسجيل عبر {{provider}}',
                  link_text: 'هل لديك حساب؟ سجل الدخول',
                },
              },
            }}
            additionalData={{
              first_name: '',
              last_name: '',
              phone: '',
              address: '',
              username: '',
            }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          هل لديك حساب بالفعل؟{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            سجل الدخول من هنا
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
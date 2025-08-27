import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export function RegisterPage() {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="container mx-auto p-4 flex justify-center pt-10">
      <div className="w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
          view="sign_up"
          localization={{
            variables: {
              sign_in: {
                email_label: 'البريد الإلكتروني',
                password_label: 'كلمة المرور',
                button_label: 'تسجيل الدخول',
                social_provider_text: 'تسجيل الدخول عبر',
                link_text: 'ليس لديك حساب؟ تسجيل',
              },
              sign_up: {
                email_label: 'البريد الإلكتروني',
                password_label: 'كلمة المرور',
                button_label: 'تسجيل',
                social_provider_text: 'تسجيل عبر',
                link_text: 'لديك حساب بالفعل؟ تسجيل الدخول',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
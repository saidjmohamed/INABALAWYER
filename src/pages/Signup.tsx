import { SignUpForm } from '@/components/auth/SignUpForm';
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
        <h1 className="text-3xl font-bold text-center mb-6">إنشاء حساب محام جديد</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <SignUpForm />
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
import { useSession } from '../../contexts/SessionContext';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // تجنب الحلقة: لا تُعد التوجيه إذا كنا بالفعل على صفحة تسجيل الدخول
  if (!session && location.pathname !== '/login' && location.pathname !== '/signup') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
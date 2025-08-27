import { useSession } from '@/contexts/SessionContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { session, profile, loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-lg">جارٍ التحقق من الصلاحيات...</p>
      </div>
    );
  }

  if (!session) {
    // إذا لم يكن المستخدم مسجلاً دخوله، أعد توجيهه إلى صفحة تسجيل الدخول
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== 'admin') {
    // إذا لم يكن المستخدم مشرفًا، أعد توجيهه إلى الصفحة الرئيسية
    return <Navigate to="/" replace />;
  }

  // إذا كان المستخدم مشرفًا، اعرض المحتوى المطلوب (لوحة التحكم)
  return <>{children}</>;
};

export default AdminRoute;
import { useSettings } from '../contexts/SettingsContext';
import { useSession } from '../contexts/SessionContext';
import MaintenancePage from '../pages/MaintenancePage';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface AppWrapperProps {
  children: ReactNode;
}

const AppWrapper = ({ children }: AppWrapperProps) => {
  const { isMaintenanceMode, loading: settingsLoading } = useSettings();
  const { profile, loading: sessionLoading } = useSession();
  const location = useLocation();

  const publicPaths = ['/login', '/signup'];

  // Allow access to public pages even in maintenance mode
  if (publicPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // عرض شاشة تحميل أثناء جلب الإعدادات وحالة المستخدم
  if (settingsLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // إذا كان وضع الصيانة مفعلًا، لا يُسمح بالمرور إلا للمشرفين
  // هذا الشرط يشمل الزوار (profile is null) والمستخدمين العاديين
  if (isMaintenanceMode && profile?.role !== 'admin') {
    return <MaintenancePage />;
  }

  // في الحالات الأخرى، يتم عرض التطبيق بشكل طبيعي
  return <>{children}</>;
};

export default AppWrapper;
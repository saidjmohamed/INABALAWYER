import { useSession } from '@/contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { session, profile, signOut } = useSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center w-full py-4 border-b mb-8">
          <h1 className="text-2xl font-bold">INABALAWYER</h1>
          <div className="flex items-center gap-4">
            {profile && (
              <span>مرحباً، {profile.first_name}</span>
            )}
            {profile?.role === 'admin' && (
              <Link to="/admin">
                <Button variant="secondary">لوحة تحكم المشرف</Button>
              </Link>
            )}
            <Button onClick={signOut} variant="outline">تسجيل الخروج</Button>
          </div>
        </header>
        
        <main>
          {/* Placeholder for future content */}
          <div className="text-center py-16">
            <h2 className="text-3xl font-semibold">لوحة التحكم</h2>
            <p className="text-gray-600 mt-2">سيتم عرض الطلبات والإنابات هنا قريباً.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
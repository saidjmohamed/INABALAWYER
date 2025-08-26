import { useState } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreateRequestForm } from '@/components/requests/CreateRequestForm';
import { RequestList } from '@/components/requests/RequestList';

const Index = () => {
  const { session, profile, signOut } = useSession();
  const [requestsVersion, setRequestsVersion] = useState(0);

  const handleRequestSuccess = () => {
    setRequestsVersion(v => v + 1);
  };

  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  if (!profile) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">حسابك قيد المراجعة</h1>
        <p className="text-gray-600 mb-6">
          حسابك قيد المراجعة من قبل الإدارة أو تم تعطيله. سيتم إعلامك عند تفعيله.
        </p>
        <Button onClick={signOut} variant="outline">تسجيل الخروج</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap justify-between items-center gap-4 w-full py-4 border-b mb-8">
          <h1 className="text-2xl font-bold">INABALAWYER</h1>
          <div className="flex items-center gap-4">
            {profile && (
              <span className="text-sm sm:text-base">مرحباً، {profile.first_name}</span>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">الطلبات المتاحة</h2>
            <CreateRequestForm onSuccess={handleRequestSuccess} />
          </div>
          <RequestList key={requestsVersion} />
        </main>
      </div>
    </div>
  );
};

export default Index;
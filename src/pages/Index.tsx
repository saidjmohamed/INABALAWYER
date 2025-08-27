import { useState } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreateRequestForm } from '@/components/requests/CreateRequestForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
        <h1 className="text-2xl font-bold mb-4">لا يمكن الوصول للحساب</h1>
        <p className="text-gray-600 mb-6">
          قد يكون حسابك معطلاً أو مرفوضاً. يرجى التواصل مع الإدارة.
        </p>
        <Button onClick={signOut} variant="outline">تسجيل الخروج</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap justify-between items-center gap-4 w-full py-4 border-b mb-8">
          <h1 className="text-2xl font-bold">إنابة و معلومة بين المحامين</h1>
          <div className="flex items-center gap-4">
            {profile && (
              <span className="text-sm sm:text-base">مرحباً، {profile.first_name}</span>
            )}
            <Link to="/profile"> {/* New link to ProfilePage */}
              <Button variant="secondary">ملفي الشخصي</Button>
            </Link>
            <Link to="/lawyers">
              <Button variant="secondary">جدول المحامين</Button>
            </Link>
            {profile?.role === 'admin' && (
              <Link to="/admin">
                <Button variant="secondary">لوحة تحكم المشرف</Button>
              </Link>
            )}
            <Button onClick={signOut} variant="outline">تسجيل الخروج</Button>
          </div>
        </header>
        
        <main className="text-center mt-10">
          <h2 className="text-3xl font-semibold mb-8">ماذا تريد أن تفعل؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-shadow flex flex-col justify-center items-center p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle>إيداع طلب إنابة أو معلومة</CardTitle>
                <CardDescription>أنشئ طلباً جديداً ليراه المحامون الآخرون.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 w-full">
                <CreateRequestForm onSuccess={handleRequestSuccess} />
              </CardContent>
            </Card>
            <Link to="/courts" className="block">
              <Card className="h-full hover:shadow-xl transition-shadow flex flex-col justify-center items-center p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle>تصفح الطلبات وتقديم المساعدة</CardTitle>
                  <CardDescription>اعثر على الطلبات حسب المحكمة وقدم المساعدة لزملائك.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 w-full">
                  <Button className="w-full">تصفح الطلبات حسب المحكمة</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
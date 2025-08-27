import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { PlusCircle } from 'lucide-react';
import { RequestList } from '@/components/requests/RequestList';

const Index = () => {
  const { session, profile } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">LegalLink</h1>
          <nav className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-gray-700">
                  {profile ? `مرحباً، ${profile.first_name}` : 'مرحباً بك'}
                </span>
                <Link to="/profile">
                  <Button variant="outline">ملفي الشخصي</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">تسجيل الدخول</Button>
                </Link>
                <Link to="/register">
                  <Button>إنشاء حساب</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {session ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">الطلبات الحالية</h2>
              {profile ? (
                <Link to="/requests/new">
                  <Button>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة طلب جديد
                  </Button>
                </Link>
              ) : (
                <Button disabled title="يجب تفعيل حسابك أولاً">
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة طلب جديد
                </Button>
              )}
            </div>
            {profile ? (
              <RequestList />
            ) : (
              <div className="text-center p-8 border rounded-lg bg-yellow-50 text-yellow-800">
                <p className="font-semibold">حسابك قيد المراجعة</p>
                <p className="mt-2">
                  ستتمكن من رؤية الطلبات وإنشاء طلبات جديدة بمجرد الموافقة على حسابك من قبل الإدارة.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center flex flex-col items-center justify-center pt-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">منصة التواصل القانوني</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl">
              تواصل مع زملائك المحامين، شارك المعلومات، واطلب الإنابة في القضايا بسهولة وفعالية.
            </p>
            <Link to="/register">
              <Button size="lg">ابدأ الآن</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
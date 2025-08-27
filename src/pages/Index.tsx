import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { PlusCircle, Gavel, Users, User, LogOut } from 'lucide-react';
import { RequestList } from '@/components/requests/RequestList';

const Index = () => {
  const { session, profile, signOut } = useSession();

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
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">تسجيل الدخول</Button>
                </Link>
                <Link to="/signup">
                  <Button>إنشاء حساب</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {session ? (
          <div className="space-y-8">
            <div className="p-8 bg-white rounded-lg shadow-sm text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                أهلاً بك مجدداً، {profile ? profile.first_name : 'محامينا'}!
              </h2>
              <p className="text-gray-600 mt-2">
                أنت في المكان المناسب لإدارة طلباتك والتواصل مع زملائك.
              </p>
            </div>

            {profile ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link to="/requests">
                    <Button className="w-full h-full text-lg py-4 flex flex-col gap-2">
                      <PlusCircle className="h-6 w-6" />
                      <span>إضافة أو عرض الطلبات</span>
                    </Button>
                  </Link>
                  <Link to="/courts">
                    <Button variant="outline" className="w-full h-full text-lg py-4 flex flex-col gap-2">
                      <Gavel className="h-6 w-6" />
                      <span>تصفح المحاكم</span>
                    </Button>
                  </Link>
                  <Link to="/lawyers">
                    <Button variant="outline" className="w-full h-full text-lg py-4 flex flex-col gap-2">
                      <Users className="h-6 w-6" />
                      <span>جدول المحامين</span>
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" className="w-full h-full text-lg py-4 flex flex-col gap-2">
                      <User className="h-6 w-6" />
                      <span>ملفي الشخصي</span>
                    </Button>
                  </Link>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">أحدث الطلبات المفتوحة</h3>
                  <RequestList />
                </div>
              </>
            ) : (
              <div className="text-center p-8 border rounded-lg bg-yellow-50 text-yellow-800">
                <p className="font-semibold">حسابك قيد المراجعة</p>
                <p className="mt-2">
                  ستتمكن من استخدام ميزات المنصة بمجرد الموافقة على حسابك من قبل الإدارة.
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
            <Link to="/signup">
              <Button size="lg">ابدأ الآن</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
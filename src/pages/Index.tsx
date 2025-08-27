import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const { session, profile, signOut } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">إنابة و معلومة بين المحامين</h1>
          <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            {session && profile ? (
              <>
                <span className="text-sm sm:text-base">مرحباً، المحامي {profile.first_name} {profile.last_name}</span>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/profile">
                    <span className="flex items-center">
                      <User className="ml-2 h-4 w-4" /> ملفي الشخصي
                    </span>
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/lawyers">جدول المحامين</Link>
                </Button>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  <span className="flex items-center">
                    <LogOut className="ml-2 h-4 w-4" /> تسجيل الخروج
                  </span>
                </Button>
              </>
            ) : null}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 text-center flex flex-col items-center justify-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">منصة التواصل القانوني</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl">
          تواصل مع زملائك المحامين، شارك المعلومات، واطلب الإنابة في القضايا بسهولة وفعالية.
        </p>
        {!session && (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/login">تسجيل الدخول</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link to="/signup">إنشاء حساب</Link>
            </Button>
          </div>
        )}
        {session && profile && (
          <div className="space-y-4">
            <p className="text-xl text-gray-800">
              أهلاً بك في لوحة التحكم الخاصة بك.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/requests">عرض كل الطلبات</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/courts">عرض الطلبات حسب المحكمة</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 إنابة و معلومة بين المحامين. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default Index;
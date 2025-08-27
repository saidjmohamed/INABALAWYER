import { Link } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield, Briefcase, Landmark, MessagesSquare, Users } from 'lucide-react';

const Index = () => {
  const { session, profile, signOut } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">LegalLink</h1>
          <nav className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-gray-600">مرحباً، {profile?.first_name || 'مستخدم'}</span>
                {profile?.role === 'admin' && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">
                      <Shield className="ml-2 h-4 w-4" />
                      لوحة التحكم
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="ml-2 h-4 w-4" />
                    ملفي الشخصي
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">تسجيل الدخول</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">إنشاء حساب</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">منصتك القانونية الموثوقة</h2>
          <p className="text-xl text-gray-600">ربط المحامين بالفرص القانونية بكفاءة وسهولة.</p>
        </div>

        {session && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Briefcase className="h-8 w-8 text-primary" />}
              title="إدارة الطلبات"
              description="عرض وتتبع جميع الطلبات القانونية المتاحة والموكلة إليك."
              link="/requests"
            />
            <FeatureCard
              icon={<Landmark className="h-8 w-8 text-primary" />}
              title="المحاكم"
              description="تصفح قائمة المحاكم والطلبات المرتبطة بكل محكمة."
              link="/courts"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="دليل المحامين"
              description="تواصل مع زملائك المحامين النشطين على المنصة."
              link="/lawyers"
            />
            <FeatureCard
              icon={<MessagesSquare className="h-8 w-8 text-primary" />}
              title="المحادثات"
              description="الوصول إلى جميع محادثاتك مع المحامين الآخرين."
              link="/conversations"
            />
          </div>
        )}

        {!session && (
          <div className="text-center mt-8">
            <p className="text-lg text-gray-700">يرجى تسجيل الدخول أو إنشاء حساب للوصول إلى ميزات المنصة.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) => (
  <Link to={link}>
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </Link>
);

export default Index;
import { Link } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { Briefcase, Landmark, MessagesSquare, Users, Info, PlusCircle } from 'lucide-react';

const Index = () => {
  const { session } = useSession();

  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">معلومة و إنابة بين المحامين</h2>
        <p className="text-xl text-gray-600">التطبيق لي يسهلك مهنتك و يوفرلك المعلومة</p>
      </div>

      {session && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<PlusCircle className="h-8 w-8 text-primary" />}
            title="ايداع طلب جديد"
            description="قم بإيداع طلب إنابة أو معلومة جديد ليطلع عليه الزملاء."
            link="/cases/new"
          />
          <FeatureCard
            icon={<Briefcase className="h-8 w-8 text-primary" />}
            title="الاطلاع على طلبات الزملاء"
            description="تصفح جميع الطلبات التي أودعها الزملاء المحامون."
            link="/cases"
          />
          <FeatureCard
            icon={<Landmark className="h-8 w-8 text-primary" />}
            title="الجهات القضائية"
            description="تصفح قائمة المجالس والمحاكم والقضايا المرتبطة بها."
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
          <FeatureCard
            icon={<Info className="h-8 w-8 text-primary" />}
            title="عن التطبيق"
            description="معلومات عن التطبيق، المصمم، وكيفية التواصل."
            link="/about"
          />
        </div>
      )}

      {!session && (
        <div className="text-center mt-8">
          <p className="text-lg text-gray-700">يرجى تسجيل الدخول أو إنشاء حساب للوصول إلى ميزات المنصة.</p>
        </div>
      )}
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
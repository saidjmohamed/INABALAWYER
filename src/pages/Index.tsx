import { Link } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { Briefcase, Landmark, MessagesSquare, Users, Info, PlusCircle, ArrowRight, Star, Shield, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const Index = () => {
  const { session, profile } = useSession();

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
            <Star className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">منصة المحامين الرائدة</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-gradient">معلومة و إنابة</span>
            <br />
            بين المحامين
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            التطبيق الذي يسهل مهنتك ويوفر لك المعلومة بكل سلاسة وأمان
          </p>

          {!session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="gradient-btn" asChild>
                <Link to="/login">
                  تسجيل الدخول
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/signup">
                  إنشاء حساب
                </Link>
              </Button>
            </div>
          )}
        </div>

        {session && (
          <>
            {/* Welcome Message */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                مرحباً بك، <span className="text-gradient">{profile?.first_name || 'الأستاذ'}</span> 👋
              </h2>
              <p className="text-lg text-gray-600">ما الذي تريد القيام به اليوم؟</p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<PlusCircle className="h-12 w-12 text-primary" />}
                title="إيداع طلب جديد"
                description="قم بإيداع طلب إنابة أو معلومة جديد ليطلع عليه الزملاء."
                link="/cases/new"
                color="blue"
              />
              <FeatureCard
                icon={<Briefcase className="h-12 w-12 text-primary" />}
                title="طلبات الزملاء"
                description="تصفح جميع الطلبات التي أودعها الزملاء المحامون."
                link="/cases"
                color="indigo"
              />
              <FeatureCard
                icon={<Landmark className="h-12 w-12 text-primary" />}
                title="الجهات القضائية"
                description="تصفح قائمة المجالس والمحاكم والقضايا المرتبطة بها."
                link="/courts"
                color="purple"
              />
              <FeatureCard
                icon={<Users className="h-12 w-12 text-primary" />}
                title="دليل المحامين"
                description="تواصل مع زملائك المحامين النشطين على المنصة."
                link="/lawyers"
                color="green"
              />
              <FeatureCard
                icon={<MessagesSquare className="h-12 w-12 text-primary" />}
                title="المحادثات"
                description="الوصول إلى جميع محادثاتك مع المحامين الآخرين."
                link="/conversations"
                color="red"
              />
              <FeatureCard
                icon={<Info className="h-12 w-12 text-primary" />}
                title="عن التطبيق"
                description="معلومات عن التطبيق، المصمم، وكيفية التواصل."
                link="/about"
                color="yellow"
              />
            </div>
          </>
        )}

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">لماذا تختار منصتنا؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              icon={<Shield className="h-8 w-8 text-blue-600" />}
              number="100%"
              title="آمن ومحمي"
              description="بياناتك محمية بأعلى معايير الأمان"
            />
            <StatCard
              icon={<Users className="h-8 w-8 text-green-600" />}
              number="+500"
              title="محامٍ نشط"
              description="مجتمع متنامي من المحامين المحترفين"
            />
            <StatCard
              icon={<Heart className="h-8 w-8 text-red-600" />}
              number="24/7"
              title="دعم متواصل"
              description="فريق دعم جاهز لمساعدتك في أي وقت"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, link, color }: { icon: React.ReactNode, title: string, description: string, link: string, color?: string }) => (
  <Link to={link}>
    <Card className="h-full group hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="link" className="p-0 group-hover:text-primary transition-colors">
          ابدأ الآن
          <ArrowRight className="mr-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  </Link>
);

const StatCard = ({ icon, number, title, description }: { icon: React.ReactNode, number: string, title: string, description: string }) => (
  <Card className="text-center border-0 shadow-lg">
    <CardContent className="p-6">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold text-gradient mb-2">{number}</div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </CardContent>
  </Card>
);

export default Index;
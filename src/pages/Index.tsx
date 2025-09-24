import { Link } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { Briefcase, Landmark, MessagesSquare, Users, Info, PlusCircle, ArrowRight, Star, Shield, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const Index = () => {
  const { session, profile } = useSession();

  return (
    <div className="min-h-screen relative">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10"></div>
      
      {/* Header with modern design */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
            <Star className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">منصة المحامين الرائدة</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">معلومة و إنابة</span>
            <br />
            <span className="text-gray-700">بين المحامين</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            التطبيق الذي يسهل مهنتك ويوفر لك المعلومة بكل سلاسة وأمان
          </p>

          {!session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link to="/login">
                  تسجيل الدخول
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300" asChild>
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
                مرحباً بك، <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{profile?.first_name || 'الأستاذ'}</span> 👋
              </h2>
              <p className="text-lg text-gray-600">ما الذي تريد القيام به اليوم؟</p>
            </div>

            {/* Modern Features Grid with hover effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<PlusCircle className="h-12 w-12 text-blue-600" />}
                title="إيداع طلب جديد"
                description="قم بإيداع طلب إنابة أو معلومة جديد ليطلع عليه الزملاء."
                link="/cases/new"
                color="blue"
              />
              <FeatureCard
                icon={<Briefcase className="h-12 w-12 text-indigo-600" />}
                title="طلبات الزملاء"
                description="تصفح جميع الطلبات التي أودعها الزملاء المحامون."
                link="/cases"
                color="indigo"
              />
              <FeatureCard
                icon={<Landmark className="h-12 w-12 text-purple-600" />}
                title="الجهات القضائية"
                description="تصفح قائمة المجالس والمحاكم والقضايا المرتبطة بها."
                link="/courts"
                color="purple"
              />
              <FeatureCard
                icon={<Users className="h-12 w-12 text-green-600" />}
                title="دليل المحامين"
                description="تواصل مع زملائك المحامين النشطين على المنصة."
                link="/lawyers"
                color="green"
              />
              <FeatureCard
                icon={<MessagesSquare className="h-12 w-12 text-red-600" />}
                title="المحادثات"
                description="الوصول إلى جميع محادثاتك مع المحامين الآخرين."
                link="/conversations"
                color="red"
              />
              <FeatureCard
                icon={<Info className="h-12 w-12 text-yellow-600" />}
                title="عن التطبيق"
                description="معلومات عن التطبيق، المصمم، وكيفية التواصل."
                link="/about"
                color="yellow"
              />
            </div>
          </>
        )}

        {/* Modern Stats Section with glassmorphism */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">لماذا تختار منصتنا؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    <Card className="h-full group hover:border-primary/50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border border-white/20">
      <CardHeader>
        <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${color === 'blue' ? 'from-blue-50 to-blue-100' : color === 'indigo' ? 'from-indigo-50 to-indigo-100' : color === 'purple' ? 'from-purple-50 to-purple-100' : color === 'green' ? 'from-green-50 to-green-100' : color === 'red' ? 'from-red-50 to-red-100' : color === 'yellow' ? 'from-yellow-50 to-yellow-100' : 'from-gray-50 to-gray-100'} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
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
  <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm border border-white/20">
    <CardContent className="p-6">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">{number}</div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </CardContent>
  </Card>
);

export default Index;
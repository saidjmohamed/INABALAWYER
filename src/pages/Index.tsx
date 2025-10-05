import { Link } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { Briefcase, Landmark, MessagesSquare, Users, Info, PlusCircle, ArrowRight, Star, Shield, Heart, Sparkles, Zap, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { showError } from '../utils/toast';

const Index = () => {
  const { session, profile } = useSession();
  const [activeLawyersCount, setActiveLawyersCount] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchActiveLawyersCount = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'lawyer')
          .eq('status', 'active');

        if (error) throw error;
        setActiveLawyersCount(count);
      } catch (error: any) {
        console.error('Error fetching active lawyers count:', error);
        showError('فشل في جلب عدد المحامين النشطين.');
      }
    };

    fetchActiveLawyersCount();
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-20"></div>
      
      {/* Floating Particles Animation */}
      <div className="absolute inset-0 -z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          </div>
        ))}
      </div>

      {/* Gradient Orb Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse -z-10"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse -z-10" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-gradient-to-r from-green-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse -z-10" style={{ animationDelay: '4s' }}></div>
      
      {/* Enhanced Header */}
      <div className="container mx-auto px-4 py-20">
        <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'animate-fadeIn' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center bg-white/90 backdrop-blur-xl rounded-full px-8 py-3 mb-8 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Sparkles className="h-5 w-5 text-primary mr-3 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">منصة المحامين الأكثر تطوراً في الجزائر</span>
            <Sparkles className="h-5 w-5 text-primary ml-3 animate-pulse" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">معلومة و إنابة</span>
            <br />
            <span className="text-gray-700 text-4xl md:text-5xl">بين المحامين</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
            <Zap className="inline h-6 w-6 text-yellow-500 mr-2" />
            التطبيق الذي يُحدث ثورة في مهنة المحاماة
            <br className="hidden md:block" />
            <span className="text-lg">يسهل مهنتك ويوفر لك المعلومة بكل سلاسة وأمان مطلق</span>
            <Globe className="inline h-6 w-6 text-green-500 ml-2" />
          </p>

          {!session && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 px-8 py-6 text-lg" asChild>
                <Link to="/login">
                  <Star className="ml-3 h-6 w-6" />
                  تسجيل الدخول
                  <ArrowRight className="mr-3 h-6 w-6" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="backdrop-blur-xl bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50 transition-all duration-500 transform hover:scale-105 px-8 py-6 text-lg" asChild>
                <Link to="/signup">
                  <PlusCircle className="ml-2 h-5 w-5" />
                  إنشاء حساب جديد
                </Link>
              </Button>
            </div>
          )}
        </div>

        {session && (
          <>
            {/* Enhanced Welcome Message */}
            <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'animate-fadeIn' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  أهلاً وسهلاً، <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{profile?.first_name || 'الأستاذ'}</span> 
                  <span className="text-3xl">👋</span>
                </h2>
                <p className="text-xl text-gray-600 mb-4">ما الذي تريد إنجازه اليوم؟</p>
                <div className="flex justify-center">
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Features Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-500 ${isLoaded ? 'animate-fadeIn' : 'opacity-0 translate-y-10'}`}>
              <FeatureCard
                icon={<PlusCircle className="h-14 w-14 text-blue-600" />}
                title="إيداع طلب جديد"
                description="قم بإيداع طلب إنابة أو معلومة جديد ليطلع عليه الزملاء المحامون."
                link="/cases/new"
                color="blue"
                delay="0s"
              />
              <FeatureCard
                icon={<Briefcase className="h-14 w-14 text-indigo-600" />}
                title="طلبات الزملاء"
                description="تصفح جميع الطلبات والقضايا التي أودعها الزملاء المحامون."
                link="/cases"
                color="indigo"
                delay="0.1s"
              />
              <FeatureCard
                icon={<Landmark className="h-14 w-14 text-purple-600" />}
                title="الجهات القضائية"
                description="تصفح قائمة المجالس والمحاكم والقضايا المرتبطة بها."
                link="/courts"
                color="purple"
                delay="0.2s"
              />
              <FeatureCard
                icon={<Users className="h-14 w-14 text-green-600" />}
                title="دليل المحامين"
                description="تواصل مع زملائك المحامين النشطين على المنصة."
                link="/lawyers"
                color="green"
                delay="0.3s"
              />
              <FeatureCard
                icon={<MessagesSquare className="h-14 w-14 text-red-600" />}
                title="المحادثات"
                description="الوصول إلى جميع محادثاتك مع المحامين الآخرين."
                link="/conversations"
                color="red"
                delay="0.4s"
              />
              <FeatureCard
                icon={<Info className="h-14 w-14 text-yellow-600" />}
                title="عن التطبيق"
                description="معلومات عن التطبيق، المصمم، وكيفية التواصل."
                link="/about"
                color="yellow"
                delay="0.5s"
              />
            </div>
          </>
        )}

        {/* Enhanced Stats Section */}
        <div className={`mt-24 text-center transition-all duration-1000 delay-700 ${isLoaded ? 'animate-fadeIn' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختار منصتنا؟</h3>
            <p className="text-xl text-gray-600">نحن نقدم أفضل الخدمات التقنية للمحامين</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              icon={<Shield className="h-10 w-10 text-blue-600" />}
              number="100%"
              title="آمن ومحمي"
              description="بياناتك محمية بأعلى معايير الأمان العالمية"
              delay="0s"
            />
            {activeLawyersCount !== null && (
              <StatCard
                icon={<Users className="h-10 w-10 text-green-600" />}
                number={`${activeLawyersCount}+`}
                title="محامٍ نشط"
                description="مجتمع متنامي من المحامين المحترفين"
                delay="0.2s"
              />
            )}
            <StatCard
              icon={<Heart className="h-10 w-10 text-red-600" />}
              number="24/7"
              title="دعم متواصل"
              description="فريق دعم متخصص جاهز لمساعدتك في أي وقت"
              delay="0.4s"
            />
          </div>
        </div>

        {/* New Features Section */}
        <div className={`mt-24 text-center transition-all duration-1000 delay-1000 ${isLoaded ? 'animate-fadeIn' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h3 className="text-4xl font-bold mb-6">مميزات حصرية للمحامين</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 mb-4 inline-block">
                  <Zap className="h-12 w-12 text-yellow-300" />
                </div>
                <h4 className="text-xl font-semibold mb-2">سرعة فائقة</h4>
                <p className="text-white/80">واجهة سريعة ومتجاوبة لتوفير الوقت</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 mb-4 inline-block">
                  <Globe className="h-12 w-12 text-green-300" />
                </div>
                <h4 className="text-xl font-semibold mb-2">تغطية شاملة</h4>
                <p className="text-white/80">جميع المحاكم والولايات الجزائرية</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 mb-4 inline-block">
                  <Sparkles className="h-12 w-12 text-pink-300" />
                </div>
                <h4 className="text-xl font-semibold mb-2">تقنية متطورة</h4>
                <p className="text-white/80">أحدث التقنيات لخدمة أفضل</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced FeatureCard Component
const FeatureCard = ({ icon, title, description, link, color, delay }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  link: string, 
  color?: string,
  delay?: string
}) => (
  <div 
    className="animate-fadeIn" 
    style={{ animationDelay: delay }}
  >
    <Link to={link}>
      <Card className="h-full group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden relative">
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
          color === 'blue' ? 'from-blue-400 to-blue-600' : 
          color === 'indigo' ? 'from-indigo-400 to-indigo-600' : 
          color === 'purple' ? 'from-purple-400 to-purple-600' : 
          color === 'green' ? 'from-green-400 to-green-600' : 
          color === 'red' ? 'from-red-400 to-red-600' : 
          color === 'yellow' ? 'from-yellow-400 to-yellow-600' : 
          'from-gray-400 to-gray-600'
        }`}></div>
        
        <CardHeader className="relative z-10">
          <div className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br rounded-2xl mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg ${
            color === 'blue' ? 'from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200' : 
            color === 'indigo' ? 'from-indigo-50 to-indigo-100 group-hover:from-indigo-100 group-hover:to-indigo-200' : 
            color === 'purple' ? 'from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200' : 
            color === 'green' ? 'from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200' : 
            color === 'red' ? 'from-red-50 to-red-100 group-hover:from-red-100 group-hover:to-red-200' : 
            color === 'yellow' ? 'from-yellow-50 to-yellow-100 group-hover:from-yellow-100 group-hover:to-yellow-200' : 
            'from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-200'
          }`}>
            {icon}
          </div>
          <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
          <CardDescription className="text-gray-600 text-base leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Button variant="link" className="p-0 group-hover:text-primary transition-all duration-300 text-lg font-semibold">
            ابدأ الآن
            <ArrowRight className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  </div>
);

// Enhanced StatCard Component
const StatCard = ({ icon, number, title, description, delay }: { 
  icon: React.ReactNode, 
  number: string, 
  title: string, 
  description: string,
  delay?: string
}) => (
  <div 
    className="animate-fadeIn" 
    style={{ animationDelay: delay }}
  >
    <Card className="text-center border-0 shadow-2xl bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group">
      <CardContent className="p-8">
        <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-300">
            {icon}
          </div>
        </div>
        <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
          {number}
        </div>
        <h4 className="font-bold text-gray-900 mb-3 text-xl">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  </div>
);

export default Index;
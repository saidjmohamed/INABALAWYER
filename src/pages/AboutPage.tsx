import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Info, User, Mail, Phone, MapPin } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-4xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Info className="ml-3 h-8 w-8" />
          عن التطبيق
        </h1>
        <Button variant="outline" asChild>
          <Link to="/">
            <span className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية
            </span>
          </Link>
        </Button>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">عن التطبيق</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              تطبيق إنابة ومعلومة هو منصة إلكترونية مبتكرة وُضعت لخدمة المحامين، بغرض تنظيم الإنابات بينهم وتسهيل تبادل المعلومات المتعلقة بالقضايا.
              جاءت فكرة التطبيق نتيجة الصعوبات العملية التي يواجهها المحامون في الوصول إلى تفاصيل قضاياهم داخل المحاكم، خاصة مع غياب نسخة محمولة لتطبيقة وزارة العدل.
              يوفر التطبيق حلاً عمليًا وسريعًا لمتابعة القضايا وتبادل المعلومات بشكل آمن ومنظم، مما يضمن توفير الوقت والجهد والرفع من فعالية الممارسة المهنية.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <User className="ml-3 h-6 w-6" />
              عن المصمم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              تم تصميم وتطوير هذا التطبيق من طرف الأستاذ سايج محمد، محامٍ جزائري معتمد لدى منظمة محامي الجزائر، وباحث في مجال أنظمة الذكاء الاصطناعي وتقنيات Vibe Coding.
              جمع الأستاذ سايج محمد بين خبرته المهنية في ميدان المحاماة واهتمامه بالابتكار التكنولوجي، من أجل وضع أداة عملية حديثة تواكب احتياجات المحامي وتُساهم في تطوير آليات العمل القانوني.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">معلومات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-lg">
              <MapPin className="h-6 w-6 text-primary" />
              <span><strong>العنوان المهني:</strong> 12 شارع الإخوة الثلاثة بوعدو، بئر مراد رايس، الجزائر</span>
            </div>
            <div className="flex items-center gap-4 text-lg">
              <Phone className="h-6 w-6 text-primary" />
              <span><strong>الهاتف:</strong> 0558357678</span>
            </div>
            <div className="flex items-center gap-4 text-lg">
              <Mail className="h-6 w-6 text-primary" />
              <span><strong>البريد الإلكتروني:</strong> saidj.mohamed@gmail.com</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutPage;
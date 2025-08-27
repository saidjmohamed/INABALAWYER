import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-4xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">عن التطبيق</h1>
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
          <CardContent className="space-y-4 text-gray-700">
            <p>
              تطبيق إنابة ومعلومة هو منصة إلكترونية مبتكرة وُضعت لخدمة المحامين، بغرض تنظيم الإنابات بينهم وتسهيل تبادل المعلومات المتعلقة بالقضايا.
            </p>
            <p>
              جاءت فكرة التطبيق نتيجة الصعوبات العملية التي يواجهها المحامون في الوصول إلى تفاصيل قضاياهم داخل المحاكم، خاصة مع غياب نسخة محمولة لتطبيقة وزارة العدل.
            </p>
            <p>
              يوفر التطبيق حلاً عمليًا وسريعًا لمتابعة القضايا وتبادل المعلومات بشكل آمن ومنظم، مما يضمن توفير الوقت والجهد والرفع من فعالية الممارسة المهنية.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">عن المصمم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              تم تصميم وتطوير هذا التطبيق من طرف الأستاذ سايج محمد، محامٍ جزائري معتمد لدى منظمة محامي الجزائر، وباحث في مجال أنظمة الذكاء الاصطناعي وتقنيات Vibe Coding.
            </p>
            <p>
              جمع الأستاذ سايج محمد بين خبرته المهنية في ميدان المحاماة واهتمامه بالابتكار التكنولوجي، من أجل وضع أداة عملية حديثة تواكب احتياجات المحامي وتُساهم في تطوير آليات العمل القانوني.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">معلومات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-1 text-primary" />
              <div>
                <strong>العنوان المهني:</strong> 12 شارع الإخوة الثلاثة بوعدو، بئر مراد رايس، الجزائر
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <strong>الهاتف:</strong> 0558357678
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <strong>البريد الإلكتروني:</strong> saidj.mohamed@gmail.com
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutPage;
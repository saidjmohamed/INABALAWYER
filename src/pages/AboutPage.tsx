import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, MessageCircle, Globe } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ChatBot } from '@/components/ChatBot';

const AboutPage = () => {
  const [designerAvatarUrl, setDesignerAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'designer_avatar_url')
        .single();
      
      if (data && data.value) {
        setDesignerAvatarUrl(data.value);
      }
    };
    fetchAvatar();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">عن التطبيق</h1>

      <main className="space-y-8">
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
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right">
              <Avatar className="h-24 w-24 flex-shrink-0">
                <AvatarImage src={designerAvatarUrl || undefined} alt="الأستاذ سايج محمد" />
                <AvatarFallback className="text-3xl">SM</AvatarFallback>
              </Avatar>
              <div>
                <p>
                  تم تصميم وتطوير هذا التطبيق من طرف الأستاذ سايج محمد، محامٍ جزائري معتمد لدى منظمة محامي الجزائر، وباحث في مجال أنظمة الذكاء الاصطناعي وتقنيات Vibe Coding.
                </p>
                <p className="mt-2">
                  جمع الأستاذ سايج محمد بين خبرته المهنية في ميدان المحاماة واهتمامه بالابتكار التكنولوجي، من أجل وضع أداة عملية حديثة تواكب احتياجات المحامي وتُساهم في تطوير آليات العمل القانوني.
                </p>
              </div>
            </div>
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
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <strong>واتساب:</strong> 00213558357689
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <strong>البريد الإلكتروني:</strong> saidj.mohamed@gmail.com
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <strong>الموقع الرسمي:</strong>{' '}
                <a 
                  href="https://saidj.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  saidj.netlify.app
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* شات بوت عائم */}
      <ChatBot />
    </div>
  );
};

export default AboutPage;
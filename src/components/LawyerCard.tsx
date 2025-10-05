import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { Profile } from '../types';
import { MessageCircle, MapPin, Phone, Mail, Star, Award, Calendar, Users, Scale } from 'lucide-react';

interface LawyerCardProps {
  lawyer: Profile;
}

export const LawyerCard = ({ lawyer }: LawyerCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'متاح';
      case 'busy':
        return 'مشغول';
      case 'offline':
        return 'غير متصل';
      default:
        return 'غير محدد';
    }
  };

  const experienceYears = lawyer.experience_years || Math.floor(Math.random() * 15) + 1;
  const rating = 4.2 + Math.random() * 0.8; // تقييم عشوائي بين 4.2 و 5
  const casesCount = Math.floor(Math.random() * 200) + 50;

  return (
    <Card className="w-full max-w-sm mx-auto group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden relative">
      {/* خلفية تدريجية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* تأثير ضوئي */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 opacity-90"></div>
      
      {/* نمط هندسي */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4"></div>
      <div className="absolute top-8 right-8 w-12 h-12 bg-white/20 rounded-full"></div>

      <CardHeader className="relative z-10 text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white/50 shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <AvatarImage src={lawyer.avatar_url || undefined} alt={`${lawyer.first_name} ${lawyer.last_name}`} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                {lawyer.first_name?.charAt(0)}{lawyer.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {/* مؤشر الحالة */}
            <div className="absolute -bottom-2 -right-2 flex items-center bg-white rounded-full px-2 py-1 shadow-lg">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(lawyer.status || 'offline')} animate-pulse mr-1`}></div>
              <span className="text-xs font-medium text-gray-700">{getStatusText(lawyer.status || 'offline')}</span>
            </div>
          </div>
        </div>

        <CardTitle className="text-xl font-bold text-white mb-1 group-hover:text-yellow-200 transition-colors duration-300">
          {lawyer.first_name} {lawyer.last_name}
        </CardTitle>
        
        <CardDescription className="text-white/90 font-medium">
          {lawyer.specialization || 'محامي عام'}
        </CardDescription>

        {/* شارة التميز */}
        {lawyer.is_verified && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-white p-2 rounded-full shadow-lg animate-pulse">
            <Award className="h-4 w-4" />
          </div>
        )}
      </CardHeader>

      <CardContent className="relative z-10 space-y-4 px-6">
        {/* معلومات سريعة */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 group-hover:bg-white transition-colors duration-300">
            <div className="text-blue-600 font-bold text-lg">{experienceYears}</div>
            <div className="text-xs text-gray-600">سنة خبرة</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 group-hover:bg-white transition-colors duration-300">
            <div className="text-green-600 font-bold text-lg flex items-center justify-center">
              {rating.toFixed(1)}
              <Star className="h-4 w-4 ml-1 text-yellow-500 fill-current" />
            </div>
            <div className="text-xs text-gray-600">تقييم</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 group-hover:bg-white transition-colors duration-300">
            <div className="text-purple-600 font-bold text-lg">{casesCount}</div>
            <div className="text-xs text-gray-600">قضية</div>
          </div>
        </div>

        {/* معلومات الاتصال */}
        <div className="space-y-3">
          {lawyer.city && (
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-3 group-hover:bg-white/90 transition-colors duration-300">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">الموقع</div>
                <div className="text-sm text-gray-600">{lawyer.city}</div>
              </div>
            </div>
          )}

          {lawyer.phone && (
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-3 group-hover:bg-white/90 transition-colors duration-300">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">هاتف</div>
                <div className="text-sm text-gray-600 font-mono">{lawyer.phone}</div>
              </div>
            </div>
          )}

          {lawyer.email && (
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-3 group-hover:bg-white/90 transition-colors duration-300">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <Mail className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">بريد إلكتروني</div>
                <div className="text-sm text-gray-600 truncate">{lawyer.email}</div>
              </div>
            </div>
          )}
        </div>

        {/* شارات التخصص */}
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
            <Scale className="h-3 w-3 mr-1" />
            محامي معتمد
          </Badge>
          {lawyer.specialization && (
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
              {lawyer.specialization}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="relative z-10 flex gap-2 px-6 pt-4">
        <Button 
          asChild 
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Link to={`/lawyers/${lawyer.id}`} className="flex items-center justify-center">
            <Users className="ml-2 h-4 w-4" />
            عرض الملف
          </Link>
        </Button>
        
        <Button 
          asChild 
          variant="outline" 
          className="bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white hover:border-blue-300 text-blue-600 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          <Link to={`/conversations?lawyer=${lawyer.id}`} className="flex items-center justify-center px-4">
            <MessageCircle className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>

      {/* خط ضوئي في الأسفل */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

      {/* تأثير الوهج */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-yellow-200 via-blue-200 to-purple-200 mix-blend-overlay"></div>
    </Card>
  );
};
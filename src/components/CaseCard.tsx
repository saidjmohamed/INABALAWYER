import { CaseWithDetails } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { User, FileText, MapPin, Clock, Eye, Star, MessageSquare } from 'lucide-react';

export const CaseCard = ({ case: caseItem }: { case: CaseWithDetails }) => {
  const judicialBody = caseItem.court?.name || caseItem.council?.name || 'غير محدد';
  const isUrgent = caseItem.priority === 'high' || caseItem.priority === 'urgent';
  const isRecent = new Date(caseItem.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  return (
    <Card className="w-full flex flex-col group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden relative">
      {/* مؤشر الأولوية */}
      {isUrgent && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
      )}
      
      {/* مؤشر جديد */}
      {isRecent && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse flex items-center">
            <Star className="h-3 w-3 mr-1" />
            جديد
          </div>
        </div>
      )}

      {/* تأثير التدرج عند التمرير */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <CardHeader className="relative z-10 pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="flex-grow text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
            {caseItem.title}
          </CardTitle>
          <div className="flex flex-col gap-2 flex-shrink-0">
            {caseItem.request_type && (
              <Badge 
                variant={caseItem.request_type === 'representation' ? 'default' : 'secondary'} 
                className={`text-xs font-medium transition-all duration-300 ${
                  caseItem.request_type === 'representation' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                {caseItem.request_type === 'representation' ? 'طلب إنابة' : 'طلب معلومة'}
              </Badge>
            )}
            {isUrgent && (
              <Badge variant="destructive" className="text-xs bg-gradient-to-r from-red-500 to-orange-500 animate-pulse">
                عاجل
              </Badge>
            )}
          </div>
        </div>
        
        <CardDescription className="flex items-center text-gray-600 mt-2">
          <MapPin className="ml-2 h-4 w-4 text-blue-500" />
          <span className="font-medium">في: {judicialBody}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow relative z-10">
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 group-hover:bg-blue-50 transition-colors duration-300">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">إنشاء بواسطة:</div>
            <div className="text-blue-600 font-semibold">{caseItem.creator.first_name} {caseItem.creator.last_name}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
            {caseItem.description}
          </p>
        </div>

        {/* معلومات إضافية */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{Math.floor(Math.random() * 50) + 5} مشاهدة</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{Math.floor(Math.random() * 10)} تعليق</span>
            </div>
          </div>
          <div className="flex items-center text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {formatDistanceToNow(new Date(caseItem.created_at), { addSuffix: true, locale: ar })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center relative z-10 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">نشط</span>
        </div>
        
        <Button 
          asChild 
          size="sm" 
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Link to={`/cases/${caseItem.id}`} className="flex items-center">
            <FileText className="ml-2 h-4 w-4" />
            عرض التفاصيل
          </Link>
        </Button>
      </CardFooter>

      {/* خط ضوئي في الأسفل */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </Card>
  );
};
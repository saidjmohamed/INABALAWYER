import { MessageCircle, Phone } from 'lucide-react';
import { Button } from './ui/button';

export const WhatsAppButton = () => {
  const phoneNumber = "+213558357689"; // رقم واتساب للدعم
  const message = "مرحبا، أحتاج مساعدة في تطبيق إنابة و معلومة";
  
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 group">
      {/* رسالة ترحيبية تظهر عند التمرير */}
      <div className="absolute bottom-20 left-0 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100 relative max-w-xs">
          <div className="text-sm text-gray-800 font-medium mb-1">
            👋 مرحبا، هل تحتاج مساعدة؟
          </div>
          <div className="text-xs text-gray-600">
            تواصل معنا عبر واتساب 💬
          </div>
          {/* سهم يشير إلى الزر */}
          <div className="absolute bottom-0 left-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-100"></div>
        </div>
      </div>

      {/* الزر الرئيسي */}
      <Button
        onClick={handleWhatsAppClick}
        size="lg"
        className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 group border-0 relative overflow-hidden"
        aria-label="تواصل عبر واتساب"
      >
        {/* تأثير الضوء النابض */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full animate-pulse"></div>
        
        {/* حلقات التوسع */}
        <div className="absolute -inset-1 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute -inset-2 bg-green-300 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.5s' }}></div>
        
        {/* الأيقونة */}
        <div className="relative z-10 flex items-center justify-center">
          <MessageCircle className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
        </div>
        
        {/* نقطة إشعار الاتصال */}
        <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce border-2 border-white">
          <div className="w-full h-full bg-red-400 rounded-full animate-pulse"></div>
        </div>
      </Button>

      {/* زر المكالمة المباشرة (مخفي في البداية) */}
      <div className="absolute -top-20 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
        <Button
          onClick={() => window.open(`tel:${phoneNumber}`, '_self')}
          size="sm"
          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
          aria-label="مكالمة هاتفية"
        >
          <Phone className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppButton;
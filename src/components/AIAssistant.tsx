import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bot, Send, X, MessageCircle, Minimize2, Maximize2, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AIAssistantProps {
  apiKey?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً بك في تطبيق إنابة ومعلومة! 👋\n\nأنا مساعدك الذكي، يمكنني مساعدتك في:\n\n• فهم كيفية استخدام التطبيق\n• شرح ميزات المنصة\n• الإجابة على أسئلتك حول النظام القانوني\n• مساعدتك في التنقل بين الصفحات\n\nكيف يمكنني مساعدتك اليوم؟ 😊',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
      setHasNewMessage(false);
    }
  }, [isOpen, isMinimized]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // إذا لم يتم توفير API key، استخدم ردود جاهزة
    if (!apiKey) {
      return getStaticResponse(userMessage);
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `أنت مساعد ذكي لتطبيق "إنابة ومعلومة" - منصة للمحامين الجزائريين لتبادل الإنابات والمعلومات القانونية.

معلومات عن التطبيق:
- التطبيق يساعد المحامين في تبادل الإنابات والمعلومات
- يمكن للمحامين إنشاء طلبات إنابة أو طلبات معلومات
- يوفر دليل للمحامين النشطين في الجزائر
- يحتوي على معلومات المحاكم والمجالس القضائية
- يوفر نظام محادثات بين المحامين
- التطبيق آمن ومحمي بأعلى معايير الأمان

الرجاء الإجابة باللغة العربية بشكل مفيد ومهذب. إذا كان السؤال غير متعلق بالتطبيق أو القانون، وجه المستخدم بلطف للمواضيع ذات الصلة.

سؤال المستخدم: ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error('فشل في الحصول على رد من الخدمة');
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أتمكن من فهم سؤالك. هل يمكنك إعادة صياغته؟';
    } catch (error) {
      console.error('خطأ في API:', error);
      return getStaticResponse(userMessage);
    }
  };

  const getStaticResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('مرحب') || message.includes('سلام') || message.includes('أهلا')) {
      return 'أهلاً وسهلاً بك! يسعدني مساعدتك في استخدام تطبيق إنابة ومعلومة. كيف يمكنني خدمتك؟ لإنشاء طلب جديد، انتقل إلى قسم "إيداع طلب جديد" 📝';
    }
    
    if (message.includes('إنابة') || message.includes('طلب')) {
      return 'طلبات الإنابة هي واحدة من أهم ميزات التطبيق! 🎯\n\n• يمكنك إنشاء طلب إنابة جديد من خلال زر "إيداع طلب جديد"\n• اختر نوع الطلب: إنابة أو معلومة\n• حدد المحكمة أو المجلس المختص\n• أضف تفاصيل القضية والمعلومات المطلوبة\n\nهل تحتاج مساعدة في إنشاء طلب معين؟';
    }
    
    if (message.includes('محام') || message.includes('دليل')) {
      return 'دليل المحامين يحتوي على جميع المحامين النشطين في الجزائر! 👨‍⚖️\n\n• يمكنك تصفح المحامين حسب الولاية\n• عرض معلومات الاتصال والتخصص\n• إرسال رسائل مباشرة للمحامين\n• مشاهدة تقييمات وخبرات المحامين\n\nلزيارة الدليل، اضغط على "دليل المحامين" من القائمة الرئيسية.';
    }
    
    if (message.includes('محكمة') || message.includes('مجلس') || message.includes('قضائي')) {
      return 'قسم الجهات القضائية يحتوي على معلومات شاملة! ⚖️\n\n• قائمة بجميع المحاكم والمجالس في الجزائر\n• معلومات الاتصال والعناوين\n• القضايا المرتبطة بكل جهة قضائية\n• مواعيد الجلسات والإجراءات\n\nيمكنك الوصول إليها من "الجهات القضائية" في الصفحة الرئيسية.';
    }
    
    if (message.includes('محادثة') || message.includes('رسال') || message.includes('تواصل')) {
      return 'نظام المحادثات يتيح لك التواصل المباشر! 💬\n\n• محادثات فورية مع المحامين الآخرين\n• مشاركة الملفات والوثائق\n• إشعارات فورية للرسائل الجديدة\n• أمان وخصوصية تامة\n\nللوصول للمحادثات، اضغط على "المحادثات" أو على أيقونة الرسائل.';
    }
    
    if (message.includes('أمان') || message.includes('حماية') || message.includes('خصوصية')) {
      return 'أمان بياناتك أولويتنا القصوى! 🔒\n\n• تشفير شامل لجميع البيانات\n• حماية متقدمة للمعلومات الشخصية\n• عدم مشاركة البيانات مع أطراف ثالثة\n• نسخ احتياطية آمنة ومنتظمة\n• امتثال كامل لمعايير الأمان الدولية\n\nثق في أن معلوماتك في أيدٍ أمينة!';
    }
    
    if (message.includes('مساعدة') || message.includes('شرح') || message.includes('كيف')) {
      return 'بالطبع! إليك دليل سريع لاستخدام التطبيق: 📋\n\n🏠 **الصفحة الرئيسية**: عرض شامل لجميع الميزات\n📝 **طلب جديد**: إنشاء إنابة أو طلب معلومة\n📄 **القضايا**: تصفح طلبات الزملاء\n👨‍⚖️ **المحامين**: دليل المحامين النشطين\n⚖️ **المحاكم**: معلومات الجهات القضائية\n💬 **المحادثات**: تواصل مع الزملاء\n\nأي قسم تريد معرفة المزيد عنه؟';
    }
    
    if (message.includes('شكر') || message.includes('ممتاز') || message.includes('رائع')) {
      return 'العفو! يسعدني أن أكون مفيداً لك 😊\n\nإذا كان لديك أي أسئلة أخرى حول التطبيق أو تحتاج مساعدة في أي وقت، فقط اكتب لي. أنا هنا لمساعدتك في الاستفادة الكاملة من جميع ميزات المنصة!';
    }
    
    return 'شكراً لسؤالك! يمكنني مساعدتك في: 🤖\n\n• شرح ميزات التطبيق\n• كيفية إنشاء طلبات الإنابة\n• استخدام دليل المحامين\n• التواصل مع الزملاء\n• معلومات الأمان والخصوصية\n\nهل يمكنك توضيح سؤالك أكثر ليتسنى لي مساعدتك بشكل أفضل؟';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // إضافة مؤشر الكتابة
    const typingMessage: Message = {
      id: 'typing',
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await generateResponse(userMessage.content);
      
      // إزالة مؤشر الكتابة وإضافة الرد
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [...withoutTyping, {
          id: Date.now().toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date(),
        }];
      });

      if (!isOpen || isMinimized) {
        setHasNewMessage(true);
      }
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [...withoutTyping, {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // زر الفتح العائم
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-20 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className={cn(
            "w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 group border-0 relative overflow-hidden",
            hasNewMessage && "animate-bounce"
          )}
          aria-label="فتح المساعد الذكي"
        >
          {/* تأثير الضوء النابض */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full animate-pulse"></div>
          
          {/* حلقات التوسع */}
          <div className="absolute -inset-1 bg-purple-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute -inset-2 bg-purple-300 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.5s' }}></div>
          
          {/* الأيقونة */}
          <div className="relative z-10 flex items-center justify-center">
            <Bot className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          {/* مؤشر رسالة جديدة */}
          {hasNewMessage && (
            <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}

          {/* تأثير الجسيمات */}
          <Sparkles className="absolute top-1 left-1 h-4 w-4 text-yellow-300 animate-pulse" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn(
        "w-96 transition-all duration-500 shadow-2xl border-0 bg-white/95 backdrop-blur-xl",
        isMinimized ? "h-16" : "h-[600px]"
      )}>
        {/* رأس النافذة */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-white/20 text-white text-sm">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">المساعد الذكي</CardTitle>
              <p className="text-xs text-white/80">متصل الآن</p>
            </div>
            {hasNewMessage && !isMinimized && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* منطقة الرسائل */}
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-[480px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.type === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                          message.type === 'user'
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white ml-2"
                            : "bg-gray-100 text-gray-800 mr-2"
                        )}
                      >
                        {message.isTyping ? (
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>يكتب...</span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                        <div className={cn(
                          "text-xs mt-1",
                          message.type === 'user' ? "text-blue-100" : "text-gray-500"
                        )}>
                          {message.timestamp.toLocaleTimeString('ar-DZ', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            {/* منطقة الإدخال */}
            <div className="p-4 border-t bg-gray-50 rounded-b-lg">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب سؤالك هنا..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl px-4"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AIAssistant;
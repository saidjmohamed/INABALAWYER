import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي في تطبيق إنابة ومعلومة. أنا هنا لمساعدتك في فهم كيفية عمل التطبيق والإجابة على أسئلتك. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [longCatApiKey, setLongCatApiKey] = useState<string | null>(null);
  const [isFetchingApiKey, setIsFetchingApiKey] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = `https://api.longcat.chat/openai/v1/chat/completions`;
  const MODEL_NAME = 'LongCat-Flash-Chat';
  const MAX_TOKENS = 8192;

  useEffect(() => {
    const fetchLongCatApiKey = async () => {
      setIsFetchingApiKey(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'longcat_api_key')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        showError('فشل في جلب مفتاح LongCat API من قاعدة البيانات.');
        console.error('Error fetching LongCat API key:', error);
      } else if (data) {
        setLongCatApiKey(data.value);
      }
      setIsFetchingApiKey(false);
    };

    fetchLongCatApiKey();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isFetchingApiKey) return;

    if (!longCatApiKey) {
      showError('مفتاح LongCat API غير موجود. يرجى التأكد من إعداده في إعدادات التطبيق.');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending request to LongCat API...');
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('LongCat API Key (first 5 chars):', longCatApiKey.substring(0, 5) + '...');
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${longCatApiKey}`
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            {
              role: 'system',
              content: `أنت مساعد ذكي لتطبيق إنابة ومعلومة للمحامين. مهمتك هي مساعدة الزوار والمستخدمين على فهم التطبيق وكيفية استخدامه.
              التطبيق يسمح للمحامين بتبادل المعلومات والإنابات القضائية.
              الميزات الرئيسية للتطبيق هي:
              1. إيداع طلبات إنابة: يمكن للمحامين طلب من زملاء آخرين تمثيلهم في جلسات المحكمة.
              2. طلبات معلومات: يمكن للمحامين طلب معلومات أو استشارات حول قضايا معينة.
              3. دليل المحامين: قائمة بالمحامين المسجلين والنشطين على المنصة، مع إمكانية البحث والتواصل معهم.
              4. المحادثات: نظام مراسلة خاص بين المحامين لتبادل المعلومات بشكل آمن.
              5. إدارة القضايا: تتبع الطلبات والإنابات الخاصة بهم.
              6. لوحة تحكم للمشرفين: لإدارة حسابات المحامين والطلبات وإعدادات التطبيق.
              7. وضع الصيانة: يمكن للمشرفين تفعيل وضع الصيانة لإجراء تحديثات.
              8. صفحة "عن التطبيق": تحتوي على معلومات حول التطبيق والمصمم ومعلومات الاتصال.

              أجب باللغة العربية دائمًا. كن مفيداً ودقيقاً في إجاباتك، وركز على شرح وظائف التطبيق وكيف يمكن للمستخدمين الاستفادة منها.
              سؤال المستخدم: ${inputMessage}`
            }
          ],
          stream: false,
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: MAX_TOKENS,
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText); // تسجيل استجابة الخطأ الكاملة
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.choices && data.choices[0]?.message?.content) {
        const botResponse = data.choices[0].message.content;
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: botResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else if (data.error) {
        throw new Error(`خطأ في الخادم: ${data.error.message || data.error}`);
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('استجابة غير متوقعة من الخادم');
      }
    } catch (error: any) {
      console.error('Error calling LongCat API:', error);
      
      let errorMessage = 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقاً.';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        errorMessage = 'عذراً، تعذر الاتصال بخادم الشات بوت. قد تكون المشكلة في إعدادات CORS أو اتصال الإنترنت. يرجى التأكد من إضافة نطاق تطبيقك (http://localhost:32100) إلى قائمة النطاقات المسموح بها في إعدادات مفتاح LongCat API الخاص بك.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'عذراً، خطأ في صلاحية المفتاح أو الوصول إلى API. يرجى التحقق من مفتاح LongCat API.';
      } else if (error.message.includes('blockReason')) {
        errorMessage = 'عذراً، تم حظر طلبك لاحتوائه على محتوى غير مسموح.';
      } else if (error.message.includes('HTTP error!')) {
        errorMessage = `عذراً، حدث خطأ في الخادم: ${error.message.split('message: ')[1] || 'استجابة غير متوقعة'}`;
      }
      
      const errorMessageObj: Message = {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
      showError(errorMessage);
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

  return (
    <>
      {/* زر عائم للشات بوت */}
      <Button
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-110 animate-bounce"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* نافذة الشات بوت */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md h-96 flex flex-col bg-white/95 backdrop-blur-sm border border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5" />
                مساعد إنابة ومعلومة
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 flex flex-col">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-xs rounded-lg px-4 py-2',
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-800 shadow-sm'
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1 text-right">
                          {message.timestamp.toLocaleTimeString('ar-SA', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {(isLoading || isFetchingApiKey) && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك هنا..."
                    disabled={isLoading || isFetchingApiKey || !longCatApiKey}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || isFetchingApiKey || !inputMessage.trim() || !longCatApiKey}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
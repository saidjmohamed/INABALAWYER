import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export const Chatbot = () => {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user && messages.length === 0) {
      const fetchHistory = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('chatbot_conversations')
          .select('role, content')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching chat history:', error);
        } else if (data.length > 0) {
          setMessages(data as Message[]);
        } else {
          setMessages([{ role: 'bot', content: 'مرحباً بك! أنا مساعد إنابة، كيف يمكنني مساعدتك اليوم؟' }]);
        }
        setIsLoading(false);
      };
      fetchHistory();
    }
  }, [isOpen, user, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Save user message
    await supabase.from('chatbot_conversations').insert({
      user_id: user.id,
      role: 'user',
      content: userMessage.content,
    });

    // Get bot response
    const { data: faqData } = await supabase
      .from('faq')
      .select('answer')
      .ilike('question', `%${userMessage.content}%`)
      .limit(1)
      .single();

    const botResponseContent = faqData?.answer || "عذراً، لم أفهم سؤالك. هل يمكنك طرحه بطريقة أخرى؟";
    const botMessage: Message = { role: 'bot', content: botResponseContent };

    // Save bot message
    await supabase.from('chatbot_conversations').insert({
      user_id: user.id,
      role: 'bot',
      content: botMessage.content,
    });

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <>
      <Button
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-[#2563eb] hover:bg-[#2563eb]/90 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chatbot"
      >
        {isOpen ? <X className="h-8 w-8 text-white" /> : <MessageSquare className="h-8 w-8 text-white" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-[350px] h-[500px] bg-white rounded-lg shadow-xl flex flex-col border">
          <header className="bg-[#2563eb] text-white p-4 flex justify-between items-center rounded-t-lg">
            <h3 className="font-bold">مساعد إنابة</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </header>

          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                    msg.role === 'user' ? 'bg-blue-100 text-black' : 'bg-gray-100 text-black'
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="bg-[#2563eb] hover:bg-[#2563eb]/90">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
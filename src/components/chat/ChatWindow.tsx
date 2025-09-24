import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useSession } from '../../contexts/SessionContext';
import { Profile } from '../../types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { showError } from '../../utils/toast';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender: Pick<Profile, 'first_name' | 'last_name' | 'avatar_url'>;
}

interface ChatWindowProps {
  conversationId: string;
  participants: Map<string, Pick<Profile, 'id' | 'first_name' | 'last_name' | 'avatar_url'>>;
}

export const ChatWindow = ({ conversationId, participants }: ChatWindowProps) => {
  const { user } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles(first_name, last_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        showError('فشل في جلب الرسائل: ' + error.message);
      } else {
        setMessages(data as any);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const senderProfile = participants.get(payload.new.sender_id);
          if (senderProfile) {
            const newMessageWithSender = { ...payload.new, sender: senderProfile } as Message;
            setMessages((prevMessages) => [...prevMessages, newMessageWithSender]);
          } else {
            console.warn(`Sender profile with id ${payload.new.sender_id} not found in participants map.`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, participants]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsSending(true);
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: newMessage.trim(),
      });
    
    setIsSending(false);
    if (error) {
      showError('فشل في إرسال الرسالة: ' + error.message);
    } else {
      setNewMessage('');
    }
  };

  const getAvatarFallback = (profile: Pick<Profile, 'first_name' | 'last_name'> | null) => {
    if (!profile) return '??';
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => {
            const isSender = message.sender_id === user?.id;
            return (
              <div key={message.id} className={cn('flex items-end gap-2', isSender ? 'justify-end' : 'justify-start')}>
                {!isSender && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender?.avatar_url || undefined} />
                    <AvatarFallback>{getAvatarFallback(message.sender)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn('max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2', isSender ? 'bg-primary text-primary-foreground' : 'bg-gray-100')}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">{format(new Date(message.created_at), 'p', { locale: ar })}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك..."
            disabled={isSending}
          />
          <Button type="submit" disabled={isSending || !newMessage.trim()}>
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};
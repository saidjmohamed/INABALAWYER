import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession, Profile } from '@/contexts/SessionContext';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ArrowRight, MessageSquare } from 'lucide-react';
import { showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { usePresence } from '@/contexts/PresenceContext';

interface Conversation {
  id: string;
  participant: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'avatar_url'>;
}

const ConversationsPage = () => {
  const { id: activeConversationId } = useParams<{ id: string }>();
  const { user, profile, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const { onlineUsers } = usePresence();

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchConversations = async () => {
      setLoadingConversations(true);
      // 1. Get all conversation IDs for the current user
      const { data: userParticipants, error: userParticipantsError } = await supabase
        .from('participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (userParticipantsError) {
        showError('فشل في جلب المحادثات');
        setLoadingConversations(false);
        return;
      }

      const conversationIds = userParticipants.map(p => p.conversation_id);

      if (conversationIds.length === 0) {
        setConversations([]);
        setLoadingConversations(false);
        return;
      }

      // 2. Get the other participant for each conversation
      const { data: otherParticipants, error: otherParticipantsError } = await supabase
        .from('participants')
        .select('conversation_id, profile:profiles(id, first_name, last_name, avatar_url)')
        .in('conversation_id', conversationIds)
        .neq('user_id', user.id);

      if (otherParticipantsError) {
        showError('فشل في جلب المشاركين');
        setLoadingConversations(false);
        return;
      }

      const conversationList: Conversation[] = otherParticipants.map(p => ({
        id: p.conversation_id,
        participant: p.profile as any,
      }));

      setConversations(conversationList);
      setLoadingConversations(false);
    };

    fetchConversations();
  }, [user, sessionLoading, navigate]);

  const getAvatarFallback = (profile: Pick<Profile, 'first_name' | 'last_name'> | null) => {
    if (!profile) return '??';
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
  };

  if (sessionLoading || loadingConversations) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const participantsMap = new Map<string, Pick<Profile, 'id' | 'first_name' | 'last_name' | 'avatar_url'>>();
  if (profile && activeConversation?.participant) {
    participantsMap.set(profile.id, profile);
    participantsMap.set(activeConversation.participant.id, activeConversation.participant);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center w-full mx-auto p-4 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">محادثاتي</h1>
        <Button variant="outline" asChild>
          <Link to="/">
            <span className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية
            </span>
          </Link>
        </Button>
      </header>
      <div className="flex h-[calc(100vh-73px)]">
        <aside className="w-1/3 max-w-xs border-r bg-white overflow-y-auto">
          {conversations.length > 0 ? (
            <ul>
              {conversations.map(conv => {
                const isOnline = onlineUsers.includes(conv.participant.id);
                return (
                  <li key={conv.id}>
                    <Link to={`/conversations/${conv.id}`} className={cn(
                      "flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors",
                      activeConversationId === conv.id && "bg-gray-200"
                    )}>
                      <Avatar className="h-10 w-10 relative">
                        <AvatarImage src={conv.participant.avatar_url || undefined} />
                        <AvatarFallback>{getAvatarFallback(conv.participant)}</AvatarFallback>
                        {isOnline && (
                          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                        )}
                      </Avatar>
                      <span className="font-medium">{conv.participant.first_name} {conv.participant.last_name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>لا توجد محادثات بعد.</p>
              <p className="text-sm mt-2">ابدأ محادثة من <Link to="/lawyers" className="text-primary underline">جدول المحامين</Link>.</p>
            </div>
          )}
        </aside>
        <main className="flex-1">
          {activeConversationId && participantsMap.size === 2 ? (
            <ChatWindow conversationId={activeConversationId} participants={participantsMap} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <MessageSquare className="h-16 w-16 mb-4" />
              <h2 className="text-xl font-semibold">اختر محادثة</h2>
              <p>اختر محادثة من القائمة على اليمين لبدء الدردشة.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ConversationsPage;
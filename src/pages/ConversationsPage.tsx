import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../contexts/SessionContext';
import { Profile } from '../types';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Loader2, MessageSquare, MoreHorizontal, Trash2 } from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';
import { cn } from '../lib/utils';
import { usePresence } from '../contexts/PresenceContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

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
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchConversations = async () => {
      setLoadingConversations(true);
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

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_conversation', {
        p_conversation_id: conversationToDelete.id,
      });

      if (error) throw error;

      showSuccess('تم حذف المحادثة بنجاح.');
      setConversations(prev => prev.filter(c => c.id !== conversationToDelete.id));

      if (activeConversationId === conversationToDelete.id) {
        navigate('/conversations');
      }
    } catch (error: any) {
      showError('فشل في حذف المحادثة: ' + error.message);
    } finally {
      setIsDeleting(false);
      setConversationToDelete(null);
    }
  };

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
    <div className="h-[calc(100vh-72px)]">
      <div className="flex h-full border-t">
        <aside className="w-1/3 max-w-xs border-r bg-white overflow-y-auto">
          {conversations.length > 0 ? (
            <ul>
              {conversations.map(conv => {
                const isOnline = onlineUsers.includes(conv.participant.id);
                return (
                  <li key={conv.id}>
                    <div className={cn(
                      "flex items-center justify-between hover:bg-gray-100 transition-colors",
                      activeConversationId === conv.id && "bg-gray-200"
                    )}>
                      <Link to={`/conversations/${conv.id}`} className="flex items-center gap-3 p-3 flex-grow">
                        <Avatar className="h-10 w-10 relative">
                          <AvatarImage src={conv.participant.avatar_url || undefined} />
                          <AvatarFallback>{getAvatarFallback(conv.participant)}</AvatarFallback>
                          {isOnline && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                          )}
                        </Avatar>
                        <span className="font-medium">{conv.participant.first_name} {conv.participant.last_name}</span>
                      </Link>
                      <div className="pr-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-500 hover:!text-red-500 focus:text-red-500 cursor-pointer"
                              onClick={() => setConversationToDelete(conv)}
                            >
                              <Trash2 className="ml-2 h-4 w-4" />
                              <span>حذف المحادثة</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
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
      <AlertDialog open={!!conversationToDelete} onOpenChange={(open) => !open && setConversationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذه المحادثة وجميع رسائلها بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConversation} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تأكيد الحذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConversationsPage;
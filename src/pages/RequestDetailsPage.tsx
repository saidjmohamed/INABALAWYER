import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowRight, Trash2 } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Define interfaces for type safety
interface ProfileInfo {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

interface CourtInfo {
  name: string;
}

interface RequestDetails {
  id: string;
  created_at: string;
  type: 'information_request' | 'representation' | 'other_request';
  case_number: string;
  status: 'open' | 'closed' | 'in_progress';
  details?: string;
  section?: string;
  creator: ProfileInfo | null;
  court: CourtInfo | null;
  lawyer_id: string | null;
  assigned_lawyer: ProfileInfo | null;
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  author: ProfileInfo | null;
}

const requestTypeTranslations = {
  information_request: 'طلب معلومة من تطبيقة',
  representation: 'طلب إنابة',
  other_request: 'طلب آخر',
};

const RequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useSession();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestDetails | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const fetchRequestAndReplies = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    try {
      // Fetch request details
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select(`
          *,
          creator:creator_id ( id, first_name, last_name ),
          court:courts ( name ),
          assigned_lawyer:lawyer_id ( id, first_name, last_name )
        `)
        .eq('id', id)
        .single();

      if (requestError || !requestData) {
        throw new Error(requestError?.message || 'لم يتم العثور على الطلب.');
      }
      setRequest(requestData as RequestDetails);

      // Fetch replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('replies')
        .select(`
          *,
          author:author_id ( id, first_name, last_name, avatar_url )
        `)
        .eq('request_id', id)
        .order('created_at', { ascending: true });

      if (repliesError) {
        throw new Error(repliesError.message);
      }
      setReplies(repliesData as Reply[]);

    } catch (error: any) {
      showError(`فشل في جلب البيانات: ${error.message}`);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchRequestAndReplies();
  }, [fetchRequestAndReplies]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !user || !id) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('replies')
      .insert({ content: newReply, request_id: id, author_id: user.id })
      .select('*, author:author_id ( id, first_name, last_name, avatar_url )')
      .single();
    
    setIsSubmitting(false);

    if (error) {
      showError('فشل في إضافة الرد: ' + error.message);
    } else {
      showSuccess('تمت إضافة الرد بنجاح.');
      setReplies(prevReplies => [...prevReplies, data as Reply]);
      setNewReply('');
    }
  };

  const handleAcceptRequest = async () => {
    if (!user || !id) return;
    setIsAccepting(true);
    const { error } = await supabase
      .from('requests')
      .update({ status: 'in_progress', lawyer_id: user.id })
      .eq('id', id);
    
    setIsAccepting(false);

    if (error) {
      showError('فشل في قبول الطلب: ' + error.message);
    } else {
      showSuccess('تم قبول الطلب بنجاح!');
      fetchRequestAndReplies();
    }
  };

  const handleDeleteRequest = async () => {
    if (!id) return;
    setIsDeleting(true);
    const { error } = await supabase.from('requests').delete().eq('id', id);
    setIsDeleting(false);

    if (error) {
      showError('فشل في حذف الطلب: ' + error.message);
    } else {
      showSuccess('تم حذف الطلب بنجاح.');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>لم يتم العثور على الطلب.</p>
      </div>
    );
  }

  const isRequestCreator = user?.id === request.creator?.id;
  const isAdmin = profile?.role === 'admin';
  const isLawyer = profile?.role === 'lawyer';
  const canDeleteRequest = isRequestCreator || isAdmin;
  const canAcceptRequest = isLawyer && request.status === 'open' && !request.lawyer_id;
  const isAssignedToCurrentUser = request.lawyer_id === user?.id;
  const canReply = profile && (isLawyer && (isAssignedToCurrentUser || !request.lawyer_id)) || isAdmin || isRequestCreator;

  const getAvatarFallback = (author: ProfileInfo | null) => {
    if (!author) return '??';
    const first = author.first_name?.[0] || '';
    const last = author.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-center w-full py-4 border-b mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الطلب</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {canDeleteRequest && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isDeleting} className="w-full sm:w-auto">
                    <span className="flex items-center">
                      {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                      حذف الطلب
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      لا يمكن التراجع عن هذا الإجراء. سيتم حذف هذا الطلب وجميع الردود المرتبطة به بشكل دائم.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRequest} disabled={isDeleting}>
                      <span className="flex items-center justify-center">
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>حذف</span>}
                      </span>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/">
                <span className="flex items-center">
                  <ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية
                </span>
              </Link>
            </Button>
          </div>
        </header>

        <main className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-xl">{requestTypeTranslations[request.type]}</CardTitle>
                <Badge variant="secondary">{request.court?.name}</Badge>
              </div>
              <CardDescription>
                رقم القضية: {request.case_number} {request.section && `- القسم: ${request.section}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {request.details && <p className="text-gray-700 whitespace-pre-wrap">{request.details}</p>}
              {request.assigned_lawyer && (
                <p className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold">المحامي المعين:</span> {request.assigned_lawyer.first_name} {request.assigned_lawyer.last_name}
                </p>
              )}
              <Badge className="mt-4" variant={request.status === 'open' ? 'default' : 'outline'}>
                الحالة: {request.status === 'open' ? 'مفتوح' : request.status === 'in_progress' ? 'قيد التقدم' : 'مغلق'}
              </Badge>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-2">
              <span>
                نشر بواسطة: {request.creator?.first_name} {request.creator?.last_name}
              </span>
              <span>
                {format(new Date(request.created_at), 'd MMMM yyyy', { locale: ar })}
              </span>
            </CardFooter>
          </Card>

          {canAcceptRequest && (
            <div className="text-center">
              <Button onClick={handleAcceptRequest} disabled={isAccepting} className="w-full sm:w-auto">
                <span className="flex items-center justify-center">
                  {isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>قبول الطلب</span>}
                </span>
              </Button>
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">الردود ({replies.length})</h2>
            {replies.length > 0 ? (
              replies.map((reply) => (
                <Card key={reply.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <Avatar>
                        <AvatarImage src={reply.author?.avatar_url || undefined} />
                        <AvatarFallback>{getAvatarFallback(reply.author)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <p className="font-semibold">
                            {reply.author?.first_name} {reply.author?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(reply.created_at), 'PPpp', { locale: ar })}
                          </p>
                        </div>
                        <p className="mt-1 text-gray-800">{reply.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">لا توجد ردود بعد. كن أول من يرد!</p>
            )}
          </div>

          {canReply && (
            <div>
              <Separator className="my-6" />
              <h3 className="text-lg font-semibold mb-2">إضافة رد جديد</h3>
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <Textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  rows={4}
                  disabled={isSubmitting}
                />
                <Button type="submit" disabled={isSubmitting || !newReply.trim()} className="w-full sm:w-auto">
                  <span className="flex items-center justify-center">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>إرسال الرد</span>}
                  </span>
                </Button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
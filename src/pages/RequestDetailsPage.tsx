import { useEffect, useState } from 'react';
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
import { RequestWithDetails } from '@/components/requests/RequestList';
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


interface Reply {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

// Extend RequestWithDetails to include lawyer information
interface RequestDetails extends RequestWithDetails {
  lawyer_id: string | null;
  assigned_lawyer: {
    first_name: string;
    last_name: string;
  } | null;
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
  const [replying, setReplying] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [deleting, setDeleting] = useState(false);


  const fetchRequestAndReplies = async () => {
    if (!id) {
      navigate('/');
      return;
    }
    setLoading(true);

    // Fetch request details including assigned lawyer
    const { data: requestData, error: requestError } = await supabase
      .from('requests')
      .select(`
        id, created_at, type, case_number, status, details, section, lawyer_id,
        creator:creator_id ( id, first_name, last_name ),
        court:courts ( name ),
        assigned_lawyer:lawyer_id ( first_name, last_name )
      `)
      .eq('id', id)
      .single();

    if (requestError) {
      console.error('Error fetching request details:', requestError);
      showError('فشل في جلب تفاصيل الطلب: ' + requestError.message);
      navigate('/');
      return;
    }
    if (!requestData) {
      showError('لم يتم العثور على الطلب.');
      navigate('/');
      return;
    }
    setRequest(requestData as any);

    // Fetch replies
    const { data: repliesData, error: repliesError } = await supabase
      .from('replies')
      .select(`
        id, content, created_at,
        author:profiles ( id, first_name, last_name )
      `)
      .eq('request_id', id)
      .order('created_at', { ascending: true });

    if (repliesError) {
      showError('فشل في جلب الردود.');
    } else {
      setReplies(repliesData as any);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRequestAndReplies();
  }, [id, navigate]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !user || !id) return;

    setReplying(true);
    const { data, error } = await supabase
      .from('replies')
      .insert({
        content: newReply,
        request_id: id,
        author_id: user.id,
      })
      .select(`
        id, content, created_at,
        author:profiles ( id, first_name, last_name )
      `)
      .single();
    setReplying(false);

    if (error) {
      showError('فشل في إضافة الرد: ' + error.message);
    } else {
      showSuccess('تمت إضافة الرد بنجاح.');
      setReplies([...replies, data as any]);
      setNewReply('');
    }
  };

  const handleAcceptRequest = async () => {
    if (!user || !id || profile?.role !== 'lawyer' || request?.status !== 'open' || request?.lawyer_id) {
      showError('لا يمكنك قبول هذا الطلب.');
      return;
    }

    setAccepting(true);
    const { error } = await supabase
      .from('requests')
      .update({
        status: 'in_progress',
        lawyer_id: user.id,
      })
      .eq('id', id);
    setAccepting(false);

    if (error) {
      showError('فشل في قبول الطلب: ' + error.message);
    } else {
      showSuccess('تم قبول الطلب بنجاح!');
      fetchRequestAndReplies(); // Re-fetch to update status and assigned lawyer
    }
  };

  const handleDeleteRequest = async () => {
    if (!id) return;

    setDeleting(true);
    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id);
    setDeleting(false);

    if (error) {
      showError('فشل في حذف الطلب: ' + error.message);
    } else {
      showSuccess('تم حذف الطلب بنجاح.');
      navigate('/'); // Redirect to home page after deletion
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
    return null; // Should be redirected by the effect
  }

  const isLawyer = profile?.role === 'lawyer';
  const isAdmin = profile?.role === 'admin';
  const isRequestCreator = user?.id === request.creator?.id;
  const isRequestOpen = request.status === 'open';
  const isAssignedToCurrentUser = request.lawyer_id === user?.id;
  const canAcceptRequest = isLawyer && isRequestOpen && !request.lawyer_id;
  const canDeleteRequest = isRequestCreator || isAdmin;


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-center w-full py-4 border-b mb-8 gap-4"> {/* Added flex-col sm:flex-row and gap-4 */}
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الطلب</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2"> {/* Added flex-col sm:flex-row and gap-2 */}
            {canDeleteRequest && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deleting} className="w-full sm:w-auto">
                    <span className="flex items-center">
                      {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
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
                    <AlertDialogAction onClick={handleDeleteRequest} disabled={deleting}>
                      {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'حذف'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="outline" asChild className="w-full sm:w-auto"> {/* Added w-full sm:w-auto */}
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"> {/* Added flex-col sm:flex-row and gap-2 */}
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
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-2"> {/* Added flex-col sm:flex-row and gap-2 */}
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
              <Button onClick={handleAcceptRequest} disabled={accepting} className="w-full sm:w-auto"> {/* Added w-full sm:w-auto */}
                {accepting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'قبول الطلب'}
              </Button>
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">الردود ({replies.length})</h2>
            {replies.length > 0 ? (
              replies.map((reply) => (
                <Card key={reply.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4 space-x-reverse flex-col sm:flex-row gap-2"> {/* Added flex-col sm:flex-row and gap-2 */}
                      <Avatar>
                        <AvatarImage />
                        <AvatarFallback>
                          {reply.author?.first_name?.[0]}
                          {reply.author?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"> {/* Added flex-col sm:flex-row and gap-2 */}
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

          {profile && (isLawyer && (isAssignedToCurrentUser || !request.lawyer_id)) || isAdmin || isRequestCreator ? (
            <div>
              <Separator className="my-6" />
              <h3 className="text-lg font-semibold mb-2">إضافة رد جديد</h3>
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <Textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  rows={4}
                  disabled={replying}
                />
                <Button type="submit" disabled={replying || !newReply.trim()} className="w-full sm:w-auto"> {/* Added w-full sm:w-auto */}
                  {replying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'إرسال الرد'}
                </Button>
              </form>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
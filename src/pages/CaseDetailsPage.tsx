import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CaseWithDetails, Reply } from '@/types';
import { useSession } from '@/contexts/SessionContext';
import { Loader2, ArrowRight, User, Landmark, FileText, Calendar, Users, Briefcase, Info, Trash2, CheckCircle, Clock, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CreateReplyForm } from '../components/replies/CreateReplyForm';
import { ReplyCard } from '../components/replies/ReplyCard';

export default function CaseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, user } = useSession();
  const [caseItem, setCaseItem] = useState<CaseWithDetails | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const fetchCase = useCallback(async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`*, court:courts(*), council:councils(*), creator:profiles!cases_creator_id_fkey(*), assignee:profiles!cases_assignee_id_fkey(*)`)
        .eq('id', id)
        .single();
      if (error) throw error;
      setCaseItem(data as any as CaseWithDetails);
    } catch (error: any) {
      showError(`فشل في تحميل تفاصيل القضية: ${error.message}`);
      setCaseItem(null);
    }
  }, [id]);

  const fetchReplies = useCallback(async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('replies')
        .select('*, author:profiles!replies_author_id_fkey(id, first_name, last_name, avatar_url)')
        .eq('case_id', id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setReplies(data as any as Reply[]);
    } catch (error: any) {
      showError(`فشل في تحميل الردود: ${error.message}`);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCase(), fetchReplies()]).finally(() => setLoading(false));
  }, [id, fetchCase, fetchReplies]);

  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`case-replies:${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'replies', filter: `case_id=eq.${id}` },
        () => fetchReplies()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, fetchReplies]);

  const handleDelete = async () => {
    if (!caseItem) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('cases').delete().eq('id', caseItem.id);
      if (error) throw error;
      showSuccess('تم حذف الطلب بنجاح.');
      navigate('/cases');
    } catch (error: any) {
      showError(`فشل في حذف الطلب: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAccept = async () => {
    if (!caseItem || !user) return;
    setIsAccepting(true);
    try {
      const { error } = await supabase
        .from('cases')
        .update({ assignee_id: user.id, status: 'assigned' })
        .eq('id', caseItem.id);
      if (error) throw error;
      showSuccess('لقد قبلت الطلب بنجاح.');
      await fetchCase(); // Refetch case data to show updated status
    } catch (error: any) {
      showError(`فشل في قبول الطلب: ${error.message}`);
    } finally {
      setIsAccepting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!caseItem) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على الطلب</h2>
        <Button asChild><Link to="/cases"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى قائمة الطلبات</Link></Button>
      </div>
    );
  }

  const judicialBody = caseItem.court?.name || caseItem.council?.name || 'غير محدد';
  const requestTypeDisplay = caseItem.request_type === 'representation' ? 'طلب إنابة' : 'طلب معلومة';
  const hasRepresentationDetails = caseItem.case_number || caseItem.plaintiff || caseItem.defendant || caseItem.session_date;
  const isOwner = profile?.id === caseItem.creator_id;
  const canAccept = !isOwner && caseItem.status === 'open';

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">تفاصيل الطلب</h1>
        <Button variant="outline" asChild><Link to="/cases"><span className="flex items-center"><ArrowRight className="ml-2 h-4 w-4" /> العودة للطلبات</span></Link></Button>
      </div>
      <main className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{caseItem.title}</CardTitle>
                <CardDescription>تاريخ الإنشاء: {format(new Date(caseItem.created_at), 'd MMMM yyyy', { locale: ar })}</CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                {caseItem.request_type && <Badge variant={caseItem.request_type === 'representation' ? 'default' : 'secondary'}>{requestTypeDisplay}</Badge>}
                <Badge variant={caseItem.status === 'open' ? 'outline' : 'default'}>
                  {caseItem.status === 'open' ? <><Clock className="ml-1 h-3 w-3" />مفتوح</> : <><CheckCircle className="ml-1 h-3 w-3" />تم إسناده</>}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3"><User className="h-4 w-4 text-gray-500" /><strong>إنشاء بواسطة:</strong> {caseItem.creator.first_name} {caseItem.creator.last_name}</div>
              <div className="flex items-center gap-3"><Landmark className="h-4 w-4 text-gray-500" /><strong>الجهة القضائية:</strong> {judicialBody}</div>
              {caseItem.section && <div className="flex items-center gap-3"><GitBranch className="h-4 w-4 text-gray-500" /><strong>القسم/الفرع:</strong> {caseItem.section}</div>}
            </div>
            {caseItem.assignee && (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <strong>تم إسناده إلى:</strong>
                <Link to={`/lawyers/${caseItem.assignee.id}`} className="font-semibold text-green-700 hover:underline">
                  {caseItem.assignee.first_name} {caseItem.assignee.last_name}
                </Link>
              </div>
            )}
            {hasRepresentationDetails && (
              <div className="p-4 border rounded-md bg-gray-50 space-y-3">
                <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-gray-500" /><strong>رقم القضية:</strong> {caseItem.case_number || 'غير محدد'}</div>
                <div className="flex items-center gap-3"><Users className="h-4 w-4 text-gray-500" /><strong>المدعي:</strong> {caseItem.plaintiff || 'غير محدد'}</div>
                <div className="flex items-center gap-3"><Users className="h-4 w-4 text-gray-500" /><strong>المدعى عليه:</strong> {caseItem.defendant || 'غير محدد'}</div>
                <div className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-gray-500" /><strong>الممثل القانوني:</strong> {caseItem.legal_representative || 'غير محدد'}</div>
                <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-gray-500" /><strong>تاريخ الجلسة:</strong> {caseItem.session_date ? format(new Date(caseItem.session_date), 'd MMMM yyyy, h:mm a', { locale: ar }) : 'غير محدد'}</div>
              </div>
            )}
            {caseItem.description && (
              <div className="pt-4 border-t"><div className="flex items-start gap-3"><Info className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" /><div><strong className="text-base">وصف إضافي:</strong><p className="whitespace-pre-wrap text-gray-700">{caseItem.description}</p></div></div></div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end gap-2">
            {canAccept && (
              <Button onClick={handleAccept} disabled={isAccepting}>
                {isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="ml-2 h-4 w-4" /> قبول الطلب</>}
              </Button>
            )}
            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="ml-2 h-4 w-4" />حذف الطلب</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle><AlertDialogDescription>لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف طلبك بشكل دائم من خوادمنا.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">{isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تأكيد الحذف'}</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الردود والمناقشات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {replies.length > 0 ? (
                replies.map(reply => <ReplyCard key={reply.id} reply={reply} />)
              ) : (
                <p className="text-center text-gray-500 py-4">لا توجد ردود بعد. كن أول من يرد!</p>
              )}
            </div>
            {!isOwner && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">أضف ردًا</h3>
                <CreateReplyForm caseId={caseItem.id} onReplyAdded={fetchReplies} />
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
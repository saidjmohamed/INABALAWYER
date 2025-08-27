import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { RequestWithDetails, ReplyWithAuthor, Reply } from '@/types';
import { Loader2, ArrowRight, Send, User, Landmark, Calendar, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ReplyCard } from '@/components/ReplyCard';

const requestTypeTranslations = {
  representation: "انابة",
  information_retrieval: "معلومة",
  other: "طلب اخر من المحكمة",
};

const RequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { session, profile } = useSession();
  const [request, setRequest] = useState<RequestWithDetails | null>(null);
  const [replies, setReplies] = useState<ReplyWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequestAndReplies = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: requestData, error: requestError } = await supabase
          .from('requests')
          .select(`
            id, creator_id, court_id, type, case_number, section, details, status, created_at, lawyer_id, session_date, plaintiff_details, defendant_details,
            court:courts(*),
            creator:profiles!creator_id(*),
            lawyer:profiles!lawyer_id(*)
          `)
          .eq('id', id)
          .single();

        if (requestError) throw requestError;
        setRequest(requestData as any as RequestWithDetails);

        const { data: repliesData, error: repliesError } = await supabase
          .from('replies')
          .select('*, author:profiles!author_id(*)')
          .eq('request_id', id)
          .order('created_at', { ascending: true });

        if (repliesError) throw repliesError;
        setReplies(repliesData as ReplyWithAuthor[]);
      } catch (error: any) {
        showError(`فشل في تحميل تفاصيل الطلب: ${error.message}`);
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestAndReplies();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`replies-for-request-${id}`)
      .on<Reply>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'replies', filter: `request_id=eq.${id}` },
        async (payload) => {
          const { data: author, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.author_id)
            .single();
          
          if (error) {
            console.error('Error fetching author for new reply:', error);
            return;
          }

          const newReplyWithAuthor = { ...payload.new, author };
          setReplies((currentReplies) => [...currentReplies, newReplyWithAuthor as ReplyWithAuthor]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleReplySubmit = async () => {
    if (!newReply.trim() || !session || !profile) {
      showError('الرجاء كتابة رد وتسجيل الدخول أولاً.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('replies').insert({
        request_id: id!,
        author_id: profile.id,
        content: newReply.trim(),
      });
      if (error) throw error;
      showSuccess('تم إرسال ردك بنجاح.');
      setNewReply('');
    } catch (error: any) {
      showError(`فشل في إرسال الرد: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على الطلب</h2>
        <p className="text-gray-600 mb-6">قد يكون الطلب الذي تبحث عنه قد تم حذفه أو أن الرابط غير صحيح.</p>
        <Button asChild>
          <Link to="/requests">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة إلى قائمة الطلبات
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <main className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">تفاصيل الطلب</CardTitle>
                <CardDescription>رقم القضية: {request.case_number}</CardDescription>
              </div>
              <Badge variant={request.status === 'open' ? 'default' : 'secondary'}>
                {request.status === 'open' ? 'مفتوح' : 'مغلق'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <strong>صاحب الطلب:</strong> {request.creator.first_name} {request.creator.last_name}
            </div>
            <div className="flex items-center gap-3">
              <Landmark className="h-4 w-4 text-gray-500" />
              <strong>المحكمة:</strong> {request.court.name}
            </div>
            <div className="flex items-center gap-3">
              <Info className="h-4 w-4 text-gray-500" />
              <strong>نوع الطلب:</strong> {requestTypeTranslations[request.type as keyof typeof requestTypeTranslations] || 'غير محدد'}
            </div>
            {request.session_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <strong>تاريخ الجلسة:</strong> {format(new Date(request.session_date), 'd MMMM yyyy, h:mm a', { locale: ar })}
              </div>
            )}
            
            {(request.plaintiff_details || request.defendant_details) && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2 text-base">تفاصيل الأطراف</h4>
                <div className="space-y-3">
                  {request.plaintiff_details && (
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>الطرف الأول (المدعي/المستأنف):</strong>
                        <p className="text-gray-700">{request.plaintiff_details}</p>
                      </div>
                    </div>
                  )}
                  {request.defendant_details && (
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>الطرف الثاني (المدعى عليه/المستأنف عليه):</strong>
                        <p className="text-gray-700">{request.defendant_details}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {request.details && (
              <div className="pt-4 border-t">
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-base">التفاصيل الإضافية:</strong>
                    <p className="whitespace-pre-wrap text-gray-700">{request.details}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الردود والمناقشات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {replies.length > 0 ? (
                replies.map(reply => <ReplyCard key={reply.id} reply={reply} />)
              ) : (
                <p className="text-center text-gray-500 py-4">لا توجد ردود حتى الآن. كن أول من يرد!</p>
              )}
            </div>
            {session && (
              <div className="flex flex-col gap-4">
                <Textarea
                  placeholder="اكتب ردك هنا..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleReplySubmit} disabled={isSubmitting || !newReply.trim()}>
                  {isSubmitting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
                  إرسال الرد
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RequestDetailsPage;
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
import { Loader2, ArrowRight } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { RequestWithDetails } from '@/components/requests/RequestList';

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

const requestTypeTranslations = {
  representation: 'مرافعة',
  consultation: 'استشارة',
  documentation: 'إجراءات مكتبية',
};

const RequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useSession();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestWithDetails | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchRequestAndReplies = async () => {
      setLoading(true);

      // Fetch request details
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select(`
          id, created_at, type, case_number, status, details, section,
          creator:profiles ( first_name, last_name ),
          court:courts ( name )
        `)
        .eq('id', id)
        .single();

      if (requestError || !requestData) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center w-full py-4 border-b mb-8">
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الطلب</h1>
          <Button variant="outline" asChild>
            <Link to="/"><ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية</Link>
          </Button>
        </header>

        <main className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{requestTypeTranslations[request.type]}</CardTitle>
                <Badge variant="secondary">{request.court?.name}</Badge>
              </div>
              <CardDescription>
                رقم القضية: {request.case_number} {request.section && `- القسم: ${request.section}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {request.details && <p className="text-gray-700 whitespace-pre-wrap">{request.details}</p>}
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                نشر بواسطة: {request.creator?.first_name} {request.creator?.last_name}
              </span>
              <span>
                {format(new Date(request.created_at), 'd MMMM yyyy', { locale: ar })}
              </span>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">الردود ({replies.length})</h2>
            {replies.length > 0 ? (
              replies.map((reply) => (
                <Card key={reply.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <Avatar>
                        <AvatarImage />
                        <AvatarFallback>
                          {reply.author?.first_name?.[0]}
                          {reply.author?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
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

          {profile && (
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
                <Button type="submit" disabled={replying || !newReply.trim()}>
                  {replying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'إرسال الرد'}
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
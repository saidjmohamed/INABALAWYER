import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { showError } from '@/utils/toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { RequestForList } from '@/types';

const requestTypeTranslations = {
  information_retrieval: 'طلب معلومة من تطبيقة',
  representation: 'طلب إنابة',
  other: 'طلب آخر',
};

export interface RequestListProps {
  courtId?: string;
}

const cardColors = [
  "bg-sky-50 hover:bg-sky-100",
  "bg-emerald-50 hover:bg-emerald-100",
  "bg-amber-50 hover:bg-amber-100",
  "bg-rose-50 hover:bg-rose-100",
  "bg-violet-50 hover:bg-violet-100",
  "bg-fuchsia-50 hover:bg-fuchsia-100",
];

export const RequestList = ({ courtId }: RequestListProps) => {
  const [requests, setRequests] = useState<RequestForList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      
      let query = supabase
        .from('requests')
        .select(`
          *,
          court:courts(*),
          creator:profiles!creator_id(*),
          lawyer:profiles!lawyer_id(*),
          replies(count)
        `)
        .eq('status', 'open');

      if (courtId) {
        query = query.eq('court_id', courtId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        showError('Failed to fetch requests: ' + error.message);
        setRequests([]);
      } else {
        setRequests(data as unknown as RequestForList[]);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [courtId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold">لا توجد طلبات مفتوحة في هذه المحكمة حالياً</h2>
        <p className="text-gray-600 mt-2">يمكنك إضافة طلب جديد من الصفحة الرئيسية.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request, index) => {
        const hasReplies = request.replies && request.replies.length > 0 && request.replies[0].count > 0;
        const colorClass = cardColors[index % cardColors.length];
        return (
          <Link to={`/requests/${request.id}`} key={request.id} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
            <Card className={cn(
              "flex flex-col h-full transition-colors",
              colorClass
            )}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{requestTypeTranslations[request.type]}</CardTitle>
                  <Badge variant="outline">{request.court?.name || 'محكمة غير محددة'}</Badge>
                </div>
                <CardDescription>رقم القضية: {request.case_number}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  صاحب الطلب: {request.creator?.first_name} {request.creator?.last_name || 'محام غير معروف'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  نشر قبل {formatDistanceToNow(new Date(request.created_at), { addSuffix: false, locale: ar })}
                </p>
                {hasReplies ? (
                  <Badge variant="secondary" className="bg-emerald-200 text-emerald-800">يوجد ردود</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-200 text-amber-800">لا توجد ردود</Badge>
                )}
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
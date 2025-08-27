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

export interface RequestWithDetails {
  id: string;
  created_at: string;
  type: 'information_request' | 'representation' | 'other_request';
  case_number: string;
  status: 'open' | 'closed' | 'in_progress';
  details?: string;
  section?: string;
  creator: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  court: {
    name: string;
  } | null;
  replies: { count: number }[];
}

const requestTypeTranslations = {
  information_request: 'طلب معلومة من تطبيقة',
  representation: 'طلب إنابة',
  other_request: 'طلب آخر',
};

export interface RequestListProps {
  courtId?: string;
}

export const RequestList = ({ courtId }: RequestListProps) => {
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      
      let query = supabase
        .from('requests')
        .select(`
          id,
          created_at,
          type,
          case_number,
          status,
          creator:creator_id ( id, first_name, last_name ),
          court:courts ( name ),
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
        setRequests(data as unknown as RequestWithDetails[]);
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
      {requests.map((request) => {
        const hasReplies = request.replies && request.replies.length > 0 && request.replies[0].count > 0;
        return (
          <Link to={`/requests/${request.id}`} key={request.id} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
            <Card className={cn(
              "flex flex-col h-full transition-colors",
              hasReplies ? "bg-emerald-50 hover:bg-emerald-100" : "bg-amber-50 hover:bg-amber-100"
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
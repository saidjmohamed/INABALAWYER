import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { showError } from '@/utils/toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

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
          court:courts ( name )
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
      {requests.map((request) => (
        <Link to={`/requests/${request.id}`} key={request.id} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
          <Card className="flex flex-col h-full">
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
            <CardFooter>
              <p className="text-xs text-gray-500">
                نشر قبل {formatDistanceToNow(new Date(request.created_at), { addSuffix: false, locale: ar })}
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};
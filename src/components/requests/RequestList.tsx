import { useEffect, useState } from 'react';
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
  type: 'representation' | 'consultation' | 'documentation';
  case_number: string;
  status: 'open' | 'closed' | 'in_progress';
  creator: {
    first_name: string;
    last_name: string;
  } | null;
  court: {
    name: string;
  } | null;
}

const requestTypeTranslations = {
  representation: 'مرافعة',
  consultation: 'استشارة',
  documentation: 'إجراءات مكتبية',
};

export const RequestList = () => {
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('requests')
        .select(`
          id,
          created_at,
          type,
          case_number,
          status,
          creator:profiles ( first_name, last_name ),
          court:courts ( name )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        showError('Failed to fetch requests: ' + error.message);
        setRequests([]);
      } else {
        setRequests(data as unknown as RequestWithDetails[]);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

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
        <h2 className="text-2xl font-semibold">لا توجد طلبات حالياً</h2>
        <p className="text-gray-600 mt-2">كن أول من يضيف طلباً جديداً!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <Card key={request.id} className="flex flex-col">
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
      ))}
    </div>
  );
};
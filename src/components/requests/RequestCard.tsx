import { RequestWithDetails } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { User, Calendar, FileText } from 'lucide-react';

const statusTranslations: { [key: string]: string } = {
  open: 'مفتوح',
  closed: 'مغلق',
  in_progress: 'قيد التنفيذ',
  assigned: 'معين',
  cancelled: 'ملغى',
};

const typeTranslations: { [key: string]: string } = {
  information_retrieval: 'استخراج معلومات',
  representation: 'تمثيل',
  other: 'أخرى',
};

export const RequestCard = ({ request }: { request: RequestWithDetails }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'assigned': return 'secondary';
      case 'in_progress': return 'default';
      case 'closed': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>طلب رقم: {request.case_number}</CardTitle>
            <CardDescription>{typeTranslations[request.type] || request.type}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(request.status)}>
            {statusTranslations[request.status] || request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="ml-2 h-4 w-4" />
          <span>مقدم الطلب: {request.creator.first_name} {request.creator.last_name}</span>
        </div>
        {request.session_date && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="ml-2 h-4 w-4" />
            <span>تاريخ الجلسة: {format(new Date(request.session_date), 'd MMMM yyyy', { locale: ar })}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/requests/${request.id}`}>
            <FileText className="ml-2 h-4 w-4" />
            عرض التفاصيل
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
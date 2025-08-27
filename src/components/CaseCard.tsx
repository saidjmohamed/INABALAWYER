import { CaseWithDetails } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { User, FileText } from 'lucide-react';

export const CaseCard = ({ case: caseItem }: { case: CaseWithDetails }) => {
  const judicialBody = caseItem.court?.name || caseItem.council?.name || 'غير محدد';

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle>{caseItem.title}</CardTitle>
        <CardDescription>في: {judicialBody}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="ml-2 h-4 w-4" />
          <span>إنشاء بواسطة: {caseItem.creator.first_name} {caseItem.creator.last_name}</span>
        </div>
        <p className="text-sm text-gray-700 line-clamp-2">{caseItem.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(caseItem.created_at), { addSuffix: true, locale: ar })}
        </span>
        <Button asChild size="sm">
          <Link to={`/cases/${caseItem.id}`}>
            <FileText className="ml-2 h-4 w-4" />
            عرض التفاصيل
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
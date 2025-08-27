import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CaseWithDetails } from '@/types';
import { Loader2, ArrowRight, User, Landmark, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function CaseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [caseItem, setCaseItem] = useState<CaseWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCase = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cases')
          .select(`
            *,
            court:courts(*),
            council:councils(*),
            creator:profiles!cases_creator_id_fkey(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setCaseItem(data as any as CaseWithDetails);
      } catch (error: any) {
        showError(`فشل في تحميل تفاصيل القضية: ${error.message}`);
        setCaseItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على القضية</h2>
        <Button asChild>
          <Link to="/cases">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة إلى قائمة القضايا
          </Link>
        </Button>
      </div>
    );
  }

  const judicialBody = caseItem.court?.name || caseItem.council?.name || 'غير محدد';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <main className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{caseItem.title}</CardTitle>
                <CardDescription>
                  تاريخ الإنشاء: {format(new Date(caseItem.created_at), 'd MMMM yyyy', { locale: ar })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <strong>إنشاء بواسطة:</strong> {caseItem.creator.first_name} {caseItem.creator.last_name}
            </div>
            <div className="flex items-center gap-3">
              <Landmark className="h-4 w-4 text-gray-500" />
              <strong>الجهة القضائية:</strong> {judicialBody}
            </div>
            {caseItem.description && (
              <div className="pt-4 border-t">
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-base">الوصف:</strong>
                    <p className="whitespace-pre-wrap text-gray-700">{caseItem.description}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CaseWithDetails, Council, Court } from '@/types';
import { CaseCard } from '@/components/CaseCard';
import { Loader2, ArrowRight, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showError } from '@/utils/toast';

type JudicialBody = (Court & { type: 'court' }) | (Council & { type: 'council' });

export default function CourtDetailsPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const [judicialBody, setJudicialBody] = useState<JudicialBody | null>(null);
  const [cases, setCases] = useState<CaseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!paramId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const [type, id] = paramId.split(':');

      try {
        // Fetch judicial body details
        let bodyData = null;
        if (type === 'council') {
          const { data, error } = await supabase.from('councils').select('*').eq('id', id).single();
          if (error) throw error;
          bodyData = { ...data, type: 'council' };
        } else if (type === 'court') {
          const { data, error } = await supabase.from('courts').select('*').eq('id', id).single();
          if (error) throw error;
          bodyData = { ...data, type: 'court' };
        }
        setJudicialBody(bodyData);

        // Fetch associated cases
        let query = supabase.from('cases').select(`*, court:courts(*), council:councils(*), creator:profiles!cases_creator_id_fkey(*)`);
        if (type === 'council') {
          query = query.eq('council_id', id);
        } else {
          query = query.eq('court_id', id);
        }
        const { data: casesData, error: casesError } = await query.order('created_at', { ascending: false });
        if (casesError) throw casesError;
        setCases(casesData as any as CaseWithDetails[]);

      } catch (error: any) {
        showError(`فشل في جلب البيانات: ${error.message}`);
        setJudicialBody(null);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paramId]);

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-150px)]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!judicialBody) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-150px)] text-center">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على الجهة القضائية</h2>
        <Button asChild><Link to="/courts"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى قائمة الجهات القضائية</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Landmark className="h-8 w-8 text-primary" />
          <span>القضايا في: {judicialBody.name}</span>
        </h1>
        <Button variant="outline" asChild>
          <Link to="/courts">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة للقائمة
          </Link>
        </Button>
      </div>

      {cases.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.id} case={caseItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">لا توجد طلبات في هذه الجهة القضائية حالياً.</p>
        </div>
      )}
    </div>
  );
}
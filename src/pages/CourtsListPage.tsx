import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CaseCard } from '@/components/CaseCard';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Council, Court, CaseWithDetails } from '@/types';

export default function CourtsListPage() {
  const [councils, setCouncils] = useState<Council[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [cases, setCases] = useState<CaseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBody, setSelectedBody] = useState<{ type: 'council' | 'court', id: string, name: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: councilsData, error: councilsError } = await supabase.from('councils').select('*').order('name');
        if (councilsError) throw councilsError;
        setCouncils(councilsData || []);

        const { data: courtsData, error: courtsError } = await supabase.from('courts').select('*').order('name');
        if (courtsError) throw courtsError;
        setCourts(courtsData || []);
      } catch (error: any) {
        toast.error('فشل في جلب الجهات القضائية');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCases = async () => {
      if (!selectedBody) {
        setCases([]);
        return;
      }
      setLoading(true);
      try {
        let query = supabase.from('cases').select(`*, court:courts(*), council:councils(*), creator:profiles!cases_creator_id_fkey(*)`);
        if (selectedBody.type === 'council') {
          query = query.eq('council_id', selectedBody.id);
        } else {
          query = query.eq('court_id', selectedBody.id);
        }
        const { data, error } = await query;
        if (error) throw error;
        setCases(data as any as CaseWithDetails[]);
      } catch (error: any) {
        toast.error(`فشل في جلب القضايا لـ ${selectedBody.name}`);
      }
      setLoading(false);
    };
    fetchCases();
  }, [selectedBody]);

  if (loading && councils.length === 0) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-73px)]">
      <aside className="w-full md:w-1/3 md:max-w-xs border-r bg-white overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">الجهات القضائية</h2>
        <Accordion type="multiple" className="w-full">
          {councils.map(council => (
            <AccordionItem value={council.id} key={council.id}>
              <AccordionTrigger onClick={() => setSelectedBody({ type: 'council', id: council.id, name: council.name })}>
                {council.name}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="pl-4">
                  {courts.filter(c => c.council_id === council.id).map(court => (
                    <li
                      key={court.id}
                      className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${selectedBody?.id === court.id ? 'bg-gray-200' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBody({ type: 'court', id: court.id, name: court.name });
                      }}
                    >
                      {court.name}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {selectedBody ? (
          <>
            <h1 className="text-2xl font-bold mb-4">القضايا في {selectedBody.name}</h1>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : cases.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {cases.map(caseItem => (
                  <CaseCard key={caseItem.id} case={caseItem} />
                ))}
              </div>
            ) : (
              <p>لا توجد قضايا في هذه الجهة القضائية.</p>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">الرجاء اختيار جهة قضائية لعرض القضايا الخاصة بها.</p>
          </div>
        )}
      </main>
    </div>
  );
}
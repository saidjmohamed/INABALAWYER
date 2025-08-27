import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RequestCard } from '@/components/requests/RequestCard';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Court, RequestWithDetails } from '@/types';

const CourtsListPage = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [parentCourts, setParentCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      const { data, error } = await supabase.from('courts').select('*');
      if (error) {
        console.error('Error fetching courts:', error);
        toast.error('فشل في جلب المحاكم');
      } else {
        const allCourts = data as Court[];
        setCourts(allCourts);
        setParentCourts(allCourts.filter(c => c.parent_id === null));
      }
    };
    fetchCourts();
  }, []);

  const handleCourtSelect = async (court: Court) => {
    setSelectedCourt(court);
    setLoadingRequests(true);
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        creator:profiles!creator_id(*),
        lawyer:profiles!lawyer_id(*)
      `)
      .eq('court_id', court.id);

    if (error) {
      console.error('Error fetching requests:', error);
      toast.error('فشل في جلب القضايا');
      setRequests([]);
    } else {
      const requestsWithCourt = data.map(req => ({
        ...req,
        court: court,
      })) as RequestWithDetails[];
      setRequests(requestsWithCourt);
    }
    setLoadingRequests(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-73px)]">
      <aside className="w-full md:w-1/3 md:max-w-xs border-r bg-white overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">اختر محكمة</h2>
        <Accordion type="single" collapsible className="w-full">
          {parentCourts.map(parent => (
            <AccordionItem value={parent.id} key={parent.id}>
              <AccordionTrigger>{parent.name}</AccordionTrigger>
              <AccordionContent>
                <ul className="pl-4">
                  <li
                    key={parent.id}
                    className={`cursor-pointer p-2 rounded ${selectedCourt?.id === parent.id ? 'bg-gray-200' : ''}`}
                    onClick={() => handleCourtSelect(parent)}
                  >
                    {parent.name}
                  </li>
                  {courts.filter(court => court.parent_id === parent.id).map(court => (
                    <li
                      key={court.id}
                      className={`cursor-pointer p-2 rounded ${selectedCourt?.id === court.id ? 'bg-gray-200' : ''}`}
                      onClick={() => handleCourtSelect(court)}
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
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedCourt ? (
          <>
            <h1 className="text-2xl font-bold mb-4">القضايا في {selectedCourt.name}</h1>
            {loadingRequests ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <p>لا توجد قضايا في هذه المحكمة.</p>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">الرجاء اختيار محكمة لعرض القضايا الخاصة بها.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourtsListPage;
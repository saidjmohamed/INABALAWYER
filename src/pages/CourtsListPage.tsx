import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Court, RequestWithDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Building, Library } from 'lucide-react';
import { showError } from '@/utils/toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RequestCard } from '@/components/requests/RequestCard';
import { cn } from '@/lib/utils';

const CourtsListPage = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('courts').select('*');
      if (error) {
        showError('فشل في جلب المحاكم');
        console.error(error);
      } else {
        setCourts(data || []);
      }
      setLoading(false);
    };
    fetchCourts();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!selectedCourtId) {
        setRequests([]);
        return;
      }
      setLoadingRequests(true);
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          court:courts(*),
          creator:profiles!requests_creator_id_fkey(*),
          lawyer:profiles!requests_lawyer_id_fkey(*)
        `)
        .eq('court_id', selectedCourtId);

      if (error) {
        showError('فشل في جلب الطلبات');
        console.error(error);
      } else {
        setRequests((data as RequestWithDetails[]) || []);
      }
      setLoadingRequests(false);
    };

    fetchRequests();
  }, [selectedCourtId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  const parentCourts = courts.filter(c => !c.parent_id);
  const courtsByParent = courts.reduce((acc, court) => {
    if (court.parent_id) {
      if (!acc[court.parent_id]) {
        acc[court.parent_id] = [];
      }
      acc[court.parent_id].push(court);
    }
    return acc;
  }, {} as Record<string, Court[]>);

  const selectedCourt = courts.find(c => c.id === selectedCourtId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center w-full mx-auto p-4 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">المحاكم والطلبات</h1>
        <Button variant="outline" asChild>
          <Link to="/">
            <span className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية
            </span>
          </Link>
        </Button>
      </header>
      <div className="flex flex-col md:flex-row h-[calc(100vh-73px)]">
        <aside className="w-full md:w-1/3 md:max-w-xs border-r bg-white overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-4">اختر محكمة</h2>
          <Accordion type="single" collapsible className="w-full">
            {parentCourts.map(parent => (
              <AccordionItem value={parent.id} key={parent.id}>
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <Library className="h-5 w-5 text-gray-600" />
                    {parent.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pr-4 space-y-1">
                    {(courtsByParent[parent.id] || []).map(child => (
                      <li key={child.id}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-2",
                            selectedCourtId === child.id && "bg-gray-200 font-semibold"
                          )}
                          onClick={() => setSelectedCourtId(child.id)}
                        >
                          <Building className="h-4 w-4 text-gray-500" />
                          {child.name}
                        </Button>
                      </li>
                    ))}
                    {(!courtsByParent[parent.id] || courtsByParent[parent.id].length === 0) && (
                      <li className="text-sm text-gray-500 pr-2">لا توجد محاكم تابعة.</li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </aside>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {selectedCourt ? (
            <>
              <h2 className="text-2xl font-bold mb-6">طلبات {selectedCourt.name}</h2>
              {loadingRequests ? (
                <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : requests.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {requests.map(req => (
                    <RequestCard key={req.id} request={req} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500">لا توجد طلبات حالية في هذه المحكمة.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Library className="h-16 w-16 mb-4" />
              <h2 className="text-xl font-semibold">اختر محكمة</h2>
              <p>اختر محكمة من القائمة على اليمين لعرض الطلبات المرتبطة بها.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourtsListPage;
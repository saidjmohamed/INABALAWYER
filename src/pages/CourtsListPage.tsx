import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, ChevronLeft } from 'lucide-react';
import { Council, Court } from '../types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CourtsListPage() {
  const [councils, setCouncils] = useState<Council[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-150px)]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">قائمة الجهات القضائية</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <Accordion type="multiple" className="w-full">
          {councils.map(council => (
            <AccordionItem value={council.id} key={council.id}>
              <AccordionTrigger className="hover:no-underline">
                <Link to={`/courts/council:${council.id}`} className="font-semibold text-lg flex-grow text-right hover:text-primary">
                  {council.name}
                </Link>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="pr-6 space-y-2">
                  {courts.filter(c => c.council_id === council.id).map(court => (
                    <li key={court.id}>
                      <Link
                        to={`/courts/court:${court.id}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>{court.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
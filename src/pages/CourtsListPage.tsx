import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Court } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight, Landmark } from 'lucide-react';
import { showError } from '@/utils/toast';

const CourtsListPage = () => {
  const [councils, setCouncils] = useState<Court[]>([]);
  const [courtsByCouncil, setCourtsByCouncil] = useState<Record<string, Court[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        showError('فشل في جلب قائمة المحاكم: ' + error.message);
        setLoading(false);
        return;
      }

      const allCouncils = data.filter(c => c.level === 'appeal');
      const allCourts = data.filter(c => c.level === 'first_instance');

      const groupedCourts: Record<string, Court[]> = {};
      allCouncils.forEach(council => {
        groupedCourts[council.id] = allCourts.filter(court => court.parent_id === council.id);
      });

      setCouncils(allCouncils);
      setCourtsByCouncil(groupedCourts);
      setLoading(false);
    };

    fetchCourts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-4xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">اختر محكمة</h1>
        <Button variant="outline" asChild>
          <Link to="/">
            <span className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية
            </span>
          </Link>
        </Button>
      </header>
      <main className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>المجالس القضائية</CardTitle>
            <CardDescription>اختر مجلساً قضائياً لعرض المحاكم التابعة له.</CardDescription>
          </CardHeader>
          <CardContent>
            {councils.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {councils.map(council => (
                  <AccordionItem value={council.id} key={council.id}>
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline px-4 py-3">
                      {council.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      {courtsByCouncil[council.id] && courtsByCouncil[council.id].length > 0 ? (
                        <ul className="space-y-1 pt-2 pr-4">
                          {courtsByCouncil[council.id].map(court => (
                            <li key={court.id}>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-base"
                                asChild
                              >
                                <Link to={`/requests/court/${court.id}`}>
                                  <Landmark className="ml-2 h-4 w-4 text-gray-500" />
                                  {court.name}
                                </Link>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 p-4 text-center">لا توجد محاكم تابعة لهذا المجلس حالياً.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-gray-500 text-center py-8">لم يتم العثور على أي مجالس قضائية.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CourtsListPage;
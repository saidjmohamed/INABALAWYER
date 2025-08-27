import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { RequestWithDetails } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { showError } from '@/utils/toast';

type RepresentationRequest = RequestWithDetails & {
  session_date: string; // Ensure session_date is not null
};

const RepresentationCalendarPage = () => {
  const [requests, setRequests] = useState<RepresentationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchRepresentationRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('requests')
        .select(`
          id, creator_id, court_id, type, case_number, section, details, status, created_at, lawyer_id, session_date, plaintiff_details, defendant_details,
          court:courts(*),
          creator:profiles!creator_id(*),
          lawyer:profiles!lawyer_id(*)
        `)
        .eq('type', 'representation')
        .not('session_date', 'is', null);

      if (error) {
        showError('فشل في جلب طلبات الإنابة: ' + error.message);
      } else {
        setRequests(data as any as RepresentationRequest[]);
      }
      setLoading(false);
    };

    fetchRepresentationRequests();
  }, []);

  const eventsByDate = useMemo(() => {
    const dateMap = new Map<string, RepresentationRequest[]>();
    requests.forEach(req => {
      const dateKey = format(startOfDay(new Date(req.session_date)), 'yyyy-MM-dd');
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(req);
    });
    return dateMap;
  }, [requests]);

  const eventDays = useMemo(() => {
    return Array.from(eventsByDate.keys()).map(dateStr => new Date(dateStr));
  }, [eventsByDate]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(startOfDay(selectedDate), 'yyyy-MM-dd');
    return eventsByDate.get(dateKey) || [];
  }, [selectedDate, eventsByDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">تقويم الإنابات</h1>
        <Button variant="outline" asChild>
          <Link to="/">
            <span className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية
            </span>
          </Link>
        </Button>
      </header>
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-3"
                locale={ar}
                modifiers={{
                  event: eventDays,
                }}
                modifiersStyles={{
                  event: {
                    border: '2px solid hsl(var(--primary))',
                    borderRadius: 'var(--radius)',
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-6 w-6" />
                <span>
                  جلسات يوم {selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: ar }) : '...'}
                </span>
              </CardTitle>
              <CardDescription>
                {selectedDayEvents.length > 0
                  ? `تم العثور على ${selectedDayEvents.length} جلسة في هذا اليوم.`
                  : 'لا توجد جلسات مجدولة في هذا اليوم.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length > 0 ? (
                <ul className="space-y-4">
                  {selectedDayEvents.map(request => (
                    <li key={request.id} className="border p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <Link to={`/requests/${request.id}`} className="block">
                        <p className="font-semibold">{request.court.name}</p>
                        <p className="text-sm text-gray-700">رقم القضية: {request.case_number}</p>
                        <p className="text-sm text-gray-500">
                          صاحب الطلب: {request.creator.first_name} {request.creator.last_name}
                        </p>
                        <p className="text-sm text-primary font-medium mt-1">
                          الوقت: {format(new Date(request.session_date), 'p', { locale: ar })}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">اختر يوماً من التقويم لعرض الجلسات المجدولة.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RepresentationCalendarPage;
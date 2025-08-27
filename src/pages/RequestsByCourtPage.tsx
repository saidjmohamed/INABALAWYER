import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { RequestList } from '@/components/requests/RequestList';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';

const RequestsByCourtPage = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const [courtName, setCourtName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourtName = async () => {
      if (!courtId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('courts')
        .select('name')
        .eq('id', courtId)
        .single();

      if (error) {
        console.error('Error fetching court name:', error);
        setCourtName('محكمة غير معروفة');
      } else {
        setCourtName(data.name);
      }
      setLoading(false);
    };

    fetchCourtName();
  }, [courtId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">طلبات {courtName}</h1>
        <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/courts"><ArrowRight className="ml-2 h-4 w-4" /> العودة للمحاكم</Link>
            </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        {courtId ? <RequestList courtId={courtId} /> : <p>لم يتم تحديد المحكمة.</p>}
      </main>
    </div>
  );
};

export default RequestsByCourtPage;
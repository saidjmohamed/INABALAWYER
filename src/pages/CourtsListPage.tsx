import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { showError } from '@/utils/toast';

interface Court {
  id: string;
  name: string;
}

const CourtsListPage = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('courts')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) {
        showError('فشل في جلب قائمة المحاكم: ' + error.message);
      } else {
        setCourts(data || []);
      }
      setLoading(false);
    };

    fetchCourts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">اختر محكمة</h1>
        <Button variant="outline" asChild>
          <Link to="/"><ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية</Link>
        </Button>
      </header>
      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : courts.length === 0 ? (
          <p className="text-center text-gray-500">لم يتم العثور على محاكم.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courts.map((court) => (
              <Link to={`/requests/court/${court.id}`} key={court.id} className="block">
                <Card className="hover:bg-accent transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-center">{court.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CourtsListPage;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Court } from '@/types';
import { CreateRequestForm } from '@/components/requests/CreateRequestForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { showError } from '@/utils/toast';

const CreateRequestPage = () => {
  const { profile } = useSession();
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('courts').select('*');
      if (error) {
        showError('فشل في جلب قائمة المحاكم: ' + error.message);
      } else {
        setCourts(data || []);
      }
      setLoading(false);
    };
    fetchCourts();
  }, []);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-2xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إنشاء طلب جديد</h1>
        <Button variant="outline" asChild>
          <Link to="/requests">
            <span className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة للطلبات
            </span>
          </Link>
        </Button>
      </header>
      <main className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>املأ تفاصيل طلبك</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateRequestForm courts={courts} currentProfile={profile} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateRequestPage;
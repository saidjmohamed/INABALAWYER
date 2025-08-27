import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../contexts/SessionContext';
import { Council, Court } from '../types';
import { CreateCaseForm } from '../components/CreateCaseForm';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { showError } from '../utils/toast';

export default function CreateCasePage() {
  const { profile } = useSession();
  const [councils, setCouncils] = useState<Council[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: councilsData, error: councilsError } = await supabase.from('councils').select('*');
        if (councilsError) throw councilsError;
        setCouncils(councilsData || []);

        const { data: courtsData, error: courtsError } = await supabase.from('courts').select('*');
        if (courtsError) throw courtsError;
        setCourts(courtsData || []);
      } catch (error: any) {
        showError('فشل في جلب البيانات: ' + error.message);
      }
      setLoading(false);
    };
    fetchData();
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
        <h1 className="text-3xl font-bold text-gray-900">إنشاء قضية جديدة</h1>
        <Button variant="outline" asChild>
          <Link to="/cases">
            <span className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة للقضايا
            </span>
          </Link>
        </Button>
      </header>
      <main className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>املأ تفاصيل القضية</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCaseForm councils={councils} courts={courts} currentProfile={profile} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
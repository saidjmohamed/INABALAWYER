import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { CaseWithDetails, Council, Court } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { showError } from '../utils/toast';
import { AdminCaseEditForm } from '../components/admin/AdminCaseEditForm';

export default function AdminEditCasePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseItem, setCaseItem] = useState<CaseWithDetails | null>(null);
  const [councils, setCouncils] = useState<Council[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate('/admin');
        return;
      }
      setLoading(true);
      try {
        const [caseRes, councilsRes, courtsRes] = await Promise.all([
          supabase.from('cases').select(`*, creator:profiles!cases_creator_id_fkey(*)`).eq('id', id).single(),
          supabase.from('councils').select('*'),
          supabase.from('courts').select('*')
        ]);

        if (caseRes.error) throw caseRes.error;
        setCaseItem(caseRes.data as any);

        if (councilsRes.error) throw councilsRes.error;
        setCouncils(councilsRes.data || []);

        if (courtsRes.error) throw courtsRes.error;
        setCourts(courtsRes.data || []);

      } catch (error: any) {
        showError('فشل في جلب البيانات: ' + error.message);
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!caseItem) {
    return <div>لم يتم العثور على الطلب.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">تعديل الطلب (مشرف)</h1>
        <Button variant="outline" asChild><Link to="/admin"><ArrowRight className="ml-2 h-4 w-4" /> العودة للوحة التحكم</Link></Button>
      </div>
      <Card>
        <CardHeader><CardTitle>تعديل تفاصيل الطلب</CardTitle></CardHeader>
        <CardContent>
          <AdminCaseEditForm caseToEdit={caseItem} councils={councils} courts={courts} />
        </CardContent>
      </Card>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CaseWithDetails, Council, Court } from '@/types';
import { CaseCard } from '@/components/CaseCard';
import { Loader2, ArrowRight, Landmark, Phone, MapPin, Clock, Users, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { showError } from '@/utils/toast';
import { useSession } from '@/contexts/SessionContext';
import { CourtInfoEditor } from '@/components/courts/CourtInfoEditor';

// استخدام 'kind' كخاصية مميزة لتجنب التضارب مع خاصية 'type' الموجودة في Court
type JudicialBody = (Court & { kind: 'court' }) | (Council & { kind: 'council' });

export default function CourtDetailsPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const [judicialBody, setJudicialBody] = useState<JudicialBody | null>(null);
  const [cases, setCases] = useState<CaseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { profile } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!paramId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const [type, id] = paramId.split(':');

      try {
        let bodyData: JudicialBody | null = null;
        if (type === 'council') {
          const { data, error } = await supabase.from('councils').select('*').eq('id', id).single();
          if (error) throw error;
          bodyData = { ...data, kind: 'council' }; // تعيين 'kind' هنا
        } else if (type === 'court') {
          const { data, error } = await supabase.from('courts').select('*').eq('id', id).single();
          if (error) throw error;
          bodyData = { ...data, kind: 'court' }; // تعيين 'kind' هنا
        }
        setJudicialBody(bodyData);

        let query = supabase.from('cases').select(`*, court:courts(*), council:councils(*), creator:profiles!cases_creator_id_fkey(*)`);
        if (type === 'council') {
          query = query.eq('council_id', id);
        } else {
          query = query.eq('court_id', id);
        }
        const { data: casesData, error: casesError } = await query.order('created_at', { ascending: false });
        if (casesError) throw casesError;
        setCases(casesData as any as CaseWithDetails[]);

      } catch (error: any) {
        showError(`فشل في جلب البيانات: ${error.message}`);
        setJudicialBody(null);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paramId]);

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    // Refresh data
    const fetchData = async () => {
      if (!paramId) return;
      const [type, id] = paramId.split(':');
      if (type === 'court') {
        const { data, error } = await supabase.from('courts').select('*').eq('id', id).single();
        if (!error && data) {
          setJudicialBody({ ...data, kind: 'court' }); // تحديث 'kind' عند إعادة الجلب
        }
      }
    };
    fetchData();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-150px)]"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!judicialBody) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-150px)] text-center">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على الجهة القضائية</h2>
        <Button asChild><Link to="/courts"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى قائمة الجهات القضائية</Link></Button>
      </div>
    );
  }

  // استخدام 'kind' للتمييز وتضييق النوع
  const isCourt = judicialBody.kind === 'court';
  const court: Court | null = isCourt ? judicialBody : null; // TypeScript سيقوم بتضييق النوع بشكل صحيح هنا

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Landmark className="h-8 w-8 text-primary" />
          <span>{judicialBody.name}</span>
        </h1>
        <Button variant="outline" asChild>
          <Link to="/courts">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة للقائمة
          </Link>
        </Button>
      </div>

      {isCourt && court && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>معلومات المحكمة</CardTitle>
              {profile && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="ml-2 h-4 w-4" />
                  {isEditing ? 'إلغاء التعديل' : 'تعديل المعلومات'}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <CourtInfoEditor court={court} onSuccess={handleUpdateSuccess} onCancel={() => setIsEditing(false)} />
              ) : (
                <div className="space-y-4">
                  {court.lawyer_room_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">هاتف قاعة المحامين</p>
                        <p className="text-gray-800">{court.lawyer_room_phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {court.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">العنوان</p>
                        <p className="text-gray-800">{court.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {court.working_hours && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">أوقات العمل</p>
                        <p className="text-gray-800">{court.working_hours}</p>
                      </div>
                    </div>
                  )}
                  
                  {court.municipalities && court.municipalities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">البلدانيات التابعة</p>
                      <div className="flex flex-wrap gap-2">
                        {court.municipalities.map((municipality, index) => (
                          <Badge key={index} variant="secondary">{municipality}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!court.lawyer_room_phone && !court.address && !court.working_hours && !court.municipalities && (
                    <p className="text-gray-500 text-center">لا توجد معلومات متاحة لهذه المحكمة</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إحصائيات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{cases.length}</p>
                  <p className="text-sm text-gray-600">عدد القضايا</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Landmark className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{court.type}</p>
                  <p className="text-sm text-gray-600">نوع المحكمة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>القضايا في {judicialBody.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {cases.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((caseItem) => (
                <CaseCard key={caseItem.id} case={caseItem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">لا توجد طلبات في هذه الجهة القضائية حالياً.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
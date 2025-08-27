import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { CaseWithDetails } from '../types';
import { useSession } from '../contexts/SessionContext';
import { Loader2, ArrowRight, User, Landmark, FileText, Calendar, Users, Briefcase, Info, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { showError, showSuccess } from '../utils/toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export default function CaseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useSession();
  const [caseItem, setCaseItem] = useState<CaseWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cases')
          .select(`*, court:courts(*), council:councils(*), creator:profiles!cases_creator_id_fkey(*)`)
          .eq('id', id)
          .single();

        if (error) throw error;
        setCaseItem(data as any as CaseWithDetails);
      } catch (error: any) {
        showError(`فشل في تحميل تفاصيل القضية: ${error.message}`);
        setCaseItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  const handleDelete = async () => {
    if (!caseItem) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('cases').delete().eq('id', caseItem.id);
      if (error) throw error;
      showSuccess('تم حذف الطلب بنجاح.');
      navigate('/cases');
    } catch (error: any) {
      showError(`فشل في حذف الطلب: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على الطلب</h2>
        <Button asChild>
          <Link to="/cases">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة إلى قائمة الطلبات
          </Link>
        </Button>
      </div>
    );
  }

  const judicialBody = caseItem.court?.name || caseItem.council?.name || 'غير محدد';
  const requestTypeDisplay = caseItem.request_type === 'representation' ? 'طلب إنابة' : 'طلب معلومة';
  const hasRepresentationDetails = caseItem.case_number || caseItem.plaintiff || caseItem.defendant || caseItem.session_date;
  const isOwner = profile?.id === caseItem.creator_id;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-4xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">تفاصيل الطلب</h1>
        <Button variant="outline" asChild>
          <Link to="/cases">
            <span className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة للطلبات
            </span>
          </Link>
        </Button>
      </header>
      <main className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{caseItem.title}</CardTitle>
                <CardDescription>
                  تاريخ الإنشاء: {format(new Date(caseItem.created_at), 'd MMMM yyyy', { locale: ar })}
                </CardDescription>
              </div>
              {caseItem.request_type && (
                <Badge variant={caseItem.request_type === 'representation' ? 'default' : 'secondary'}>
                  {requestTypeDisplay}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <strong>إنشاء بواسطة:</strong> {caseItem.creator.first_name} {caseItem.creator.last_name}
              </div>
              <div className="flex items-center gap-3">
                <Landmark className="h-4 w-4 text-gray-500" />
                <strong>الجهة القضائية:</strong> {judicialBody}
              </div>
            </div>
            
            {hasRepresentationDetails && (
              <div className="p-4 border rounded-md bg-gray-50 space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <strong>رقم القضية:</strong> {caseItem.case_number || 'غير محدد'}
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <strong>المدعي:</strong> {caseItem.plaintiff || 'غير محدد'}
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <strong>المدعى عليه:</strong> {caseItem.defendant || 'غير محدد'}
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <strong>الممثل القانوني:</strong> {caseItem.legal_representative || 'غير محدد'}
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <strong>تاريخ الجلسة:</strong> 
                  {caseItem.session_date ? format(new Date(caseItem.session_date), 'd MMMM yyyy, h:mm a', { locale: ar }) : 'غير محدد'}
                </div>
              </div>
            )}

            {caseItem.description && (
              <div className="pt-4 border-t">
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-base">وصف إضافي:</strong>
                    <p className="whitespace-pre-wrap text-gray-700">{caseItem.description}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {isOwner && (
            <CardFooter className="border-t pt-6 flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف الطلب
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف طلبك بشكل دائم من خوادمنا.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تأكيد الحذف'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
}
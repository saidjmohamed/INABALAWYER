import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Profile, CaseWithDetails } from '@/types';
import { Navigate, Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { DesignerAvatarManager } from '@/components/admin/DesignerAvatarManager';
import { ProfileEditForm } from '@/components/profiles/ProfileEditForm';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { MaintenanceModeManager } from '@/components/admin/MaintenanceModeManager';

const AdminDashboard = () => {
  const { session, profile, loading: sessionLoading } = useSession();
  const [pendingLawyers, setPendingLawyers] = useState<Profile[]>([]);
  const [managedLawyers, setManagedLawyers] = useState<Profile[]>([]);
  const [cases, setCases] = useState<CaseWithDetails[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingLawyer, setEditingLawyer] = useState<Profile | null>(null);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [pendingRes, managedRes, casesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'lawyer').eq('status', 'pending'),
        supabase.from('profiles').select('*').eq('role', 'lawyer').in('status', ['active', 'disabled', 'rejected']),
        supabase.from('cases').select(`*, creator:profiles!cases_creator_id_fkey(*)`).order('created_at', { ascending: false })
      ]);

      if (pendingRes.error) throw pendingRes.error;
      setPendingLawyers(pendingRes.data || []);

      if (managedRes.error) throw managedRes.error;
      setManagedLawyers(managedRes.data || []);

      if (casesRes.error) throw casesRes.error;
      setCases(casesRes.data as any || []);

    } catch (error: any) {
      showError('فشل في جلب البيانات: ' + error.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading && session && profile?.role === 'admin') {
      fetchData();
    }
  }, [sessionLoading, session, profile]);

  if (sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!session || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleUpdateStatus = async (id: string, status: Profile['status']) => {
    setActionLoading(id);
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
    setActionLoading(null);
    if (error) {
      showError('فشل تحديث حالة المحامي: ' + error.message);
    } else {
      showSuccess('تم تحديث حالة المحامي بنجاح.');
      fetchData();
    }
  };

  const handleDeleteCase = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase.from('cases').delete().eq('id', id);
    setActionLoading(null);
    if (error) {
      showError('فشل حذف الطلب: ' + error.message);
    } else {
      showSuccess('تم حذف الطلب بنجاح.');
      fetchData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">لوحة تحكم المشرف</h1>
      <Tabs defaultValue="pending_lawyers">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="pending_lawyers">طلبات التسجيل</TabsTrigger>
          <TabsTrigger value="manage_lawyers">إدارة المحامين</TabsTrigger>
          <TabsTrigger value="manage_cases">إدارة الطلبات</TabsTrigger>
          <TabsTrigger value="settings">إعدادات التطبيق</TabsTrigger>
        </TabsList>

        {loadingData ? <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div> :
          <>
            <TabsContent value="pending_lawyers">
              <Card>
                <CardHeader><CardTitle>حسابات المحامين المعلقة</CardTitle><CardDescription>مراجعة وقبول طلبات التسجيل الجديدة.</CardDescription></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>الاسم</TableHead><TableHead>البريد الإلكتروني</TableHead><TableHead className="text-right">الإجراءات</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {pendingLawyers.length > 0 ? pendingLawyers.map((lawyer) => (
                        <TableRow key={lawyer.id}>
                          <TableCell>{lawyer.first_name} {lawyer.last_name}</TableCell>
                          <TableCell>{lawyer.email}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="success" size="sm" onClick={() => handleUpdateStatus(lawyer.id, 'active')} disabled={actionLoading === lawyer.id}>{actionLoading === lawyer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'قبول'}</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(lawyer.id, 'rejected')} disabled={actionLoading === lawyer.id}>{actionLoading === lawyer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'رفض'}</Button>
                          </TableCell>
                        </TableRow>
                      )) : <TableRow><TableCell colSpan={3} className="text-center">لا توجد طلبات معلقة.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage_lawyers">
              <Card>
                <CardHeader><CardTitle>إدارة المحامين</CardTitle><CardDescription>عرض وإدارة جميع حسابات المحامين.</CardDescription></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>الاسم</TableHead><TableHead>البريد الإلكتروني</TableHead><TableHead>الحالة</TableHead><TableHead className="text-right">الإجراءات</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {managedLawyers.map((lawyer) => (
                        <TableRow key={lawyer.id}>
                          <TableCell>{lawyer.first_name} {lawyer.last_name}</TableCell>
                          <TableCell>{lawyer.email}</TableCell>
                          <TableCell>{lawyer.status}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Dialog open={editingLawyer?.id === lawyer.id} onOpenChange={(isOpen) => !isOpen && setEditingLawyer(null)}>
                              <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => setEditingLawyer(lawyer)}><Edit className="h-4 w-4" /></Button></DialogTrigger>
                              <DialogContent><DialogHeader><DialogTitle>تعديل ملف المحامي</DialogTitle></DialogHeader>{editingLawyer && <ProfileEditForm profileToEdit={editingLawyer} onSuccess={() => { setEditingLawyer(null); fetchData(); }} />}</DialogContent>
                            </Dialog>
                            {lawyer.status === 'active' ? <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(lawyer.id, 'disabled')} disabled={actionLoading === lawyer.id}>{actionLoading === lawyer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تعطيل'}</Button> : <Button variant="success" size="sm" onClick={() => handleUpdateStatus(lawyer.id, 'active')} disabled={actionLoading === lawyer.id}>{actionLoading === lawyer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تفعيل'}</Button>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage_cases">
              <Card>
                <CardHeader><CardTitle>إدارة الطلبات</CardTitle><CardDescription>عرض، تعديل، وحذف جميع الطلبات على المنصة.</CardDescription></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>العنوان</TableHead><TableHead>صاحب الطلب</TableHead><TableHead>تاريخ الإنشاء</TableHead><TableHead className="text-right">الإجراءات</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {cases.map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell className="font-medium">{caseItem.title}</TableCell>
                          <TableCell>{caseItem.creator.first_name} {caseItem.creator.last_name}</TableCell>
                          <TableCell>{format(new Date(caseItem.created_at), 'd/M/yyyy', { locale: ar })}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm" asChild><Link to={`/cases/${caseItem.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                            <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" size="sm" disabled={actionLoading === caseItem.id}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle><AlertDialogDescription>سيتم حذف هذا الطلب وكل الردود المتعلقة به بشكل دائم.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCase(caseItem.id)} disabled={actionLoading === caseItem.id}>{actionLoading === caseItem.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تأكيد الحذف'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid gap-6">
                <MaintenanceModeManager />
                <DesignerAvatarManager />
              </div>
            </TabsContent>
          </>
        }
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../contexts/SessionContext';
import { Profile } from '../types';
import { Navigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { showSuccess, showError } from '../utils/toast';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { session, profile, loading: sessionLoading } = useSession();
  const [pendingLawyers, setPendingLawyers] = useState<Profile[]>([]);
  const [managedLawyers, setManagedLawyers] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchLawyers = async () => {
    setLoadingData(true);
    const { data: pendingData, error: pendingError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'lawyer')
      .eq('status', 'pending');

    if (pendingError) {
      showError('Failed to fetch pending lawyers: ' + pendingError.message);
    } else {
      setPendingLawyers(pendingData || []);
    }

    const { data: managedData, error: managedError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'lawyer')
      .in('status', ['active', 'disabled', 'rejected']);

    if (managedError) {
      showError('Failed to fetch managed lawyers: ' + managedError.message);
    } else {
      setManagedLawyers(managedData || []);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (!sessionLoading && session && profile?.role === 'admin') {
      fetchLawyers();
    }
  }, [sessionLoading, session, profile]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleUpdateStatus = async (id: string, status: Profile['status']) => {
    setActionLoading(id);
    const { error } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    setActionLoading(null);

    if (error) {
      showError('Failed to update lawyer status: ' + error.message);
    } else {
      showSuccess(`Lawyer status updated to ${status}.`);
      fetchLawyers(); // Re-fetch data to update the lists
    }
  };

  const handleDeleteLawyer = async (id: string) => {
    setActionLoading(id);
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    setActionLoading(null);

    if (error) {
      showError('Failed to delete lawyer: ' + error.message);
    } else {
      showSuccess('Lawyer deleted successfully.');
      fetchLawyers(); // Re-fetch data to update the lists
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">لوحة تحكم المشرف</h1>

      <main className="space-y-8">
        {loadingData ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>حسابات المحامين المعلقة</CardTitle>
                <CardDescription>مراجعة وقبول طلبات التسجيل الجديدة.</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLawyers.length === 0 ? (
                  <p className="text-center text-gray-500">لا توجد طلبات معلقة حالياً.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم الكامل</TableHead>
                          <TableHead>البريد الإلكتروني</TableHead>
                          <TableHead>الهاتف</TableHead>
                          <TableHead>العنوان</TableHead>
                          <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingLawyers.map((lawyer) => (
                          <TableRow key={lawyer.id}>
                            <TableCell>{lawyer.first_name} {lawyer.last_name}</TableCell>
                            <TableCell>{lawyer.email}</TableCell>
                            <TableCell>{lawyer.phone}</TableCell>
                            <TableCell>{lawyer.address}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="success"
                                onClick={() => handleUpdateStatus(lawyer.id, 'active')}
                                disabled={actionLoading === lawyer.id}
                              >
                                <span className="flex items-center justify-center">
                                  {actionLoading === lawyer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>قبول</span>}
                                </span>
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleUpdateStatus(lawyer.id, 'rejected')}
                                disabled={actionLoading === lawyer.id}
                              >
                                <span className="flex items-center justify-center">
                                  {actionLoading === lawyer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>رفض</span>}
                                </span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إدارة المحامين</CardTitle>
                <CardDescription>عرض وإدارة حسابات المحامين النشطة والمعطلة.</CardDescription>
              </CardHeader>
              <CardContent>
                {managedLawyers.length === 0 ? (
                  <p className="text-center text-gray-500">لا توجد حسابات محامين لإدارتها.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم الكامل</TableHead>
                          <TableHead>البريد الإلكتروني</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {managedLawyers.map((lawyer) => (
                          <TableRow key={lawyer.id}>
                            <TableCell>{lawyer.first_name} {lawyer.last_name}</TableCell>
                            <TableCell>{lawyer.email}</TableCell>
                            <TableCell>{lawyer.status}</TableCell>
                            <TableCell className="text-right space-x-2">
                              {lawyer.status === 'active' ? (
                                <Button
                                  variant="secondary"
                                  onClick={() => handleUpdateStatus(lawyer.id, 'disabled')}
                                  disabled={actionLoading === lawyer.id}
                                >
                                  <span className="flex items-center justify-center">
                                    {actionLoading === lawyer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>تعطيل</span>}
                                  </span>
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(lawyer.id, 'active')}
                                  disabled={actionLoading === lawyer.id}
                                >
                                  <span className="flex items-center justify-center">
                                    {actionLoading === lawyer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>تفعيل</span>}
                                  </span>
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteLawyer(lawyer.id)}
                                disabled={actionLoading === lawyer.id}
                              >
                                <span className="flex items-center justify-center">
                                  {actionLoading === lawyer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>حذف</span>}
                                </span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
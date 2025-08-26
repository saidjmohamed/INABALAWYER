import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession, Profile } from '@/contexts/SessionContext';
import { Navigate, Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { Loader2, ArrowRight } from 'lucide-react';

type LawyerProfile = Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'address'>;

const LawyersDirectory = () => {
  const { session, loading: sessionLoading } = useSession();
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchActiveLawyers = async () => {
      setLoadingData(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, address')
        .eq('role', 'lawyer')
        .eq('status', 'active');

      if (error) {
        showError('فشل في جلب قائمة المحامين: ' + error.message);
      } else {
        setLawyers(data || []);
      }
      setLoadingData(false);
    };

    if (!sessionLoading && session) {
      fetchActiveLawyers();
    }
  }, [sessionLoading, session]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">جدول المحامين</h1>
        <Button variant="outline" asChild>
          <Link to="/"><ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية</Link>
        </Button>
      </header>

      <main className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>المحامون المعتمدون</CardTitle>
            <CardDescription>قائمة بجميع المحامين النشطين على المنصة.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : lawyers.length === 0 ? (
              <p className="text-center text-gray-500">لا يوجد محامون نشطون حالياً.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم الكامل</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>العنوان</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lawyers.map((lawyer) => (
                      <TableRow key={lawyer.id}>
                        <TableCell>{lawyer.first_name} {lawyer.last_name}</TableCell>
                        <TableCell>{lawyer.email}</TableCell>
                        <TableCell>{lawyer.phone}</TableCell>
                        <TableCell>{lawyer.address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LawyersDirectory;
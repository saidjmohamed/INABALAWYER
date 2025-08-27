import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession, Profile } from '@/contexts/SessionContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
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
import { Loader2, ArrowRight, MessageSquare } from 'lucide-react';
import { usePresence } from '@/contexts/PresenceContext';

type LawyerProfile = Pick<Profile, 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'address' | 'specialties' | 'experience_years' | 'languages' | 'organization'>;

const LawyersDirectory = () => {
  const { session, user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [startingChatId, setStartingChatId] = useState<string | null>(null);
  const { onlineUsers } = usePresence();

  useEffect(() => {
    const fetchActiveLawyers = async () => {
      setLoadingData(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, address, specialties, experience_years, languages, organization')
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

  const handleStartConversation = async (otherLawyer: LawyerProfile) => {
    if (!user || user.id === otherLawyer.id) return;
    setStartingChatId(otherLawyer.id);

    try {
      const { data: conversationId, error } = await supabase.rpc('start_conversation', {
        other_user_id: otherLawyer.id,
      });

      if (error) throw error;

      if (conversationId) {
        navigate(`/conversations/${conversationId}`);
      } else {
        throw new Error("Could not start or find conversation.");
      }

    } catch (error: any) {
      showError('فشل في بدء المحادثة: ' + error.message);
    } finally {
      setStartingChatId(null);
    }
  };

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
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto py-4 border-b mb-8">
        <h1 className="text-3xl font-bold text-gray-900">جدول المحامين</h1>
        <Button variant="outline" asChild>
          <Link to="/">
            <span className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة للرئيسية
            </span>
          </Link>
        </Button>
      </header>

      <main className="max-w-7xl mx-auto">
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
                      <TableHead>المنظمة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lawyers.filter(l => l.id !== user?.id).map((lawyer) => {
                      const isOnline = onlineUsers.includes(lawyer.id);
                      return (
                        <TableRow key={lawyer.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {lawyer.first_name} {lawyer.last_name}
                              {isOnline && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{lawyer.email}</TableCell>
                          <TableCell>{lawyer.phone || 'غير محدد'}</TableCell>
                          <TableCell>{lawyer.organization || 'غير محدد'}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartConversation(lawyer)}
                              disabled={startingChatId === lawyer.id}
                            >
                              {startingChatId === lawyer.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MessageSquare className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
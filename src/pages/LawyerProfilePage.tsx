import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Profile } from '../types';
import { useSession } from '../contexts/SessionContext';
import { Loader2, ArrowRight, Mail, Phone, MapPin, Briefcase, Languages, User, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { showError, showSuccess } from '../utils/toast';

const LawyerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSession();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  useEffect(() => {
    const fetchLawyerProfile = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (error) throw error;
        setLawyer(data as Profile);
      } catch (error: any) {
        showError('لم يتم العثور على المحامي أو أن الحساب غير نشط.');
        setLawyer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerProfile();
  }, [id]);

  const handleStartConversation = async () => {
    if (!user || !lawyer) {
      showError('يجب تسجيل الدخول لبدء محادثة.');
      return;
    }
    if (user.id === lawyer.id) {
      showError('لا يمكنك بدء محادثة مع نفسك.');
      return;
    }

    setIsStartingConversation(true);
    try {
      const { data: conversationId, error } = await supabase.rpc('start_conversation', {
        other_user_id: lawyer.id,
      });

      if (error) throw error;

      showSuccess('تم بدء المحادثة بنجاح!');
      navigate(`/conversations/${conversationId}`);
    } catch (error: any) {
      showError('فشل في بدء المحادثة: ' + error.message);
    } finally {
      setIsStartingConversation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-150px)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-150px)] text-center">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على المحامي</h2>
        <Button asChild>
          <Link to="/lawyers">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة إلى دليل المحامين
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={lawyer.avatar_url || undefined} alt={`${lawyer.first_name} ${lawyer.last_name}`} />
              <AvatarFallback className="text-3xl">
                {lawyer.first_name?.[0]}{lawyer.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl">{lawyer.first_name} {lawyer.last_name}</CardTitle>
              <CardDescription className="text-md">@{lawyer.username}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <InfoItem icon={<Mail />} label="البريد الإلكتروني" value={lawyer.email} />
            <InfoItem icon={<Phone />} label="الهاتف" value={lawyer.phone} />
            <InfoItem icon={<MapPin />} label="العنوان" value={lawyer.address} />
            <InfoItem icon={<Briefcase />} label="المنظمة" value={lawyer.organization} />
          </div>
          
          <InfoList icon={<Briefcase />} label="التخصصات" items={lawyer.specialties} />
          <InfoList icon={<Languages />} label="اللغات" items={lawyer.languages} />

          {lawyer.bio && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><User /> نبذة شخصية</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md border whitespace-pre-wrap">{lawyer.bio}</p>
            </div>
          )}
        </CardContent>
        {user?.id !== lawyer.id && (
          <CardFooter>
            <Button className="w-full" onClick={handleStartConversation} disabled={isStartingConversation}>
              {isStartingConversation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <MessageSquare className="ml-2 h-4 w-4" />
                  بدء محادثة
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
  <div className="flex items-center gap-3">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-800">{value || 'غير محدد'}</p>
    </div>
  </div>
);

const InfoList = ({ icon, label, items }: { icon: React.ReactNode, label: string, items: string[] | null | undefined }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="font-semibold mb-2 flex items-center gap-2">{icon} {label}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(item => <Badge key={item} variant="secondary">{item}</Badge>)}
      </div>
    </div>
  );
};

export default LawyerProfilePage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Profile } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MessageSquare, Star, Loader2 } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

interface LawyerCardProps {
  lawyer: Profile;
}

export const LawyerCard = ({ lawyer }: LawyerCardProps) => {
  const { user } = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartConversation = async () => {
    if (!user) {
      showError('يجب تسجيل الدخول لبدء محادثة.');
      return;
    }
    if (user.id === lawyer.id) {
      showError('لا يمكنك بدء محادثة مع نفسك.');
      return;
    }

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={lawyer.avatar_url || undefined} alt={`${lawyer.first_name} ${lawyer.last_name}`} />
          <AvatarFallback className="text-3xl">{getInitials(lawyer.first_name, lawyer.last_name)}</AvatarFallback>
        </Avatar>
        <CardTitle>{lawyer.first_name} {lawyer.last_name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {lawyer.specialties && lawyer.specialties.length > 0 && (
          <div className="flex items-start gap-2">
            <Briefcase className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {lawyer.specialties.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
            </div>
          </div>
        )}
        {lawyer.experience_years !== null && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-700">خبرة {lawyer.experience_years} سنوات</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleStartConversation} disabled={isLoading || user?.id === lawyer.id}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <MessageSquare className="ml-2 h-4 w-4" />
              بدء محادثة
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
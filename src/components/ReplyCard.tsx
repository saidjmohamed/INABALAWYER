import { ReplyWithAuthor } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface ReplyCardProps {
  reply: ReplyWithAuthor;
}

export const ReplyCard = ({ reply }: ReplyCardProps) => {
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Card className="bg-gray-50">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={reply.author.avatar_url || undefined} alt={`${reply.author.first_name} ${reply.author.last_name}`} />
          <AvatarFallback>
            {reply.author ? getInitials(reply.author.first_name, reply.author.last_name) : <User />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base font-semibold">
            {reply.author.first_name} {reply.author.last_name}
          </CardTitle>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: ar })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-gray-800 whitespace-pre-wrap">{reply.content}</p>
      </CardContent>
    </Card>
  );
};
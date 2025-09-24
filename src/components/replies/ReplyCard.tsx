import { Reply } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface ReplyCardProps {
  reply: Reply;
}

export const ReplyCard = ({ reply }: ReplyCardProps) => {
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="flex items-start gap-4 p-4 border-b">
      <Link to={`/lawyers/${reply.author.id}`}>
        <Avatar>
          <AvatarImage src={reply.author.avatar_url || undefined} />
          <AvatarFallback>{getInitials(reply.author.first_name, reply.author.last_name)}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <Link to={`/lawyers/${reply.author.id}`} className="font-semibold hover:underline">
            {reply.author.first_name} {reply.author.last_name}
          </Link>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: ar })}
          </span>
        </div>
        <p className="text-gray-800 whitespace-pre-wrap">{reply.content}</p>
      </div>
    </div>
  );
};
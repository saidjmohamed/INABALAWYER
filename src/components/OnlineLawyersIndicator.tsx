import { usePresence } from '../contexts/PresenceContext';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const OnlineLawyersIndicator = () => {
  const { onlineUsers } = usePresence();
  // We subtract 1 to not count the current user
  const onlineCount = onlineUsers.length > 0 ? onlineUsers.length - 1 : 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/lawyers" className="fixed bottom-8 right-8 z-50">
            <div className="relative flex items-center justify-center bg-primary text-primary-foreground h-16 w-16 rounded-full shadow-lg hover:bg-primary/90 transition-colors">
              <Users className="h-8 w-8" />
              {onlineCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold border-2 border-white">
                  {onlineCount}
                </span>
              )}
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{onlineCount} محامٍ متصل حالياً</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
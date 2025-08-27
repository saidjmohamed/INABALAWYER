import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, MessageSquare, LayoutDashboard, FolderKanban } from "lucide-react";

export function Navbar() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          منصة المساعدة
        </Link>
        <div className="flex items-center gap-4">
          {profile ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/requests">
                  <FolderKanban className="w-4 h-4 ml-2" />
                  الطلبات
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/conversations">
                  <MessageSquare className="w-4 h-4 ml-2" />
                  المحادثات
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile.avatar_url || ''} alt={profile.username || 'User'} />
                      <AvatarFallback>
                        {profile.first_name?.[0]}
                        {profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile.first_name} {profile.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${profile.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>الملف الشخصي</span>
                  </DropdownMenuItem>
                  {profile.role === 'admin' && (
                     <DropdownMenuItem onClick={() => navigate('/admin')}>
                       <LayoutDashboard className="mr-2 h-4 w-4" />
                       <span>لوحة التحكم</span>
                     </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">تسجيل الدخول</Link>
              </Button>
              <Button asChild>
                <Link to="/register">تسجيل</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
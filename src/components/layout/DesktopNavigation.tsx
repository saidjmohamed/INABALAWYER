import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut, User, Shield, Home, Bell, Settings, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Profile } from '@/types';

interface DesktopNavigationProps {
  profile: Profile | null;
  signOut: () => void;
}

export const DesktopNavigation = ({ profile, signOut }: DesktopNavigationProps) => {
  const location = useLocation();

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'طلبات الزملاء', href: '/cases', icon: Bell },
    { name: 'الجهات القضائية', href: '/courts', icon: Scale },
    { name: 'دليل المحامين', href: '/lawyers', icon: User },
    { name: 'المحادثات', href: '/conversations', icon: Settings },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.name}
            variant={location.pathname === item.href ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "touch-friendly hover:bg-white/10 hover:text-header-foreground transition-all duration-200",
              location.pathname === item.href && "bg-white/20"
            )}
          >
            <Link to={item.href}>
              <Icon className="ml-2 h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        );
      })}
      
      <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-4">
        <span className="text-sm text-header-foreground/90">مرحباً، {profile?.first_name || 'مستخدم'}</span>
      </div>

      {profile?.role === 'admin' && (
        <Button variant="ghost" size="sm" asChild className="hover:bg-white/10 hover:text-header-foreground">
          <Link to="/admin">
            <Shield className="ml-2 h-4 w-4" />
            لوحة التحكم
          </Link>
        </Button>
      )}
      
      <Button variant="ghost" size="sm" asChild className="hover:bg-white/10 hover:text-header-foreground">
        <Link to="/profile">
          <User className="ml-2 h-4 w-4" />
          الملف الشخصي
        </Link>
      </Button>
      
      <Button variant="ghost" size="sm" onClick={signOut} className="hover:bg-white/10 hover:text-header-foreground">
        <LogOut className="ml-2 h-4 w-4" />
        تسجيل الخروج
      </Button>
    </nav>
  );
};
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { Button } from '../ui/button';
import { LogOut, User, Shield, Home, Menu, Bell, Settings } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const { session, profile, signOut, loading: sessionLoading } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation();

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'طلبات الزملاء', href: '/cases', icon: Bell },
    { name: 'الجهات القضائية', href: '/courts', icon: Shield },
    { name: 'دليل المحامين', href: '/lawyers', icon: User },
    { name: 'المحادثات', href: '/conversations', icon: Settings },
  ];

  const headerNavLinks = (
    <>
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
                "hover:bg-white/10 hover:text-header-foreground transition-all duration-200",
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
      </nav>
      
      <div className="hidden md:flex items-center gap-2 border-r border-white/20 pr-4 mr-4">
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
    </>
  );

  const sheetNavLinks = (
    <div className="flex flex-col gap-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.name}
            variant={location.pathname === item.href ? "default" : "ghost"}
            size="sm"
            asChild
            className="justify-start"
            onClick={() => setIsSheetOpen(false)}
          >
            <Link to={item.href}>
              <Icon className="ml-2 h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        );
      })}
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <Button variant="ghost" size="sm" asChild className="justify-start" onClick={() => setIsSheetOpen(false)}>
          <Link to="/profile">
            <User className="ml-2 h-4 w-4" />
            الملف الشخصي
          </Link>
        </Button>
        
        <Button variant="ghost" size="sm" onClick={() => { signOut(); setIsSheetOpen(false); }} className="justify-start">
          <LogOut className="ml-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg sticky top-0 z-40 h-16 flex items-center backdrop-blur-sm bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hover:bg-white/10 text-white">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg">إنابة ومعلومة</span>
              </Link>
            </Button>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {session && headerNavLinks}
          </nav>

          <div className="md:hidden">
            {session && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="text-white border-white/30 hover:bg-white/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">مرحباً، {profile?.first_name || 'مستخدم'}</h3>
                    </div>
                    <div className="flex-1 py-4">
                      {session && sheetNavLinks}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>
      
      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 -z-10"></div>
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
import { Link, Outlet } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { Button } from '../ui/button';
import { LogOut, User, Shield, Home, Menu, Loader2 } from 'lucide-react';
import { OnlineLawyersIndicator } from '../OnlineLawyersIndicator';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';

const MainLayout = () => {
  const { session, profile, signOut, loading: sessionLoading } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const headerNavLinks = (
    <>
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
          ملفي الشخصي
        </Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={signOut} className="hover:bg-white/10 hover:text-header-foreground">
        <LogOut className="ml-2 h-4 w-4" />
        تسجيل الخروج
      </Button>
    </>
  );

  const sheetNavLinks = (
    <>
      {profile?.role === 'admin' && (
        <Button variant="ghost" size="sm" asChild onClick={() => setIsSheetOpen(false)}>
          <Link to="/admin">
            <Shield className="ml-2 h-4 w-4" />
            لوحة التحكم
          </Link>
        </Button>
      )}
      <Button variant="ghost" size="sm" asChild onClick={() => setIsSheetOpen(false)}>
        <Link to="/profile">
          <User className="ml-2 h-4 w-4" />
          ملفي الشخصي
        </Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={() => { signOut(); setIsSheetOpen(false); }}>
        <LogOut className="ml-2 h-4 w-4" />
        تسجيل الخروج
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-header text-header-foreground shadow-md sticky top-0 z-40 h-[72px] flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Button variant="ghost" asChild className="hover:bg-white/10 hover:text-header-foreground">
            <Link to="/">
              <Home className="ml-2 h-4 w-4" />
              الرئيسية
            </Link>
          </Button>
          <nav className="hidden md:flex items-center gap-2">
            {session && (
              <>
                <span className="text-sm text-header-foreground/80">مرحباً، {profile?.first_name || 'مستخدم'}</span>
                {headerNavLinks}
              </>
            )}
          </nav>
          <div className="md:hidden">
            {session && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="text-header-foreground border-header-foreground/50 hover:bg-white/10">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col items-start gap-4 pt-8">
                    {sheetNavLinks}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>
      <main className="relative">
        <Outlet />
      </main>
      {session && <OnlineLawyersIndicator />}
    </div>
  );
};

export default MainLayout;
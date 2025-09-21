import { Link, Outlet } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { Button } from '../ui/button';
import { Home } from 'lucide-react';
import { OnlineLawyersIndicator } from '../OnlineLawyersIndicator';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';

const MainLayout = () => {
  const { session, profile, signOut, loading: sessionLoading } = useSession();

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg sticky top-0 z-40 h-16 flex items-center safe-area-top">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hover:bg-white/10 text-white touch-friendly">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg hidden sm:block">إنابة ومعلومة</span>
              </Link>
            </Button>
          </div>

          {session && (
            <>
              <DesktopNavigation profile={profile} signOut={signOut} />
              <MobileNavigation profile={profile} signOut={signOut} />
            </>
          )}
        </div>
      </header>
      
      <main className="relative safe-area-bottom">
        <Outlet />
      </main>
      
      {session && <OnlineLawyersIndicator />}
    </div>
  );
};

export default MainLayout;
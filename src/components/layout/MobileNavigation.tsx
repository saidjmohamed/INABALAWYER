import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut, User, Shield, Home, Bell, Settings, Scale } from 'lucide-react';
import { Profile } from '@/types';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface MobileNavigationProps {
  profile: Profile | null;
  signOut: () => void;
}

export const MobileNavigation = ({ profile, signOut }: MobileNavigationProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'طلبات الزملاء', href: '/cases', icon: Bell },
    { name: 'الجهات القضائية', href: '/courts', icon: Scale },
    { name: 'دليل المحامين', href: '/lawyers', icon: User },
    { name: 'المحادثات', href: '/conversations', icon: Settings },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="text-white border-white/30 hover:bg-white/10 touch-friendly">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 safe-area-left">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h3 className="font-semibold">مرحباً، {profile?.first_name || 'مستخدم'}</h3>
            </div>
            <div className="flex-1 py-4 overflow-y-auto">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.name}
                      variant={location.pathname === item.href ? "default" : "ghost"}
                      size="sm"
                      asChild
                      className="justify-start touch-friendly"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Link to={item.href}>
                        <Icon className="ml-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </Button>
                  );
                })}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Button variant="ghost" size="sm" asChild className="justify-start touch-friendly" onClick={() => setIsSheetOpen(false)}>
                  <Link to="/profile">
                    <User className="ml-2 h-4 w-4" />
                    الملف الشخصي
                  </Link>
                </Button>
                
                {profile?.role === 'admin' && (
                  <Button variant="ghost" size="sm" asChild className="justify-start touch-friendly" onClick={() => setIsSheetOpen(false)}>
                    <Link to="/admin">
                      <Shield className="ml-2 h-4 w-4" />
                      لوحة التحكم
                    </Link>
                  </Button>
                )}
                
                <Button variant="ghost" size="sm" onClick={() => { signOut(); setIsSheetOpen(false); }} className="justify-start touch-friendly">
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
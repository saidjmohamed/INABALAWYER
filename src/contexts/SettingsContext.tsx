import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';

interface SettingsContextValue {
  isMaintenanceMode: boolean;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value')
        .eq('key', 'maintenance_mode')
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
        console.error("Error fetching settings:", error);
      } else if (data) {
        setIsMaintenanceMode(data.value === 'true');
      }
      setLoading(false);
    };

    fetchSettings();

    const channel = supabase
      .channel('app_settings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_settings', filter: 'key=eq.maintenance_mode' },
        (payload) => {
          if (payload.new && 'value' in payload.new) {
             setIsMaintenanceMode((payload.new as { value: string }).value === 'true');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const value = { isMaintenanceMode, loading };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
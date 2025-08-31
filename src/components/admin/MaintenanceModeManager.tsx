import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Power, PowerOff } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

const MAINTENANCE_KEY = 'maintenance_mode';

export const MaintenanceModeManager = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', MAINTENANCE_KEY)
        .single();

      if (data) {
        setIsMaintenance(data.value === 'true');
      } else if (error && error.code !== 'PGRST116') {
        showError('فشل في جلب حالة الصيانة.');
      }
      setIsLoading(false);
    };
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    const newValue = !isMaintenance;
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ key: MAINTENANCE_KEY, value: newValue.toString() });

      if (error) throw error;

      setIsMaintenance(newValue);
      showSuccess(`تم ${newValue ? 'تفعيل' : 'إيقاف'} وضع الصيانة بنجاح.`);
    } catch (error: any) {
      showError('فشل في تحديث حالة الصيانة: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>وضع الصيانة</CardTitle>
        <CardDescription>
          عند تفعيل وضع الصيانة، لن يتمكن سوى المشرفين من الوصول إلى الموقع.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleToggle}
          variant={isMaintenance ? 'destructive' : 'success'}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isMaintenance ? (
            <>
              <PowerOff className="ml-2 h-4 w-4" />
              <span>إيقاف وضع الصيانة</span>
            </>
          ) : (
            <>
              <Power className="ml-2 h-4 w-4" />
              <span>تفعيل وضع الصيانة</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
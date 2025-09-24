import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

const DESIGNER_AVATAR_KEY = 'designer_avatar_url';
const DESIGNER_AVATAR_PATH = 'public/designer_avatar.png';

export const DesignerProfileManager = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      setIsFetching(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', DESIGNER_AVATAR_KEY)
        .single();

      if (data && data.value) {
        setAvatarUrl(data.value);
      } else if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        showError('فشل في جلب الصورة الحالية.');
      }
      setIsFetching(false);
    };
    fetchAvatar();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError('الرجاء اختيار ملف أولاً.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Upload file to Supabase Storage, overwriting if it exists
      const { error: uploadError } = await supabase.storage
        .from('app_assets')
        .upload(DESIGNER_AVATAR_PATH, selectedFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: urlData } = supabase.storage
        .from('app_assets')
        .getPublicUrl(DESIGNER_AVATAR_PATH);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Could not get public URL for the uploaded file.');
      }
      
      // Add a timestamp to bust the cache
      const newUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

      // 3. Save the URL in the app_settings table
      const { error: dbError } = await supabase
        .from('app_settings')
        .upsert({ key: DESIGNER_AVATAR_KEY, value: newUrl });

      if (dbError) throw dbError;

      setAvatarUrl(newUrl);
      setSelectedFile(null);
      showSuccess('تم تحديث الصورة بنجاح.');
    } catch (error: any) {
      showError('فشل في رفع الصورة: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>صورة المصمم في صفحة "حول التطبيق"</CardTitle>
        <CardDescription>
          قم برفع أو تحديث الصورة الشخصية التي تظهر في صفحة "حول التطبيق".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-sm font-medium">الصورة الحالية:</h3>
          {isFetching ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Avatar className="h-32 w-32">
              <AvatarImage src={avatarUrl || undefined} alt="صورة المصمم" />
              <AvatarFallback className="text-4xl">SM</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="space-y-2">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={isLoading || !selectedFile} className="w-full">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Upload className="ml-2 h-4 w-4" />
                <span>رفع وتحديث الصورة</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
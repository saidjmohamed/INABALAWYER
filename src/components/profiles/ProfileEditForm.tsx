import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../integrations/supabase/client';
import { useSession } from '../../contexts/SessionContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { showSuccess, showError } from '../../utils/toast';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  first_name: z.string().min(1, 'الاسم الأول مطلوب'),
  last_name: z.string().min(1, 'الاسم الأخير مطلوب'),
  phone: z.string().optional(),
  address: z.string().optional(),
  username: z.string().optional(),
  specialties: z.string().optional(), // Storing as comma-separated string for simplicity
  experience_years: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().int().min(0, 'يجب أن تكون سنوات الخبرة رقمًا موجبًا').nullable().optional(),
  ),
  languages: z.string().optional(), // Storing as comma-separated string for simplicity
  bio: z.string().optional(),
  avatar_url: z.string().url('يجب أن يكون رابط الصورة صالحًا').optional().or(z.literal('')),
  organization: z.string().optional(), // New field
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  onSuccess: () => void;
}

export const ProfileEditForm = ({ onSuccess }: ProfileEditFormProps) => {
  const { profile, user, refetchProfile } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      username: profile?.username || '',
      specialties: profile?.specialties?.join(', ') || '',
      experience_years: profile?.experience_years || null,
      languages: profile?.languages?.join(', ') || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || '',
      organization: profile?.organization || '', // New field
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        username: profile.username || '',
        specialties: profile.specialties?.join(', ') || '',
        experience_years: profile.experience_years || null,
        languages: profile.languages?.join(', ') || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        organization: profile.organization || '', // New field
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      showError('يجب أن تكون مسجلاً للدخول لتحديث ملفك الشخصي.');
      return;
    }
    setIsLoading(true);

    const { specialties, languages, ...rest } = values;

    const updateData = {
      ...rest,
      specialties: specialties ? specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
      languages: languages ? languages.split(',').map(l => l.trim()).filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);
    
    setIsLoading(false);

    if (error) {
      showError('فشل في تحديث الملف الشخصي: ' + error.message);
    } else {
      showSuccess('تم تحديث الملف الشخصي بنجاح.');
      await refetchProfile();
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الأول</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الأخير</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المستخدم</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المنظمة التابع لها</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>التخصصات (افصل بينها بفاصلة)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="القانون الجنائي، القانون المدني" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience_years"
          render={({ field }) => (
            <FormItem>
              <FormLabel>سنوات الخبرة</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اللغات (افصل بينها بفاصلة)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="العربية، الفرنسية، الإنجليزية" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نبذة شخصية</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الصورة الرمزية</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com/avatar.jpg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          <span className="flex items-center justify-center">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'حفظ التغييرات'}
          </span>
        </Button>
      </form>
    </Form>
  );
};
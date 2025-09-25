import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { showSuccess, showError } from '../../utils/toast';
import { useState } from 'react';
import { Loader2, User, Mail, Lock, Phone, MapPin, Briefcase, AtSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const signUpSchema = z.object({
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
  password: z.string().min(6, { message: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' }),
  first_name: z.string().min(1, { message: 'الاسم الأول مطلوب.' }),
  last_name: z.string().min(1, { message: 'الاسم الأخير مطلوب.' }),
  phone: z.string()
    .min(10, { message: 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل.' })
    .regex(/^(0|\+213)[5-7][0-9]{8}$/, { message: 'رقم الهاتف يجب أن يكون جزائريًا صالحًا (مثال: 0558357689 أو +213558357689).' }),
  address: z.string().min(1, { message: 'العنوان المهني مطلوب.' }),
  username: z.string().min(3, { message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل.' }),
  organization: z.string().min(1, { message: 'المنظمة التابع لها مطلوبة.' }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      address: '',
      username: '',
      organization: '',
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const { email, password, ...metaData } = values;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metaData,
        },
      });

      if (error) {
        // معالجة أخطاء Supabase المحددة
        if (error.message.includes('User already registered')) {
          showError('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.');
        } else if (error.message.includes('Invalid phone')) {
          showError('رقم الهاتف غير صالح. يرجى التحقق من التنسيق.');
        } else {
          showError(`حدث خطأ: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        showSuccess('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.');
        form.reset();
        navigate('/login');
      } else {
        showError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      }
    } catch (error: any) {
      showError(`فشل في إنشاء الحساب: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  الاسم الأول
                </FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسمك الأول" {...field} />
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
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  الاسم الأخير
                </FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسمك الأخير" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                كلمة المرور
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="كلمة مرور قوية (6+ أحرف)" {...field} />
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
              <FormLabel className="flex items-center gap-2">
                <AtSign className="h-4 w-4" />
                اسم المستخدم
              </FormLabel>
              <FormControl>
                <Input placeholder="@اسم_المستخدم" {...field} />
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
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                رقم الهاتف
              </FormLabel>
              <FormControl>
                <Input placeholder="0558357689 أو +213558357689" {...field} />
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
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                العنوان المهني
              </FormLabel>
              <FormControl>
                <Input placeholder="عنوان مكتبك المهني" {...field} />
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
              <FormLabel className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                المنظمة التابع لها
              </FormLabel>
              <FormControl>
                <Input placeholder="مثال: نقابة المحامين" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          disabled={isLoading}
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
            {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب جديد'}
          </span>
        </Button>
      </form>
    </Form>
  );
};
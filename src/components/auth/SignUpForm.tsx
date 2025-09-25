import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { showSuccess, showError } from '../../utils/toast';
import { useState } from 'react';
import { Loader2, User, Mail, Lock, Phone, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const signUpSchema = z.object({
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل (يمكن أن تكون بسيطة مثل اسمك + رقمك).' }),
  first_name: z.string().min(1, { message: 'الاسم الأول مطلوب.' }),
  last_name: z.string().min(1, { message: 'الاسم الأخير مطلوب.' }),
  // الحقول الاختيارية: لا تحقق إجباري، لكن يمكن إضافة تنسيق إذا أردت
  phone: z.string()
    .optional()
    .refine((val) => !val || /^(0|\+213)[5-7][0-9]{8}$/.test(val), { 
      message: 'إذا أدخلت رقم هاتف، يجب أن يكون جزائريًا صالحًا (مثال: 0558357689 أو +213558357689).', 
      path: ['phone'] 
    }),
  address: z.string().optional(),
  organization: z.string().optional(),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onError?: (error: string) => void;
}

export const SignUpForm = ({ onError }: SignUpFormProps) => {
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
      organization: '',
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      // إعداد البيانات الإضافية للمحامي (بدون username)
      const metaData = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone || null, // يمكن أن يكون null إذا لم يُدخل
        address: values.address || null,
        organization: values.organization || null,
      };

      console.log('البيانات المرسلة للتسجيل:', { email: values.email, metaData }); // تسجيل للتحقق

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: metaData, // هذه ستُحفظ كـ raw_user_meta_data وتُستخدم في handle_new_user
        },
      });

      if (error) {
        console.error('خطأ في التسجيل:', error); // تسجيل الخطأ للتحقق
        let errorMessage = 'حدث خطأ غير متوقع.';
        if (error.message.includes('User already registered')) {
          errorMessage = 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.';
        } else if (error.message.includes('Password should be at least 6 characters')) {
          errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.';
        } else {
          errorMessage = `حدث خطأ: ${error.message}`;
        }
        
        showError(errorMessage);
        onError?.(errorMessage);
        return;
      }

      if (data.user) {
        console.log('تم إنشاء المستخدم بنجاح، ID:', data.user.id); // تسجيل نجاح
        showSuccess('تم إنشاء الحساب بنجاح! معلوماتك المهنية (الاسم، الهاتف، العنوان، المنظمة) تم حفظها تلقائيًا إذا أدخلتها. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.');
        form.reset();
        setTimeout(() => navigate('/login'), 3000); // تأخير أطول لقراءة الرسالة
      } else {
        const errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
        showError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (error: any) {
      console.error('خطأ عام في التسجيل:', error); // تسجيل الخطأ العام
      const errorMessage = `فشل في إنشاء الحساب: ${error.message}`;
      showError(errorMessage);
      onError?.(errorMessage);
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
                  الاسم الأول *
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
                  الاسم الأخير *
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
                البريد الإلكتروني *
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
                كلمة المرور *
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="كلمة مرور بسيطة (6+ أحرف)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* الحقول الاختيارية */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                رقم الهاتف (اختياري)
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
                العنوان المهني (اختياري)
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
                المنظمة التابع لها (اختياري)
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
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب جديد'}
          </span>
        </Button>
      </form>
    </Form>
  );
};
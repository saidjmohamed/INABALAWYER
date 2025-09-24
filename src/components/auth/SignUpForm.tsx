import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { showSuccess, showError } from '../../utils/toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const signUpSchema = z.object({
  email: z.string().email({ message: 'الرجاء إدخال بريد إلكتروني صالح.' }),
  password: z.string().min(6, { message: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' }),
  first_name: z.string().min(1, { message: 'الاسم الأول مطلوب.' }),
  last_name: z.string().min(1, { message: 'الاسم الأخير مطلوب.' }),
  phone: z.string().min(1, { message: 'رقم الهاتف مطلوب.' }),
  address: z.string().min(1, { message: 'العنوان المهني مطلوب.' }),
  username: z.string().min(1, { message: 'اسم المستخدم مطلوب.' }),
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
    const { email, password, ...metaData } = values;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metaData,
      },
    });
    setIsLoading(false);

    if (error) {
      showError(error.message);
    } else {
      showSuccess('تم إنشاء الحساب بنجاح! يرجى مراجعة بريدك الإلكتروني لتفعيل الحساب.');
      form.reset();
      navigate('/login');
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
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
              <FormLabel>العنوان المهني</FormLabel>
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          <span className="flex items-center justify-center">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>إنشاء حساب</span>}
          </span>
        </Button>
      </form>
    </Form>
  );
};
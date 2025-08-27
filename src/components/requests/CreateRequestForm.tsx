import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, PlusCircle } from 'lucide-react';

interface Court {
  id: string;
  name: string;
}

const requestSchema = z.object({
  type: z.enum(['information_request', 'representation', 'other_request'], { // Updated enum values
    required_error: "نوع الإنابة مطلوب"
  }),
  court_id: z.string().uuid('يجب اختيار المحكمة'),
  case_number: z.string().min(1, 'رقم القضية مطلوب'),
  section: z.string().optional(),
  details: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface CreateRequestFormProps {
  onSuccess: () => void;
}

export const CreateRequestForm = ({ onSuccess }: CreateRequestFormProps) => {
  const { user } = useSession();
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      case_number: '',
      section: '',
      details: '',
    },
  });

  useEffect(() => {
    const fetchCourts = async () => {
      const { data, error } = await supabase.from('courts').select('id, name');
      if (error) {
        showError('Failed to fetch courts.');
      } else {
        setCourts(data || []);
      }
    };
    if (isOpen) {
      fetchCourts();
    }
  }, [isOpen]);

  const onSubmit = async (values: RequestFormValues) => {
    if (!user) {
      showError('You must be logged in to create a request.');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.from('requests').insert({
      ...values,
      creator_id: user.id,
    });
    setIsLoading(false);

    if (error) {
      showError(error.message);
    } else {
      showSuccess('تم إنشاء الطلب بنجاح.');
      form.reset();
      setIsOpen(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <span className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة طلب جديد
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء طلب إنابة جديد</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع الإنابة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الإنابة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="information_request">طلب معلومة من تطبيقة</SelectItem> {/* New option */}
                      <SelectItem value="representation">طلب إنابة</SelectItem> {/* Updated label */}
                      <SelectItem value="other_request">طلب آخر</SelectItem> {/* New option */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="court_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المحكمة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المحكمة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courts.map((court) => (
                        <SelectItem key={court.id} value={court.id}>
                          {court.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="case_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم القضية</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>القسم (اختياري)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تفاصيل إضافية (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              <span className="flex items-center justify-center">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>إنشاء الطلب</span>}
              </span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
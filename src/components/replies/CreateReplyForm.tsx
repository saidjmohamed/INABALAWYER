import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../integrations/supabase/client';
import { useSession } from '../../contexts/SessionContext';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { showError } from '../../utils/toast';
import { Loader2 } from 'lucide-react';

const replySchema = z.object({
  content: z.string().min(1, 'محتوى الرد لا يمكن أن يكون فارغًا.'),
});

type ReplyFormValues = z.infer<typeof replySchema>;

interface CreateReplyFormProps {
  caseId: string;
  onReplyAdded: () => void;
}

export const CreateReplyForm = ({ caseId, onReplyAdded }: CreateReplyFormProps) => {
  const { user } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (values: ReplyFormValues) => {
    if (!user) {
      showError('يجب تسجيل الدخول للرد.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('replies').insert({
        case_id: caseId,
        author_id: user.id,
        content: values.content,
      });
      if (error) throw error;
      form.reset();
      onReplyAdded(); // Callback to refresh replies list
    } catch (error: any) {
      showError('فشل في إضافة الرد: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="اكتب ردك هنا..." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'إضافة رد'}
        </Button>
      </form>
    </Form>
  );
};
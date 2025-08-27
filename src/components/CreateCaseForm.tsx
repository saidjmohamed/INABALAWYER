import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Council, Court, Profile } from "../types";
import { supabase } from "../integrations/supabase/client";
import { showSuccess, showError } from "../utils/toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().optional(),
  judicial_body: z.string().min(1, "الرجاء اختيار جهة قضائية"),
});

type CreateCaseFormValues = z.infer<typeof formSchema>;

interface CreateCaseFormProps {
  councils: Council[];
  courts: Court[];
  currentProfile: Profile;
}

export function CreateCaseForm({ councils, courts, currentProfile }: CreateCaseFormProps) {
  const navigate = useNavigate();

  const form = useForm<CreateCaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", judicial_body: "" },
  });

  async function onSubmit(values: CreateCaseFormValues) {
    const [type, id] = values.judicial_body.split(':');
    const isCouncil = type === 'council';

    try {
      const { data, error } = await supabase.from("cases").insert([
        {
          creator_id: currentProfile.id,
          title: values.title,
          description: values.description,
          council_id: isCouncil ? id : null,
          court_id: !isCouncil ? id : null,
        },
      ]).select().single();

      if (error) throw error;

      showSuccess("تم إنشاء القضية بنجاح.");
      navigate(`/cases/${data.id}`);
    } catch (error: any) {
      showError(`فشل في إنشاء القضية: ${error.message}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان القضية</FormLabel>
              <FormControl>
                <Input placeholder="مثال: قضية تعويض عن ضرر" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="judicial_body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الجهة القضائية</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مجلس أو محكمة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {councils.map(council => (
                    <SelectItem key={council.id} value={`council:${council.id}`}>{council.name} (مجلس)</SelectItem>
                  ))}
                  {courts.map(court => (
                    <SelectItem key={court.id} value={`court:${court.id}`}>{court.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف</FormLabel>
              <FormControl>
                <Textarea placeholder="اكتب وصفًا تفصيليًا للقضية..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء القضية"}
        </Button>
      </form>
    </Form>
  );
}
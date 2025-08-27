import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { DateTimePicker } from "./ui/DateTimePicker";
import { Council, Court, Profile, RequestType } from "../types";
import { supabase } from "../integrations/supabase/client";
import { showSuccess, showError } from "../utils/toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  judicial_body: z.string().min(1, "الرجاء اختيار جهة قضائية"),
  request_type: z.enum(["representation", "information_retrieval"], {
    required_error: "الرجاء تحديد نوع الطلب",
  }),
  description: z.string().optional(),
  case_number: z.string().optional(),
  parties: z.string().optional(),
  session_date: z.date().optional(),
}).refine(data => {
  if (data.request_type === 'representation') {
    return !!data.case_number && !!data.parties && !!data.session_date;
  }
  return true;
}, {
  message: "رقم القضية، الأطراف، وتاريخ الجلسة مطلوبة لطلب الإنابة",
  path: ["session_date"],
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

  const requestType = form.watch("request_type");

  async function onSubmit(values: CreateCaseFormValues) {
    const [type, id] = values.judicial_body.split(':');
    const isCouncil = type === 'council';

    const caseData = {
      creator_id: currentProfile.id,
      title: values.title,
      description: values.description,
      council_id: isCouncil ? id : null,
      court_id: !isCouncil ? id : null,
      request_type: values.request_type as RequestType,
      case_number: values.request_type === 'representation' ? values.case_number : null,
      parties: values.request_type === 'representation' ? values.parties : null,
      session_date: values.request_type === 'representation' ? values.session_date?.toISOString() : null,
    };

    try {
      const { data, error } = await supabase.from("cases").insert([caseData]).select().single();
      if (error) throw error;
      showSuccess("تم إنشاء الطلب بنجاح.");
      navigate(`/cases/${data.id}`);
    } catch (error: any) {
      showError(`فشل في إنشاء الطلب: ${error.message}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="request_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>نوع الطلب</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="representation" />
                    </FormControl>
                    <FormLabel className="font-normal">طلب إنابة</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-x-reverse">
                    <FormControl>
                      <RadioGroupItem value="information_retrieval" />
                    </FormControl>
                    <FormLabel className="font-normal">طلب معلومة</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الطلب</FormLabel>
              <FormControl>
                <Input placeholder="مثال: طلب إنابة لحضور جلسة..." {...field} />
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

        {requestType === 'representation' && (
          <div className="space-y-6 p-4 border rounded-md bg-gray-50">
            <FormField
              control={form.control}
              name="case_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم القضية</FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل رقم القضية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الأطراف</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: (مدعي) ضد (مدعى عليه)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="session_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>تاريخ ووقت الجلسة</FormLabel>
                  <FormControl>
                    <DateTimePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف إضافي</FormLabel>
              <FormControl>
                <Textarea placeholder="اكتب وصفًا تفصيليًا للطلب..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء الطلب"}
        </Button>
      </form>
    </Form>
  );
}
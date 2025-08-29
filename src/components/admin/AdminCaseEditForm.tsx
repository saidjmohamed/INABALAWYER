import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { DateTimePicker } from "../ui/DateTimePicker";
import { CaseWithDetails, Council, Court, RequestType, CaseStatus } from "../../types";
import { supabase } from "../../integrations/supabase/client";
import { showSuccess, showError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { JudicialBodySelector } from "../JudicialBodySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const formSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  judicial_body: z.string().min(1, "الرجاء اختيار جهة قضائية"),
  section: z.string().optional(),
  request_type: z.enum(["representation", "information_retrieval"]),
  status: z.enum(["open", "assigned", "completed"]),
  description: z.string().optional(),
  case_number: z.string().optional(),
  plaintiff: z.string().optional(),
  defendant: z.string().optional(),
  legal_representative: z.string().optional(),
  session_date: z.date().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface AdminCaseEditFormProps {
  councils: Council[];
  courts: Court[];
  caseToEdit: CaseWithDetails;
}

export function AdminCaseEditForm({ councils, courts, caseToEdit }: AdminCaseEditFormProps) {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    let judicialBody = '';
    if (caseToEdit.court_id) {
      judicialBody = `court:${caseToEdit.court_id}`;
    } else if (caseToEdit.council_id) {
      judicialBody = `council:${caseToEdit.council_id}`;
    }

    form.reset({
      title: caseToEdit.title,
      judicial_body: judicialBody,
      section: caseToEdit.section || '',
      request_type: caseToEdit.request_type || 'representation',
      status: caseToEdit.status,
      description: caseToEdit.description || '',
      case_number: caseToEdit.case_number || '',
      plaintiff: caseToEdit.plaintiff || '',
      defendant: caseToEdit.defendant || '',
      legal_representative: caseToEdit.legal_representative || '',
      session_date: caseToEdit.session_date ? new Date(caseToEdit.session_date) : null,
    });
  }, [caseToEdit, form]);

  async function onSubmit(values: FormValues) {
    const [type, id] = values.judicial_body.split(':');
    const isCouncil = type === 'council';
    const councilId = isCouncil ? id : (courts.find(c => c.id === id)?.council_id || null);

    const caseData = {
      title: values.title,
      description: values.description,
      council_id: councilId,
      court_id: isCouncil ? null : id,
      section: values.section || null,
      request_type: values.request_type as RequestType,
      status: values.status as CaseStatus,
      case_number: values.case_number || null,
      session_date: values.session_date?.toISOString() || null,
      plaintiff: values.plaintiff || null,
      defendant: values.defendant || null,
      legal_representative: values.legal_representative || null,
    };

    try {
      const { error } = await supabase.from("cases").update(caseData).eq('id', caseToEdit.id);
      if (error) throw error;
      showSuccess("تم تحديث الطلب بنجاح.");
      navigate(`/cases/${caseToEdit.id}`);
    } catch (error: any) {
      showError(`فشل في تحديث الطلب: ${error.message}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>عنوان الطلب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="judicial_body" render={({ field }) => (<FormItem><FormLabel>الجهة القضائية</FormLabel><FormControl><JudicialBodySelector councils={councils} courts={courts} value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="section" render={({ field }) => (<FormItem><FormLabel>القسم / الفرع</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="request_type" render={({ field }) => (<FormItem><FormLabel>نوع الطلب</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-x-reverse"><FormControl><RadioGroupItem value="representation" /></FormControl><FormLabel>إنابة</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-x-reverse"><FormControl><RadioGroupItem value="information_retrieval" /></FormControl><FormLabel>معلومة</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>الحالة</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="open">مفتوح</SelectItem><SelectItem value="assigned">تم إسناده</SelectItem><SelectItem value="completed">مكتمل</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="case_number" render={({ field }) => (<FormItem><FormLabel>رقم القضية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="plaintiff" render={({ field }) => (<FormItem><FormLabel>المدعي</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="defendant" render={({ field }) => (<FormItem><FormLabel>المدعى عليه</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="legal_representative" render={({ field }) => (<FormItem><FormLabel>الممثل القانوني</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="session_date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>تاريخ ووقت الجلسة</FormLabel><FormControl><DateTimePicker date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>وصف إضافي</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}</Button>
      </form>
    </Form>
  );
}
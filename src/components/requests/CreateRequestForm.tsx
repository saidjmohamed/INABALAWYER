"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Court, RequestType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const formSchema = z.object({
  court_id: z.string().uuid("الرجاء اختيار المحكمة"),
  type: z.nativeEnum(RequestType, {
    errorMap: () => ({ message: "الرجاء اختيار نوع الطلب" }),
  }),
  case_number: z.string().min(1, "الرجاء إدخال رقم القضية"),
  section: z.string().optional(),
  details: z.string().optional(),
  session_date: z.string().optional(),
  plaintiff_details: z.string().optional(),
  defendant_details: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === RequestType.SessionRepresentation) {
    if (!data.section?.trim()) {
      ctx.addIssue({ code: "custom", message: "الفرع أو القسم مطلوب", path: ["section"] });
    }
    if (!data.session_date) {
      ctx.addIssue({ code: "custom", message: "تاريخ ووقت الجلسة مطلوب", path: ["session_date"] });
    }
    if (!data.plaintiff_details?.trim()) {
      ctx.addIssue({ code: "custom", message: "تفاصيل المدعي مطلوبة", path: ["plaintiff_details"] });
    }
    if (!data.defendant_details?.trim()) {
      ctx.addIssue({ code: "custom", message: "تفاصيل المدعى عليه مطلوبة", path: ["defendant_details"] });
    }
    if (!data.details?.trim()) {
      ctx.addIssue({ code: "custom", message: "تحديد الطلب في الإنابة مطلوب", path: ["details"] });
    }
  }
});

interface CreateRequestFormProps {
  courts: Court[];
  onSuccess?: () => void;
  courtId?: string;
}

export function CreateRequestForm({
  courts,
  onSuccess,
  courtId,
}: CreateRequestFormProps) {
  const { user } = useUser();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      court_id: courtId || "",
      type: undefined,
      case_number: "",
      section: "",
      details: "",
      session_date: "",
      plaintiff_details: "",
      defendant_details: "",
    },
  });

  const requestType = form.watch("type");

  useEffect(() => {
    if (courtId) {
      form.setValue("court_id", courtId);
    }
  }, [courtId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("يجب عليك تسجيل الدخول لإنشاء طلب");
      return;
    }

    const { error } = await supabase.from("requests").insert({
      ...values,
      creator_id: user.id,
    });

    if (error) {
      toast.error("حدث خطأ أثناء إنشاء الطلب. الرجاء المحاولة مرة أخرى.");
      console.error(error);
    } else {
      toast.success("تم إنشاء طلبك بنجاح!");
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/requests");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="court_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المحكمة</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!!courtId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المحكمة التي تريد طلب الخدمة منها" />
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اختر نوع الطلب من زميلك</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الطلب" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(RequestType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
                <Input placeholder="ادخل رقم القضية" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {requestType === RequestType.SessionRepresentation ? (
          <>
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الفرع أو القسم</FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل الفرع أو القسم" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="session_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاريخ ووقت الجلسة</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plaintiff_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المدعي/المستأنف ومن يمثله</FormLabel>
                  <FormControl>
                    <Textarea placeholder="مثال: فلان الفلاني في حقه الأستاذ..." {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="defendant_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المدعى عليه/المستأنف عليه ومن يمثله</FormLabel>
                  <FormControl>
                    <Textarea placeholder="مثال: ضد علان العلاني في حقه الأستاذ..." {...field} value={field.value || ''} />
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
                  <FormLabel>تحديد الطلب في الإنابة</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="حدد طلبك هنا (مثال: طلب تأجيل، تقديم مذكرة...)"
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الأطراف</FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل أسماء الأطراف (اختياري)" {...field} />
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
                  <FormLabel>تفاصيل إضافية</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أضف أي تفاصيل إضافية هنا (اختياري)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit">إنشاء الطلب</Button>
      </form>
    </Form>
  );
}
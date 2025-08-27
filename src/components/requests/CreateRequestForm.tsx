"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Court, Request } from "@/types";

const formSchema = z.object({
  type: z.enum(["consultation", "representation", "documentation"]),
  case_number: z.string().min(1, "رقم القضية مطلوب"),
  section: z.string().optional(),
  details: z.string().optional(),
  session_date: z.preprocess((arg) => {
    if (typeof arg === "string" && arg) return new Date(arg);
    if (arg instanceof Date) return arg;
    return undefined;
  }, z.date().optional()),
  plaintiff_details: z.string().optional(),
  defendant_details: z.string().optional(),
});

type CreateRequestFormProps = {
  court: Court;
  request?: Request;
  onSuccess: () => void;
};

export function CreateRequestForm({ court, request, onSuccess }: CreateRequestFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: request?.type || "consultation",
      case_number: request?.case_number || "",
      section: request?.section || "",
      details: request?.details || "",
      plaintiff_details: request?.plaintiff_details || "",
      defendant_details: request?.defendant_details || "",
      session_date: request?.session_date ? new Date(request.session_date) : undefined,
    },
  });

  const requestType = form.watch("type");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to create a request." });
      return;
    }

    const requestData = {
      ...values,
      session_date: values.session_date ? values.session_date.toISOString() : null,
      court_id: court.id,
      creator_id: user.id,
    };

    let response;
    if (request) {
      response = await supabase.from("requests").update(requestData).eq("id", request.id).select();
    } else {
      response = await supabase.from("requests").insert(requestData).select();
    }

    const { error } = response;

    if (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء حفظ الطلب. الرجاء المحاولة مرة أخرى." });
      console.error("Error saving request:", error);
    } else {
      toast({ title: "نجاح", description: "تم حفظ الطلب بنجاح." });
      onSuccess();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع الطلب</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الطلب" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="consultation">طلب استشارة</SelectItem>
                  <SelectItem value="representation">طلب إنابة</SelectItem>
                  <SelectItem value="documentation">طلب توثيق</SelectItem>
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
        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدائرة</FormLabel>
              <FormControl>
                <Input placeholder="ادخل اسم الدائرة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {requestType === "representation" && (
          <>
            <FormField
              control={form.control}
              name="session_date"
              render={({ field }) => {
                const formatDateForInput = (date: any) => {
                  if (!date) return '';
                  try {
                    const d = new Date(date);
                    if (isNaN(d.getTime())) return '';
                    
                    const year = d.getFullYear();
                    const month = (d.getMonth() + 1).toString().padStart(2, '0');
                    const day = d.getDate().toString().padStart(2, '0');
                    const hours = d.getHours().toString().padStart(2, '0');
                    const minutes = d.getMinutes().toString().padStart(2, '0');
                    
                    return `${year}-${month}-${day}T${hours}:${minutes}`;
                  } catch (error) {
                    return '';
                  }
                };

                return (
                  <FormItem>
                    <FormLabel>تاريخ ووقت الجلسة</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={formatDateForInput(field.value)}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="plaintiff_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>بيانات المدعي</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ادخل اسم المدعي وبياناته" {...field} value={field.value || ''} />
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
                  <FormLabel>بيانات المدعى عليه</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ادخل اسم المدعى عليه وبياناته" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تفاصيل الطلب</FormLabel>
              <FormControl>
                <Textarea placeholder="ادخل تفاصيل الطلب" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">حفظ</Button>
        </div>
      </form>
    </Form>
  );
}
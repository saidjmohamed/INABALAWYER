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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Court, Profile, RequestType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import React from "react";

const requestTypes: { value: RequestType; label: string }[] = [
  { value: "representation", label: "انابة" },
  { value: "information_retrieval", label: "معلومة" },
  { value: "other", label: "طلب اخر من المحكمة" },
];

const formSchema = z.object({
  court_id: z.string().uuid("الرجاء اختيار محكمة صالحة"),
  type: z.enum(["representation", "information_retrieval", "other"], {
    required_error: "الرجاء اختيار نوع الطلب",
  }),
  case_number: z.string().min(1, "الرجاء إدخال رقم القضية"),
  plaintiff_details: z.string().optional(),
  defendant_details: z.string().optional(),
  session_date: z.date().optional(),
  details: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'representation') {
    if (!data.plaintiff_details) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "تفاصيل الطرف الأول مطلوبة", path: ['plaintiff_details'] });
    }
    if (!data.defendant_details) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "تفاصيل الطرف الثاني مطلوبة", path: ['defendant_details'] });
    }
    if (!data.session_date) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "تاريخ ووقت الجلسة مطلوب", path: ['session_date'] });
    }
  }
  if (data.type === 'information_retrieval') {
     if (!data.plaintiff_details) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "تفاصيل الطرف الأول مطلوبة", path: ['plaintiff_details'] });
    }
    if (!data.defendant_details) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "تفاصيل الطرف الثاني مطلوبة", path: ['defendant_details'] });
    }
    if (!data.details) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "الرجاء تحديد المعلومة المطلوبة", path: ['details'] });
    }
  }
  if (data.type === 'other') {
    if (!data.details) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "الرجاء إدخال تفاصيل الطلب", path: ['details'] });
    }
  }
});

type CreateRequestFormValues = z.infer<typeof formSchema>;

interface CreateRequestFormProps {
  courts: Court[];
  currentProfile: Profile;
  onFormSubmit?: () => void;
  defaultCourtId?: string;
}

export function CreateRequestForm({
  courts,
  currentProfile,
  onFormSubmit,
  defaultCourtId,
}: CreateRequestFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<CreateRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      court_id: defaultCourtId || "",
      case_number: "",
      plaintiff_details: "",
      defendant_details: "",
      details: "",
    },
  });

  const requestType = form.watch("type");

  async function onSubmit(values: CreateRequestFormValues) {
    try {
      const { data, error } = await supabase.from("requests").insert([
        {
          creator_id: currentProfile.id,
          court_id: values.court_id,
          type: values.type,
          case_number: values.case_number,
          plaintiff_details: values.plaintiff_details,
          defendant_details: values.defendant_details,
          session_date: values.session_date?.toISOString(),
          details: values.details,
          status: "open",
        },
      ]).select().single();

      if (error) {
        throw error;
      }

      toast({
        title: "تم بنجاح",
        description: "تم إنشاء طلبك بنجاح.",
      });

      if (onFormSubmit) {
        onFormSubmit();
      }
      
      navigate(`/requests/${data.id}`);

    } catch (error: any) {
      console.error("Error creating request:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل في إنشاء الطلب. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }

  const parentCourts = courts.filter((court) => !court.parent_id);
  const getChildCourts = (parentId: string) => {
    return courts.filter((court) => court.parent_id === parentId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="court_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المحكمة</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المحكمة المختصة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parentCourts.map((parent) => (
                    <React.Fragment key={parent.id}>
                      <SelectItem value={parent.id} className="font-semibold">
                        {parent.name}
                      </SelectItem>
                      {getChildCourts(parent.id).map((child) => (
                        <SelectItem key={child.id} value={child.id} className="pr-8">
                          {child.name}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع الطلب</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الطلب" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {requestTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
        </div>

        {(requestType === 'representation' || requestType === 'information_retrieval') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="plaintiff_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الطرف الأول (المدعي/المستأنف)</FormLabel>
                    <FormControl>
                      <Input placeholder="الاسم الكامل، المحامي..." {...field} />
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
                    <FormLabel>الطرف الثاني (المدعى عليه/المستأنف عليه)</FormLabel>
                    <FormControl>
                      <Input placeholder="الاسم الكامل، المحامي..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        )}

        {requestType === 'representation' && (
          <FormField
            control={form.control}
            name="session_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>تاريخ ووقت الجلسة</FormLabel>
                  <DateTimePicker date={field.value} setDate={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(requestType === 'information_retrieval' || requestType === 'other') && (
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {requestType === 'information_retrieval' ? 'المعلومة المطلوبة' : 'تفاصيل الطلب'}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      requestType === 'information_retrieval'
                        ? "اكتب تفاصيل المعلومة التي تريدها..."
                        : "اكتب تفاصيل طلبك هنا..."
                    }
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء الطلب"}
        </Button>
      </form>
    </Form>
  );
}
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase";
import { Court, RequestType } from "@/types";
import { useEffect, useState } from "react";

const formSchema = z.object({
  court_id: z.string().uuid({ message: "الرجاء اختيار المحكمة" }),
  type: z.nativeEnum(RequestType, {
    errorMap: () => ({ message: "الرجاء اختيار نوع الطلب" }),
  }),
  case_number: z.string().min(1, { message: "الرجاء إدخال رقم القضية" }),
  section: z.string().optional(),
  details: z.string().optional(),
});

type CreateRequestFormValues = z.infer<typeof formSchema>;

interface CreateRequestFormProps {
  onSuccess?: () => void;
  courtId?: string;
}

export function CreateRequestForm({ onSuccess, courtId }: CreateRequestFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [courts, setCourts] = useState<Court[]>([]);

  useEffect(() => {
    const fetchCourts = async () => {
      const { data, error } = await supabase.from("courts").select("*");
      if (error) {
        console.error("Error fetching courts:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب قائمة المحاكم.",
          variant: "destructive",
        });
      } else {
        setCourts(data);
      }
    };
    fetchCourts();
  }, [toast]);

  const form = useForm<CreateRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      court_id: courtId || "",
      case_number: "",
      section: "",
      details: "",
    },
  });

  async function onSubmit(values: CreateRequestFormValues) {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب أن تكون مسجلاً للدخول لإنشاء طلب.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("requests")
      .insert([{ ...values, creator_id: user.id }])
      .select();

    if (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتمكن من إنشاء الطلب. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم بنجاح",
        description: "تم إنشاء طلبك بنجاح.",
      });
      form.reset();
      onSuccess?.();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="court_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المحكمة</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!!courtId}
                >
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اختر نوع الطلب من زميلك</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الدائرة</FormLabel>
                <FormControl>
                  <Input placeholder="ادخل رقم الدائرة (اختياري)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تفاصيل الطلب</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="اكتب تفاصيل الطلب هنا..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء طلب"}
        </Button>
      </form>
    </Form>
  );
}
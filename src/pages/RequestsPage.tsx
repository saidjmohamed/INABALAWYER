"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Request, Court } from "@/types";
import { RequestCard } from "@/components/requests/RequestCard";
import { CreateRequestForm } from "@/components/requests/CreateRequestForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requests")
      .select("*, creator:creator_id(*), court:courts(*), lawyer:lawyer_id(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
    } else {
      setRequests(data as any);
    }
    setLoading(false);
  }, []);

  const fetchCourts = useCallback(async () => {
    const { data, error } = await supabase.from("courts").select("*");
    if (error) {
      console.error("Error fetching courts:", error);
    } else {
      setCourts(data);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchCourts();
  }, [fetchRequests, fetchCourts]);

  const handleRequestCreation = () => {
    setIsDialogOpen(false);
    fetchRequests();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">جميع الطلبات</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              إنشاء طلب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>إنشاء طلب جديد</DialogTitle>
            </DialogHeader>
            <CreateRequestForm
              courts={courts}
              onSuccess={handleRequestCreation}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request as any} />
          ))}
        </div>
      ) : (
        <p>لا توجد طلبات حالياً.</p>
      )}
    </div>
  );
}
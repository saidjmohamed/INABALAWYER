"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
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
import { PlusCircle, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RequestsByCourtPage() {
  const { courtId } = useParams<{ courtId: string }>();
  const [requests, setRequests] = useState<Request[]>([]);
  const [court, setCourt] = useState<Court | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRequestsAndCourt = useCallback(async () => {
    if (!courtId) return;
    setLoading(true);

    const requestsPromise = supabase
      .from("requests")
      .select("*, creator:creator_id(*), court:courts(*), lawyer:lawyer_id(*)")
      .eq("court_id", courtId)
      .order("created_at", { ascending: false });

    const courtPromise = supabase
      .from("courts")
      .select("*")
      .eq("id", courtId)
      .single();

    const allCourtsPromise = supabase.from("courts").select("*");

    const [requestsRes, courtRes, allCourtsRes] = await Promise.all([
      requestsPromise,
      courtPromise,
      allCourtsPromise,
    ]);

    if (requestsRes.error) {
      console.error("Error fetching requests:", requestsRes.error);
    } else {
      setRequests(requestsRes.data as any);
    }

    if (courtRes.error) {
      console.error("Error fetching court:", courtRes.error);
    } else {
      setCourt(courtRes.data);
    }

    if (allCourtsRes.error) {
      console.error("Error fetching all courts:", allCourtsRes.error);
    } else {
      setCourts(allCourtsRes.data);
    }

    setLoading(false);
  }, [courtId]);

  useEffect(() => {
    fetchRequestsAndCourt();
  }, [fetchRequestsAndCourt]);

  const handleRequestCreation = () => {
    setIsDialogOpen(false);
    fetchRequestsAndCourt();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-1/2 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">المحكمة غير موجودة</h1>
        <Button asChild className="mt-4">
          <Link to="/courts">العودة إلى قائمة المحاكم</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">طلبات {court.name}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              إنشاء طلب في هذه المحكمة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>إنشاء طلب جديد في {court.name}</DialogTitle>
            </DialogHeader>
            {courtId && (
              <CreateRequestForm
                courts={courts}
                onSuccess={handleRequestCreation}
                courtId={courtId}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {requests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request as any} />
          ))}
        </div>
      ) : (
        <p>لا توجد طلبات في هذه المحكمة حالياً.</p>
      )}

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link to="/courts">
            عرض جميع المحاكم
            <ArrowRight className="mr-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
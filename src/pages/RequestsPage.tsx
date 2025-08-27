import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Court, Profile, Request } from "@/types";
import { useSession } from "@/contexts/SessionContext";
import { RequestCard } from "@/components/requests/RequestCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type RequestWithDetails = Request & {
  court: Court;
  creator: Profile;
  lawyer: Profile | null;
};

export function RequestsPage() {
  const { profile } = useSession();
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: requestsData, error: requestsError } = await supabase
          .from("requests")
          .select(`
            *,
            court:courts(*),
            creator:profiles!requests_creator_id_fkey(*),
            lawyer:profiles!requests_lawyer_id_fkey(*)
          `)
          .order("created_at", { ascending: false });
        if (requestsError) throw requestsError;
        setRequests(requestsData as any as RequestWithDetails[]);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !profile) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">الطلبات</h1>
        <Button asChild>
          <Link to="/requests/new">
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة طلب جديد
          </Link>
        </Button>
      </div>

      {requests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد طلبات حالياً.</p>
        </div>
      )}
    </div>
  );
}
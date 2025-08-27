import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase";
import { Court, RequestWithDetails } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateRequestForm } from "@/components/requests/CreateRequestForm";
import { RequestCard } from "@/components/requests/RequestCard";
import { PlusCircle } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

export default function RequestsByCourtPage() {
  const { courtId } = useParams<{ courtId: string }>();
  const { profile } = useSession();
  const [court, setCourt] = useState<Court | null>(null);
  const [allCourts, setAllCourts] = useState<Court[]>([]);
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);

  const fetchCourtAndRequests = async () => {
    if (!courtId) return;
    setLoading(true);
    
    const { data: courtData, error: courtError } = await supabase
      .from("courts")
      .select("*")
      .eq("id", courtId)
      .single();

    if (courtError || !courtData) {
      console.error("Error fetching court:", courtError);
      setCourt(null);
    } else {
      setCourt(courtData);
    }

    const { data: allCourtsData, error: allCourtsError } = await supabase
      .from("courts")
      .select("*");
    
    if (allCourtsError) {
      console.error("Error fetching all courts:", allCourtsError);
    } else {
      setAllCourts(allCourtsData || []);
    }

    const { data: requestsData, error: requestsError } = await supabase
      .from("requests")
      .select(`
        *,
        court:courts(*),
        creator:profiles!creator_id(*),
        lawyer:profiles!lawyer_id(*)
      `)
      .eq("court_id", courtId)
      .order("created_at", { ascending: false });

    if (requestsError) {
      console.error("Error fetching requests:", requestsError);
    } else {
      setRequests(requestsData as any as RequestWithDetails[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourtAndRequests();
  }, [courtId]);

  const handleRequestCreation = () => {
    setIsCreateRequestOpen(false);
    fetchCourtAndRequests();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!court) {
    return <div className="flex justify-center items-center h-screen">Court not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">الطلبات في {court.name}</h1>
        {profile && (
          <Dialog open={isCreateRequestOpen} onOpenChange={setIsCreateRequestOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                إنشاء طلب جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء طلب جديد في {court.name}</DialogTitle>
              </DialogHeader>
              <CreateRequestForm
                courts={allCourts}
                currentProfile={profile}
                onFormSubmit={handleRequestCreation}
                defaultCourtId={courtId}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      {requests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <p>لا توجد طلبات في هذه المحكمة حتى الآن.</p>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase";
import { Court, RequestWithDetails } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateRequestForm } from "@/components/requests/CreateRequestForm";
import { RequestCard } from "@/components/requests/RequestCard";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/contexts/SessionContext";

export default function RequestsPage() {
  const { profile } = useSession();
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: courtsData, error: courtsError } = await supabase.from("courts").select("*");
    if (courtsError) console.error("Error fetching courts:", courtsError);
    else setCourts(courtsData || []);

    const { data: requestsData, error: requestsError } = await supabase
      .from("requests")
      .select("*, court:courts(*), creator:profiles!creator_id(*), lawyer:profiles!lawyer_id(*)")
      .order("created_at", { ascending: false });

    if (requestsError) console.error("Error fetching requests:", requestsError);
    else setRequests(requestsData as RequestWithDetails[] || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestCreation = () => {
    setIsCreateRequestOpen(false);
    fetchData();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">جميع الطلبات</h1>
        {profile && (
          <div className="flex items-center gap-4">
            <Select onValueChange={(courtId) => setSelectedCourt(courts.find(c => c.id === courtId) || null)}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="اختر محكمة لإنشاء طلب" />
              </SelectTrigger>
              <SelectContent>
                {courts.map(court => (
                  <SelectItem key={court.id} value={court.id}>{court.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isCreateRequestOpen} onOpenChange={setIsCreateRequestOpen}>
              <DialogTrigger asChild>
                <Button disabled={!selectedCourt}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  إنشاء طلب جديد
                </Button>
              </DialogTrigger>
              {selectedCourt && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء طلب جديد في {selectedCourt.name}</DialogTitle>
                  </DialogHeader>
                  <CreateRequestForm
                    courts={courts}
                    currentProfile={profile}
                    onFormSubmit={handleRequestCreation}
                    defaultCourtId={selectedCourt.id}
                  />
                </DialogContent>
              )}
            </Dialog>
          </div>
        )}
      </div>
      {requests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <p>لا توجد طلبات حتى الآن.</p>
      )}
    </div>
  );
}
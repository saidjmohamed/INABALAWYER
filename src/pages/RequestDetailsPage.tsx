import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase";
import { RequestWithDetails, RequestStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Gavel, Building, FileText, Clock } from "lucide-react";

const statusMap: Record<RequestStatus, string> = {
  open: "مفتوح",
  assigned: "معين",
  closed: "مغلق",
  cancelled: "ملغى",
};

const statusColorMap: Record<RequestStatus, string> = {
  open: "bg-green-500",
  assigned: "bg-yellow-500",
  closed: "bg-gray-500",
  cancelled: "bg-red-500",
};

const requestTypeMap: Record<string, string> = {
    information_retrieval: "اطلاع على معلومة من تطبيقة محامين",
    representation: "طلب انابة في جلسة",
    other: "طلب اخر",
};

export default function RequestDetailsPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<RequestWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("requests")
        .select("*, court:courts(*), creator:profiles!creator_id(*), lawyer:profiles!lawyer_id(*)")
        .eq("id", requestId)
        .single();

      if (error) {
        console.error("Error fetching request:", error);
      } else {
        setRequest(data as RequestWithDetails);
      }
      setLoading(false);
    };

    fetchRequest();
  }, [requestId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!request) {
    return <div className="flex justify-center items-center h-screen">Request not found.</div>;
  }

  const creatorName = request.creator ? `${request.creator.first_name || ''} ${request.creator.last_name || ''}`.trim() : "غير معروف";
  const lawyerName = request.lawyer ? `${request.lawyer.first_name || ''} ${request.lawyer.last_name || ''}`.trim() : "لم يتم التعيين بعد";

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold">
              تفاصيل الطلب: {request.case_number}
            </CardTitle>
            <Badge className={`${statusColorMap[request.status]} text-white`}>
              {statusMap[request.status]}
            </Badge>
          </div>
          <p className="text-md text-gray-600">
            {requestTypeMap[request.type] || request.type}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center"><Building className="w-4 h-4 mr-2" /><strong>المحكمة:</strong> {request.court.name}</div>
            <div className="flex items-center"><FileText className="w-4 h-4 mr-2" /><strong>الدائرة:</strong> {request.section || 'غير محدد'}</div>
            <div className="flex items-center"><User className="w-4 h-4 mr-2" /><strong>مقدم الطلب:</strong> {creatorName}</div>
            <div className="flex items-center"><Gavel className="w-4 h-4 mr-2" /><strong>المحامي المسؤول:</strong> {lawyerName}</div>
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /><strong>تاريخ الإنشاء:</strong> {new Date(request.created_at).toLocaleString()}</div>
            {request.session_date && <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /><strong>تاريخ الجلسة:</strong> {new Date(request.session_date).toLocaleString()}</div>}
          </div>
          
          {request.details && (
            <div>
              <h3 className="font-semibold mb-1">تفاصيل الطلب:</h3>
              <p className="text-sm bg-gray-50 p-3 rounded-md">{request.details}</p>
            </div>
          )}

          {request.type === 'representation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1">بيانات المدعي:</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{request.plaintiff_details || 'لا يوجد'}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">بيانات المدعى عليه:</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{request.defendant_details || 'لا يوجد'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
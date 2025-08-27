import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestWithDetails, RequestStatus, Request } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { User, Calendar, Gavel } from "lucide-react";
import { cn } from "@/lib/utils";

type RequestCardProps = {
  request: RequestWithDetails;
};

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
  information_retrieval: "اطلاع على معلومة",
  representation: "إنابة في جلسة",
  other: "طلب اخر",
};

const requestTypeColorMap: Record<Request['type'], string> = {
  representation: "bg-blue-50 hover:bg-blue-100",
  information_retrieval: "bg-green-50 hover:bg-green-100",
  other: "bg-gray-50 hover:bg-gray-100",
};

export function RequestCard({ request }: RequestCardProps) {
  const creatorName = request.creator ? `${request.creator.first_name || ''} ${request.creator.last_name || ''}`.trim() : "غير معروف";

  return (
    <Card className={cn("flex flex-col h-full transition-colors", requestTypeColorMap[request.type])}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold mb-2">
            {request.court.name} - {request.case_number}
          </CardTitle>
          <Badge className={`${statusColorMap[request.status]} text-white`}>
            {statusMap[request.status]}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          {requestTypeMap[request.type] || request.type}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <span>مقدم الطلب: {creatorName}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>تاريخ الإنشاء: {new Date(request.created_at).toLocaleDateString()}</span>
          </div>
          {request.lawyer && (
            <div className="flex items-center">
              <Gavel className="w-4 h-4 mr-2 text-gray-500" />
              <span>المحامي: {request.lawyer.first_name} {request.lawyer.last_name}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/requests/${request.id}`}>عرض التفاصيل</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
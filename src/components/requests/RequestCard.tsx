import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Request, RequestStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

// Define a more complete type for the request prop
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
}

interface Court {
  id: string;
  name: string;
}

interface RequestWithDetails extends Request {
  creator: Profile | null;
  court: Court | null;
  lawyer: Profile | null;
}

interface RequestCardProps {
  request: RequestWithDetails;
}

const statusTranslations: Record<RequestStatus, string> = {
  open: "مفتوح",
  assigned: "معين",
  closed: "مغلق",
  cancelled: "ملغى",
};

export const RequestCard = ({ request }: RequestCardProps) => {
  return (
    <Link to={`/requests/${request.id}`}>
      <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{request.type}</CardTitle>
            <Badge variant={request.status === "open" ? "default" : "secondary"}>
              {statusTranslations[request.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{request.court?.name}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <p>
            <strong>رقم القضية:</strong> {request.case_number}
          </p>
          {request.section && (
            <p>
              <strong>الأطراف:</strong> {request.section}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground mt-auto">
          <span>
            بواسطة: {request.creator?.first_name} {request.creator?.last_name}
          </span>
          <span>
            {formatDistanceToNow(new Date(request.created_at), {
              addSuffix: true,
              locale: ar,
            })}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};
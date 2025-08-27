export type Court = {
  id: string;
  name: string;
  level: string;
  parent_id: string | null;
};

export enum RequestStatus {
  Open = "open",
  Assigned = "assigned",
  Closed = "closed",
  Cancelled = "cancelled",
}

export type Request = {
  id: string;
  creator_id: string;
  court_id: string;
  type: "consultation" | "representation" | "documentation";
  case_number: string;
  section: string | null;
  details: string | null;
  status: RequestStatus;
  created_at: string;
  lawyer_id: string | null;
  session_date: string | null;
  plaintiff_details: string | null;
  defendant_details: string | null;
};

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  role: string;
  updated_at: string | null;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  organization: string | null;
};

export type RequestWithDetails = Request & {
  creator: Profile;
  court: Court;
  lawyer: Profile | null;
};
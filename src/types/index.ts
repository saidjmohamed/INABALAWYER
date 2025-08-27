export type UserRole = 'admin' | 'lawyer';
export type UserStatus = 'pending' | 'active' | 'rejected' | 'disabled';
export type RequestStatus = 'open' | 'closed' | 'in_progress' | 'assigned' | 'cancelled';
export type RequestType = 'information_retrieval' | 'representation' | 'other';
export type CourtLevel = 'first_instance' | 'appeal' | 'cassation';

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  status: UserStatus;
  role: UserRole;
  updated_at: string | null;
  email: string | null;
  username: string | null;
  specialties: string[] | null;
  experience_years: number | null;
  languages: string[] | null;
  bio: string | null;
  avatar_url: string | null;
  organization: string | null;
};

export type Court = {
  id: string;
  name: string;
  level: CourtLevel;
  parent_id: string | null;
};

export type Request = {
  id: string;
  creator_id: string;
  court_id: string;
  type: RequestType;
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

export type RequestWithDetails = Request & {
  court: Court;
  creator: Profile;
  lawyer: Profile | null;
};

export type RequestForList = RequestWithDetails & {
  replies: { count: number }[];
};

export type Reply = {
  id: string;
  author_id: string;
  request_id: string;
  content: string;
  created_at: string;
};

export type ReplyWithAuthor = Reply & {
  author: Profile;
};
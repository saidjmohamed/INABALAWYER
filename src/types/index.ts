export type UserRole = 'admin' | 'lawyer';
export type UserStatus = 'pending' | 'active' | 'disabled' | 'rejected';
export type RequestType = 'representation' | 'information_retrieval';
export type CaseStatus = 'open' | 'assigned' | 'completed';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
  username: string | null;
  status: UserStatus;
  role: UserRole;
  specialties: string[] | null;
  experience_years: number | null;
  languages: string[] | null;
  bio: string | null;
  avatar_url: string | null;
  organization: string | null;
  updated_at: string;
}

export interface Council {
  id: string;
  name: string;
  created_at: string;
}

export interface Court {
  id: string;
  council_id: string;
  name: string;
  type: 'ابتدائية' | 'إدارية' | 'استئنافية' | 'مجلس';
  created_at: string;
  lawyer_room_phone: string | null;
  municipalities: string[] | null;
  address: string | null;
  working_hours: string | null;
}

export interface Case {
  id: string;
  title: string;
  description: string | null;
  court_id: string | null;
  council_id: string | null;
  creator_id: string;
  created_at: string;
  request_type: RequestType | null;
  case_number: string | null;
  session_date: string | null;
  plaintiff: string | null;
  defendant: string | null;
  legal_representative: string | null;
  status: CaseStatus;
  assignee_id: string | null;
  section: string | null;
}

export interface CaseWithDetails extends Case {
  court: Court | null;
  council: Council | null;
  creator: Profile;
  assignee: Profile | null;
}

export interface Reply {
  id: string;
  case_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'avatar_url'>;
}
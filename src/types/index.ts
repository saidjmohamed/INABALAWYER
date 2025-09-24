export type UserRole = 'admin' | 'lawyer';
export type UserStatus = 'pending' | 'active' | 'rejected' | 'disabled';
export type RequestType = 'representation' | 'information_retrieval';
export type CaseStatus = 'open' | 'assigned' | 'completed';

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

export type Council = {
  id: string;
  name: string;
  created_at: string;
};

export type Court = {
  id: string;
  council_id: string;
  name: string;
  type: 'ابتدائية' | 'إدارية' | 'استئنافية' | 'مجلس';
  created_at: string;
};

export type Case = {
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
};

export type Reply = {
  id: string;
  case_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'avatar_url'>;
};

export type CaseWithDetails = Case & {
  court: Court | null;
  council: Council | null;
  creator: Profile;
  assignee: Profile | null;
};
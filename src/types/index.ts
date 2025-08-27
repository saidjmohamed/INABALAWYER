export interface Court {
  id: string;
  name: string;
  level: string;
  parent_id: string | null;
}

export enum RequestType {
  Marafah = "مرافعة",
  Istishara = "استشارة",
  TaqdeemMustanad = "تقديم مستند",
  MutabaahQadiyah = "متابعة قضية",
}

export type RequestStatus = 'open' | 'assigned' | 'closed' | 'cancelled';

export interface Request {
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
}
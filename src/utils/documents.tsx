export interface User {
  id: number;
  username: string;
  full_name: string;
  role: string;
  is_superuser: boolean;
}

export interface Document {
  id: number;
  document_hash: string;
  file_name: string;
  allowed_signer: number[];
  requested_by: number;
  created_at: string;
  signed_at: string | null;
  reason: string | null;
  location: string | null;
  verified_count: number;
  last_verified_at: string | null;
  signed_count: number;
  requester: User;
}

export interface DocumentsResponse {
  data: Document[];
  total: number;
  page: number;
  limit: number;
}
interface DocumentGroupMetadata {
  name: string;
  description: string;
  column_type: string;
  column_name?: string;
}

export interface DocumentGroup {
  name: string;
  description: string;
  slug: string;
  metadata: DocumentGroupMetadata[];
  table_name?: string;
  created_at?: string;
  updated_at?: string;
}

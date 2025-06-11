import { DocumentTypeMetadataFields } from './document-type-metadata-fields.interface';

export interface DocumentType {
  id: string;
  name: string;
  description?: string;
  metadata_fields: DocumentTypeMetadataFields[];
  created_at: string;
  updated_at: string;
}

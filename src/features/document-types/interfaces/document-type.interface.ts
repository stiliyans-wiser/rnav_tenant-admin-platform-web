import { DocumentTypeMetadataFields } from './document-type-metadata-fields.interface';

export interface DocumentType {
  id: string;
  name: string;
  description?: string;
  metadata_fields: DocumentTypeMetadataFields[];
  brief_metadata: {
    prefix_prompt: string;
    suffix_prompt: string;
    metadata_fields: DocumentTypeMetadataFields[];
  };
  created_at: string;
  updated_at: string;
}

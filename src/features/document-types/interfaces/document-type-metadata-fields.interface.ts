import { ColumnTypeEnum } from '@/features/common/enums/column-type.enum';

export interface DocumentTypeMetadataFields {
  name: string;
  description: string;
  column_name?: string;
  column_type: ColumnTypeEnum;
}

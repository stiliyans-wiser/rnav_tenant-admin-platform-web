import { ColumnTypeEnum } from '@/features/common/enums/column-type.enum';

export interface AddEditForm {
  name: string;
  description: string;
  metadata_fields: {
    name: string;
    description: string;
    column_type: ColumnTypeEnum;
  }[];
  brief_metadata: {
    prefix_prompt: string;
    suffix_prompt: string;
    metadata_fields: {
      name: string;
      description: string;
      column_type: ColumnTypeEnum;
    }[];
  };
}

import { Box } from '@mui/material';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { Controller, useFormContext } from 'react-hook-form';
import { AddEditForm } from '@/features/document-types/interfaces/add-edit-form.interface';
import { MetadataFieldPathEnum } from '@/features/common/enums/metadata-field-path.enum';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { MetadataFieldsSection } from '@/features/common/components/metadata-fields/MetadataFieldsSection';

interface BriefTabProps {
  documentType?: DocumentType;
}

export const BriefTab = ({ documentType }: BriefTabProps) => {
  const formMethods = useFormContext<AddEditForm>();

  return (
    <Box>
      <Controller
        name="brief_metadata.prefix_prompt"
        control={formMethods.control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 3 }}
            label="Prefix"
            placeholder="Enter prefix prompt"
            field={field}
            fieldState={fieldState}
            multiline={true}
            rows={4}
          />
        )}
      />

      <Controller
        name="brief_metadata.suffix_prompt"
        control={formMethods.control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 3 }}
            label="Suffix"
            placeholder="Enter suffix prompt"
            field={field}
            fieldState={fieldState}
            multiline={true}
            rows={4}
          />
        )}
      />

      <MetadataFieldsSection<DocumentType>
        fieldPath={MetadataFieldPathEnum.BRIEF_METADATA_FIELDS}
        title="Brief metadata fields"
        documentType={documentType}
      />
    </Box>
  );
};

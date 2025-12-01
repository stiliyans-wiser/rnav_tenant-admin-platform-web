import { Controller, useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { AddEditForm } from '@/features/document-types/interfaces/add-edit-form.interface';
import { MetadataFieldPathEnum } from '@/features/common/enums/metadata-field-path.enum';
import { MetadataFieldsSection } from '@/features/common/components/metadata-fields/MetadataFieldsSection';

interface GeneralTabProps {
  documentType?: DocumentType;
}

export const GeneralTab = ({ documentType }: GeneralTabProps) => {
  const formMethods = useFormContext<AddEditForm>();

  return (
    <Box>
      <Controller
        name="name"
        control={formMethods.control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 3 }}
            label="Document Type Name"
            placeholder="Enter document type name"
            field={field}
            fieldState={fieldState}
          />
        )}
      />

      <Controller
        name="description"
        control={formMethods.control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 3 }}
            label="Document Type Description"
            placeholder="Enter document type description"
            field={field}
            fieldState={fieldState}
            multiline={true}
            rows={4}
          />
        )}
      />

      <MetadataFieldsSection<DocumentType>
        fieldPath={MetadataFieldPathEnum.METADATA_FIELDS}
        title="Included metadata fields"
        documentType={documentType}
      />
    </Box>
  );
};

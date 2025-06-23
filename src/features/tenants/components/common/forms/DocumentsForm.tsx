'use client';

import React from 'react';
import { Controller, ControllerRenderProps, FieldValues, useFormContext, useWatch } from 'react-hook-form';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  MenuItem,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  InputLabel,
} from '@mui/material';
import { ChevronDown } from '@carbon/icons-react';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

interface DocumentsFormProps {
  documentTypes: DocumentType[];
}

export const DocumentsForm = ({ documentTypes }: DocumentsFormProps) => {
  const { control } = useFormContext();

  const selectedValues = useWatch({
    control,
    name: formFieldNames.documents.documentTypes,
  });

  const selectedDocumentTypes = selectedValues?.map((item: string) => JSON.parse(item)) || [];

  const handleDeleteChip = (item: string, field: ControllerRenderProps<FieldValues, string>) => {
    const newSelected = selectedValues.filter((value: string) => value !== item);

    field.onChange(newSelected);
  };

  const renderChip = (item: string, field: any) => {
    const selectedDoc = JSON.parse(item);

    return (
      <Chip
        key={selectedDoc.id}
        label={selectedDoc.name}
        onDelete={() => handleDeleteChip(item, field)}
        onMouseDown={event => event.stopPropagation()}
      />
    );
  };

  return (
    <>
      <Controller
        name={formFieldNames.documents.documentTypes}
        control={control}
        rules={{ required: 'This field is required' }}
        defaultValue={[]}
        render={({ field, fieldState }) => (
          <MuiSelect
            field={field}
            label="Document Types"
            placeholder="Select Document Types"
            fieldState={fieldState}
            multiple={true}
            options={documentTypes?.map(documentType => (
              <MenuItem key={documentType.id} value={JSON.stringify(documentType)}>
                {documentType.name}
              </MenuItem>
            ))}
            renderValue={(selectedDocuments: string[]) => (
              <Stack direction="row" sx={{ flexWrap: 'wrap' }} gap={0.5}>
                {selectedDocuments?.map(item => renderChip(item, field))}
              </Stack>
            )}
          />
        )}
      />

      {selectedDocumentTypes?.length > 0 && (
        <Stack spacing={3} sx={{ mt: 3 }}>
          {selectedDocumentTypes.map((document: DocumentType) => (
            <Accordion variant="outlined" key={document.id}>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {document.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={4}>
                  <Typography variant="body1">{document.description}</Typography>
                  <Stack spacing={2}>
                    <InputLabel shrink>Included Metadata Fields</InputLabel>
                    {document.metadata_fields.map(f => (
                      <FormControlLabel
                        key={f.column_name}
                        control={<Checkbox disabled={true} />}
                        label={`"${f.column_name}" : "${f.column_type}"`}
                      />
                    ))}
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}
    </>
  );
};

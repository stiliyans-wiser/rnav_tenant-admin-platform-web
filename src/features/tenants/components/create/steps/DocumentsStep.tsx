import React, { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
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
import { ChevronDown, Document } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantStepLayout } from '@/features/tenants/components/create/layouts/CreateTenantStepLayout';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';

const FIELD_NAMES = ['document_types'];

export const DocumentsStep = ({ isFirstStep, isLastStep, onBack, onNext }: CreateTenantStepProps) => {
  const { documentTypes, selectedDocumentTypes, setSelectedDocumentTypes } = useCreateTenantContext();

  const { control } = useFormContext();
  const { hasError } = useStepValidation(FIELD_NAMES);
  const watchedControlValue = useWatch({
    control: control,
    name: FIELD_NAMES[0],
  });

  useEffect(() => {
    const selectedDocs = documentTypes?.filter(doc => watchedControlValue?.includes(doc.id)) || [];

    setSelectedDocumentTypes(selectedDocs);
  }, [watchedControlValue, documentTypes]);

  return (
    <CreateTenantStepLayout
      stepTitle="Documents"
      stepIcon={<Document size={24} />}
      isNextButtonDisabled={hasError}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      onBack={() => onBack(hasError)}
      onNext={() => onNext(hasError)}
    >
      <Controller
        name={FIELD_NAMES[0]}
        control={control}
        rules={{ required: 'This field is required' }}
        defaultValue={[]}
        render={({ field, fieldState }) => (
          <MuiSelect
            field={field}
            label="Document types"
            placeholder="Select document types"
            fieldState={fieldState}
            multiple={true}
            options={documentTypes?.map((documentType: DocumentType) => (
              <MenuItem key={documentType.id} value={documentType.id}>
                {documentType.name}
              </MenuItem>
            ))}
            renderValue={(selected: string[]) => (
              <Stack direction="row" sx={{ flexWrap: 'wrap' }} gap={0.5}>
                {selected.map(docId => (
                  <Chip
                    key={docId}
                    label={documentTypes.find(doc => doc.id === docId)?.name}
                    onDelete={() => {
                      setSelectedDocumentTypes(selectedDocumentTypes.filter(doc => doc.id !== docId));
                      field.onChange(selected.filter(id => id !== docId));
                    }}
                    onMouseDown={event => {
                      event.stopPropagation();
                    }}
                  />
                ))}
              </Stack>
            )}
          />
        )}
      />

      {selectedDocumentTypes.length > 0 && (
        <Stack spacing={3} sx={{ mt: 3 }}>
          {selectedDocumentTypes.map(document => (
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
                    <InputLabel shrink>Included metadata fields</InputLabel>
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
    </CreateTenantStepLayout>
  );
};

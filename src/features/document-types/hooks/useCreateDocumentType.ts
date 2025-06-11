import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentTypesConstants } from '@/features/document-types/constants/document-types.constants';
import { createDocumentType } from '@/features/document-types/api/documentTypesApi';
import { DocumentType } from '../interfaces/document-type.interface';

export const useCreateDocumentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentType: Omit<DocumentType, 'id' | 'created_at' | 'updated_at'>) => createDocumentType(documentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentTypesConstants.documentTypeKeys.lists() });
    },
  });
};

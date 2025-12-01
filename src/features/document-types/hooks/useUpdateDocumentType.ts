import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentTypesConstants } from '@/features/document-types/constants/document-types.constants';
import { updateDocumentType } from '@/features/document-types/api/documentTypesApi';
import { DocumentType } from '../interfaces/document-type.interface';

export const useUpdateDocumentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, documentType }: { id: string; documentType: Partial<DocumentType> }) => updateDocumentType(id, documentType),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: documentTypesConstants.documentTypeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentTypesConstants.documentTypeKeys.detail(id) });
    },
  });
};

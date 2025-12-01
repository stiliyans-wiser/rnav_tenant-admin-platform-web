import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentTypesConstants } from '@/features/document-types/constants/document-types.constants';
import { deleteDocumentType } from '@/features/document-types/api/documentTypesApi';

export const useDeleteDocumentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocumentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentTypesConstants.documentTypeKeys.lists() });
    },
  });
};

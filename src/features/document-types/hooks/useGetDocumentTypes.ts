import { useQuery } from '@tanstack/react-query';
import { documentTypesConstants } from '@/features/document-types/constants/document-types.constants';
import { getDocumentTypes } from '@/features/document-types/api/documentTypesApi';

export const useGetDocumentTypes = () => {
  return useQuery({
    queryKey: documentTypesConstants.documentTypeKeys.lists(),
    queryFn: getDocumentTypes,
  });
};

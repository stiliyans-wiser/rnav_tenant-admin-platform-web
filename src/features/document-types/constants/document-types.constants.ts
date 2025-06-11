export const documentTypesConstants = {
  documentTypeKeys: {
    all: ['document-types'] as const,
    lists: () => [...documentTypesConstants.documentTypeKeys.all, 'list'] as const,
    detail: (id: string) => [...documentTypesConstants.documentTypeKeys.all, 'detail', id] as const,
  },
};

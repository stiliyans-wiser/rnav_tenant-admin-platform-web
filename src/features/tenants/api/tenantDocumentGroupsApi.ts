import api from '@/features/auth/api/axiosConfig';
import { DocumentGroup } from '@/features/tenants/interfaces/document-group.interface';

const url = '/admin/account';

export const getTenantDocumentGroups = async (tenantId: string): Promise<DocumentGroup[]> => {
  const response = await api.get<DocumentGroup[]>(`${url}/${tenantId}/document-groups`);
  return response.data;
};

export const createTenantDocumentGroup = async (tenantId: string, documentGroup: DocumentGroup): Promise<DocumentGroup> => {
  const response = await api.post<DocumentGroup>(`${url}/${tenantId}/document-groups`, documentGroup);
  return response.data;
};

export const updateTenantDocumentGroup = async (
  tenantId: string,
  groupSlug: string,
  documentGroup: Partial<DocumentGroup>,
): Promise<DocumentGroup> => {
  const response = await api.put<DocumentGroup>(`${url}/${tenantId}/document-groups/${groupSlug}`, documentGroup);
  return response.data;
};

export const deleteTenantDocumentGroup = async (tenantId: string, groupSlug: string): Promise<void> => {
  await api.delete(`${url}/${tenantId}/document-groups/${groupSlug}`);
};

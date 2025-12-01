import api from '@/features/auth/api/axiosConfig';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';

const url = '/admin/document-types';

export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  const response = await api.get<DocumentType[]>(url);
  return response.data;
};

export const createDocumentType = async (documentType: Omit<DocumentType, 'id' | 'created_at' | 'updated_at'>): Promise<DocumentType> => {
  const response = await api.post<DocumentType>(url, documentType);
  return response.data;
};

export const updateDocumentType = async (id: string, documentType: Partial<DocumentType>): Promise<DocumentType> => {
  const response = await api.put<DocumentType>(`${url}/${id}`, documentType);
  return response.data;
};

export const deleteDocumentType = async (id: string): Promise<void> => {
  await api.delete(`${url}/${id}`);
};

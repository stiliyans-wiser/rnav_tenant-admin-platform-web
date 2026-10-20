import api from '@/features/auth/api/axiosConfig';
import { MatchingOntology, MatchingOntologyPatch } from '@/features/tenants/interfaces/matching-ontology.interface';

const path = (accountId: string) => `/backoffice/accounts/${accountId}/matching-ontology`;

export const getMatchingOntology = async (accountId: string): Promise<MatchingOntology> => {
  const response = await api.get<MatchingOntology>(path(accountId));
  return response.data;
};

export const updateMatchingOntology = async (accountId: string, body: MatchingOntologyPatch): Promise<MatchingOntology> => {
  const response = await api.patch<MatchingOntology>(path(accountId), body);
  return response.data;
};

import api from '@/features/auth/api/axiosConfig';
import {
  DecisionReasonsAvailability,
  DecisionReasonsAvailabilityPatch,
} from '@/features/tenants/interfaces/decision-reasons-availability.interface';

const path = (accountId: string) => `/backoffice/accounts/${accountId}/decision-reasons`;

export const getDecisionReasonsAvailability = async (accountId: string): Promise<DecisionReasonsAvailability> => {
  const response = await api.get<DecisionReasonsAvailability>(path(accountId));
  return response.data;
};

export const updateDecisionReasonsAvailability = async (
  accountId: string,
  body: DecisionReasonsAvailabilityPatch,
): Promise<DecisionReasonsAvailability> => {
  const response = await api.patch<DecisionReasonsAvailability>(path(accountId), body);
  return response.data;
};

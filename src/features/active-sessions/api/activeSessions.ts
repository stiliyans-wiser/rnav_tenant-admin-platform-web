import api from '@/features/auth/api/axiosConfig';
import { PlatformSessionsResponse } from '@/features/active-sessions/interfaces/active-sessions.interface';

const url = '/backoffice/sessions';

export const getPlatformSessions = async (): Promise<PlatformSessionsResponse> => {
  const response = await api.get<PlatformSessionsResponse>(url);
  return response.data;
};

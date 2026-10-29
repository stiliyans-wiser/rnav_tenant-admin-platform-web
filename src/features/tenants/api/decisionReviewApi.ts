import api from '@/features/auth/api/axiosConfig';
import {
  DecisionReviewDetail,
  DecisionReviewExportFormat,
  DecisionReviewExportResult,
  DecisionReviewFilters,
  DecisionReviewList,
} from '@/features/tenants/interfaces/decision-review.interface';
import { buildExportParams, buildListParams, exportFilename, parseExportHeaders, withParsedErrorBody, type ExportHeaders } from '@/features/tenants/utils/decisionReview';

const path = (accountId: string) => `/backoffice/accounts/${accountId}/decision-review`;

export const getDecisionReviewList = async (
  accountId: string,
  filters: DecisionReviewFilters,
  page: number,
  pageSize: number,
): Promise<DecisionReviewList> => {
  const response = await api.get<DecisionReviewList>(path(accountId), { params: buildListParams(filters, page, pageSize) });
  return response.data;
};

export const getDecisionReviewDetail = async (accountId: string, eventId: string): Promise<DecisionReviewDetail> => {
  const response = await api.get<DecisionReviewDetail>(`${path(accountId)}/${eventId}`);
  return response.data;
};

export const exportDecisionReview = async (
  accountId: string,
  filters: DecisionReviewFilters,
  format: DecisionReviewExportFormat,
): Promise<DecisionReviewExportResult & { headers: ExportHeaders }> => {
  const response = await api
    .get<Blob>(`${path(accountId)}/export`, {
      params: buildExportParams(filters, format),
      responseType: 'blob',
    })
    .catch(async error => {
      throw await withParsedErrorBody(error);
    });
  return {
    blob: response.data,
    filename: exportFilename(response.headers?.['content-disposition'], format),
    headers: parseExportHeaders(response.headers),
  };
};

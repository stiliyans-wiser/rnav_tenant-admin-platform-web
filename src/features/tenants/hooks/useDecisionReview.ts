import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { exportDecisionReview, getDecisionReviewDetail, getDecisionReviewList } from '@/features/tenants/api/decisionReviewApi';
import { DecisionReviewExportFormat, DecisionReviewFilters } from '@/features/tenants/interfaces/decision-review.interface';

export const useGetDecisionReviewList = (tenantId: string, filters: DecisionReviewFilters, page: number, pageSize: number, enabled: boolean) =>
  useQuery({
    queryKey: tenantsConstants.decisionReviewKeys.list(tenantId, filters, page, pageSize),
    queryFn: () => getDecisionReviewList(tenantId, filters, page, pageSize),
    enabled: !!tenantId && enabled,
    placeholderData: keepPreviousData,
    retry: false,
  });

export const useGetDecisionReviewDetail = (tenantId: string, eventId: string | null) =>
  useQuery({
    queryKey: tenantsConstants.decisionReviewKeys.detail(tenantId, eventId ?? ''),
    queryFn: () => getDecisionReviewDetail(tenantId, eventId as string),
    enabled: !!tenantId && !!eventId,
    retry: false,
  });

export const useExportDecisionReview = (tenantId: string) =>
  useMutation({
    mutationFn: ({ filters, format }: { filters: DecisionReviewFilters; format: DecisionReviewExportFormat }) =>
      exportDecisionReview(tenantId, filters, format),
  });

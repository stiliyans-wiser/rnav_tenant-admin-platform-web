import { runOptimisticToggle, type OptimisticToggleArgs } from './optimisticToggle.ts';

export const SCHEMA_UNHEALTHY_CODE = 'decision_schema_unhealthy';
export const SCHEMA_PROBE_FAILED_CODE = 'decision_schema_probe_failed';

export const ENABLE_EFFECT_TEXT =
  'Enabling makes decision reasons active for this tenant immediately. Recruiters must pick a reason when they Exclude, put On hold, Drop, or Archive a candidate. The tenant admin can switch it off or edit the list.';
export const PROBE_FAILED_TEXT = 'Could not check tenant database';

export const RESET_CONFIRM_TITLE = 'Reset to platform defaults?';
export const RESET_CONFIRM_TEXT =
  "This replaces this tenant's reason list and required statuses with the platform defaults. Custom reasons that past decisions used are kept, hidden, so history keeps its names; unused custom reasons are removed. Other edits made by the tenant admin are lost.";

export interface SchemaNotReady {
  missingColumns: string[];
  probeFailed?: boolean;
}

export const parseSchemaNotReady = (error: unknown): SchemaNotReady | null => {
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } } | null)?.response;
  if (response?.status !== 409) return null;
  const detail = response.data?.detail as { code?: unknown; missing_columns?: unknown } | undefined;
  if (typeof detail !== 'object' || detail === null) return null;
  if (detail.code === SCHEMA_PROBE_FAILED_CODE) return { missingColumns: [], probeFailed: true };
  if (detail.code !== SCHEMA_UNHEALTHY_CODE) return null;
  const missingColumns = Array.isArray(detail.missing_columns) ? detail.missing_columns.map(String) : [];
  return { missingColumns };
};

export const schemaNotReadyMessage = ({ missingColumns, probeFailed }: SchemaNotReady): string =>
  probeFailed
    ? PROBE_FAILED_TEXT
    : missingColumns.length
    ? `Database not ready: missing columns ${missingColumns.join(', ')} - deploy/migration needed`
    : 'Database not ready: deploy/migration needed';

export interface AvailabilityToggleResult {
  ok: boolean;
  schemaNotReady: SchemaNotReady | null;
  error?: unknown;
}

export type AvailabilityToggleArgs = OptimisticToggleArgs;

export const serverErrorDetail = (error: unknown): string | null => {
  const detail = (error as { response?: { data?: { detail?: unknown } } } | null)?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  const message = (detail as { message?: unknown } | null | undefined)?.message;
  return typeof message === 'string' ? message : null;
};

export const withServerDetail = (base: string, error: unknown): string => {
  const detail = serverErrorDetail(error);
  return detail ? `${base} ${detail}` : base;
};

export const runAvailabilityToggle = async ({ previous, next, apply, request }: AvailabilityToggleArgs): Promise<AvailabilityToggleResult> => {
  let failure: unknown;
  const ok = await runOptimisticToggle({
    previous,
    next,
    apply,
    request: async value => {
      try {
        return await request(value);
      } catch (error) {
        failure = error;
        throw error;
      }
    },
  });
  return ok ? { ok: true, schemaNotReady: null } : { ok: false, schemaNotReady: parseSchemaNotReady(failure), error: failure };
};

export type ResetResult = 'cancelled' | 'done' | 'failed';

export const runConfirmedReset = async (confirmed: boolean, request: () => Promise<unknown>): Promise<ResetResult> => {
  if (!confirmed) return 'cancelled';
  try {
    await request();
    return 'done';
  } catch {
    return 'failed';
  }
};

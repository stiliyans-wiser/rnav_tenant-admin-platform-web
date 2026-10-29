import { runOptimisticToggle } from './optimisticToggle.ts';

export const SCHEMA_UNHEALTHY_CODE = 'decision_schema_unhealthy';

export const RESET_CONFIRM_TITLE = 'Reset to platform defaults?';
export const RESET_CONFIRM_TEXT =
  "This replaces this tenant's reason list and required statuses with the platform defaults. Custom reasons and edits made by the tenant admin are lost. History already recorded keeps its labels.";

export interface SchemaNotReady {
  missingColumns: string[];
}

export const parseSchemaNotReady = (error: unknown): SchemaNotReady | null => {
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } } | null)?.response;
  if (response?.status !== 409) return null;
  const detail = response.data?.detail as { code?: unknown; missing_columns?: unknown } | undefined;
  if (typeof detail !== 'object' || detail === null || detail.code !== SCHEMA_UNHEALTHY_CODE) return null;
  const missingColumns = Array.isArray(detail.missing_columns) ? detail.missing_columns.map(String) : [];
  return { missingColumns };
};

export const schemaNotReadyMessage = ({ missingColumns }: SchemaNotReady): string =>
  missingColumns.length
    ? `Database not ready: missing columns ${missingColumns.join(', ')} - deploy/migration needed`
    : 'Database not ready: deploy/migration needed';

export interface AvailabilityToggleResult {
  ok: boolean;
  schemaNotReady: SchemaNotReady | null;
}

export interface AvailabilityToggleArgs {
  previous: boolean;
  next: boolean;
  apply: (value: boolean) => void;
  request: (next: boolean) => Promise<boolean>;
}

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
  return ok ? { ok: true, schemaNotReady: null } : { ok: false, schemaNotReady: parseSchemaNotReady(failure) };
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

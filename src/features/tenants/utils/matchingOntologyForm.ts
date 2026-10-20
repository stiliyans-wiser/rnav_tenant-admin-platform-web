import type {
  FieldChange,
  MatchingOntology,
  MatchingOntologyForm,
  MatchingOntologyPatch,
  TableCoverage,
} from '../interfaces/matching-ontology.interface';

export const MAX_HOPS_MIN = 1;
export const MAX_HOPS_MAX = 4;
export const MAX_BLOCKED_HUBS = 200;
export const MAX_BLOCKED_HUB_LENGTH = 100;

export type SwitchGroup = 'skill_graph' | 'esco' | 'embedding_store';

const onOff = (value: boolean): string => (value ? 'On' : 'Off');

export const parseHubs = (text: string): string[] => {
  const seen = new Set<string>();
  const hubs: string[] = [];
  text
    .split(/[\n,]/)
    .map(hub => hub.trim())
    .filter(Boolean)
    .forEach(hub => {
      const key = hub.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        hubs.push(hub);
      }
    });
  return hubs;
};

export const parseMaxHops = (raw: string): number | null => {
  if (!/^\d+$/.test(raw.trim())) return null;
  const value = Number.parseInt(raw, 10);
  return value >= MAX_HOPS_MIN && value <= MAX_HOPS_MAX ? value : null;
};

export const toForm = (data: MatchingOntology): MatchingOntologyForm => ({
  strictEnabled: data.strict_enabled,
  maxHops: String(data.max_hops),
  useDefaultHubs: data.sources.blocked_hubs === 'default',
  blockedHubsText: data.blocked_hubs.join('\n'),
  staticAliasesEnabled: data.static_aliases_enabled,
  languageGuardEnabled: data.language_guard_enabled,
  escoResolutionEnabled: data.esco_resolution_enabled,
  storeVersion: data.store_version,
  dualWrite: data.dual_write,
});

export const validateForm = (form: MatchingOntologyForm): Partial<Record<'maxHops' | 'blockedHubs', string>> => {
  const errors: Partial<Record<'maxHops' | 'blockedHubs', string>> = {};
  if (parseMaxHops(form.maxHops) === null) {
    errors.maxHops = `Whole number from ${MAX_HOPS_MIN} to ${MAX_HOPS_MAX}`;
  }
  if (!form.useDefaultHubs) {
    const hubs = parseHubs(form.blockedHubsText);
    if (hubs.length === 0) errors.blockedHubs = 'Add at least one hub, or switch back to the built-in list';
    else if (hubs.length > MAX_BLOCKED_HUBS) errors.blockedHubs = `At most ${MAX_BLOCKED_HUBS} hubs`;
    else if (hubs.some(hub => hub.length > MAX_BLOCKED_HUB_LENGTH)) {
      errors.blockedHubs = `Each hub must be at most ${MAX_BLOCKED_HUB_LENGTH} characters`;
    }
  }
  return errors;
};

const hubsEqual = (a: string[], b: string[]): boolean => a.length === b.length && a.every((hub, i) => hub === b[i]);

const hubsChanged = (original: MatchingOntology, form: MatchingOntologyForm): boolean => {
  const storedDefault = original.sources.blocked_hubs === 'default';
  if (form.useDefaultHubs) return !storedDefault;
  return storedDefault || !hubsEqual(parseHubs(form.blockedHubsText), original.blocked_hubs);
};

export const buildPatch = (
  original: MatchingOntology,
  form: MatchingOntologyForm,
  group: SwitchGroup,
  force = false,
): MatchingOntologyPatch => {
  const patch: MatchingOntologyPatch = {};

  if (group === 'skill_graph') {
    if (form.strictEnabled !== original.strict_enabled) patch.strict_enabled = form.strictEnabled;
    const hops = parseMaxHops(form.maxHops);
    if (hops !== null && hops !== original.max_hops) patch.max_hops = hops;
    if (hubsChanged(original, form)) {
      if (form.useDefaultHubs) patch.reset_blocked_hubs = true;
      else patch.blocked_hubs = parseHubs(form.blockedHubsText);
    }
  } else if (group === 'esco') {
    if (form.staticAliasesEnabled !== original.static_aliases_enabled) {
      patch.static_aliases_enabled = form.staticAliasesEnabled;
    }
    if (form.languageGuardEnabled !== original.language_guard_enabled) {
      patch.language_guard_enabled = form.languageGuardEnabled;
    }
    if (form.escoResolutionEnabled !== original.esco_resolution_enabled) {
      patch.esco_resolution_enabled = form.escoResolutionEnabled;
    }
  } else {
    if (form.storeVersion !== original.store_version) patch.store_version = form.storeVersion;
    if (form.dualWrite !== original.dual_write) patch.dual_write = form.dualWrite;
    if (force && patch.store_version === 'v2') patch.force = true;
  }

  return patch;
};

export const describeChanges = (original: MatchingOntology, form: MatchingOntologyForm, group: SwitchGroup): FieldChange[] => {
  const changes: FieldChange[] = [];
  const push = (label: string, from: string, to: string) => {
    if (from !== to) changes.push({ label, from, to });
  };

  if (group === 'skill_graph') {
    push('Strict skill graph', onOff(original.strict_enabled), onOff(form.strictEnabled));
    push('Max hops', String(original.max_hops), String(parseMaxHops(form.maxHops) ?? form.maxHops));
    if (hubsChanged(original, form)) {
      const from = original.sources.blocked_hubs === 'default' ? 'Built-in default list' : `${original.blocked_hubs.length} custom hubs`;
      const to = form.useDefaultHubs ? 'Built-in default list' : `${parseHubs(form.blockedHubsText).length} custom hubs`;
      changes.push({ label: 'Blocked hubs', from, to });
    }
  } else if (group === 'esco') {
    push('Static aliases', onOff(original.static_aliases_enabled), onOff(form.staticAliasesEnabled));
    push('Language guard', onOff(original.language_guard_enabled), onOff(form.languageGuardEnabled));
    push('ESCO job-title resolution', onOff(original.esco_resolution_enabled), onOff(form.escoResolutionEnabled));
  } else {
    push('Embedding store read version', original.store_version, form.storeVersion);
    push('Dual-write', onOff(original.dual_write), onOff(form.dualWrite));
  }
  return changes;
};

export interface V2NotReady {
  message: string;
  problems: string[];
}

export const parseV2NotReady = (error: unknown): V2NotReady | null => {
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } } | null)?.response;
  if (response?.status !== 409) return null;
  const detail = response.data?.detail as { message?: unknown; problems?: unknown } | string | undefined;
  if (typeof detail === 'string') return { message: detail, problems: [] };
  const message = typeof detail?.message === 'string' ? detail.message : 'v2 store is not ready';
  const problems = Array.isArray(detail?.problems) ? detail.problems.map(String) : [];
  return { message, problems };
};

export const errorMessage = (error: unknown, fallback: string): string => {
  const detail = (error as { response?: { data?: { detail?: unknown } } } | null)?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const msgs = detail.map(item => (item as { msg?: unknown })?.msg).filter((msg): msg is string => typeof msg === 'string');
    if (msgs.length) return msgs.join('; ');
  }
  return fallback;
};

export const formatCoverage = (coverage: TableCoverage | null | undefined, tableExists = true): string => {
  if (!tableExists) return 'Table missing';
  if (!coverage) return 'Not available';
  const pct = (coverage.ratio * 100).toFixed(1);
  return `v2 ${pct}% (${coverage.v2_rows.toLocaleString('en-US')} of ${coverage.v1_rows.toLocaleString('en-US')} v1 rows)`;
};

export interface OptimisticToggleArgs {
  previous: boolean;
  next: boolean;
  apply: (value: boolean) => void;
  request: (next: boolean) => Promise<boolean>;
}

export const runOptimisticToggle = async ({ previous, next, apply, request }: OptimisticToggleArgs): Promise<boolean> => {
  apply(next);
  try {
    apply(await request(next));
    return true;
  } catch {
    apply(previous);
    return false;
  }
};

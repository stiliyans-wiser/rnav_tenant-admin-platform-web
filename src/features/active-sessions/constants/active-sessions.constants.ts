export const activeSessionsConstants = {
  sessionKeys: {
    all: ['active-sessions'] as const,
    platform: () => [...activeSessionsConstants.sessionKeys.all, 'platform'] as const,
  },
};

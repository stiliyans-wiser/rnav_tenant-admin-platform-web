export const usersConstants = {
  userKeys: {
    all: ['users'] as const,
    lists: () => [...usersConstants.userKeys.all, 'list'] as const,
    create: () => [...usersConstants.userKeys.all, 'create'] as const,
    update: (id: string) => [...usersConstants.userKeys.all, 'update', id] as const,
  },
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/features/users/api/usersApi';
import { usersConstants } from '@/features/users/constants/users.constants';
import { CreateUser } from '@/features/users/interfaces/create-user.interface';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: Omit<CreateUser, 'id'>) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersConstants.userKeys.lists() });
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '@/features/users/api/usersApi';
import { usersConstants } from '@/features/users/constants/users.constants';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersConstants.userKeys.lists() });
    },
  });
};

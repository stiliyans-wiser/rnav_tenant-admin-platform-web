import { useQuery } from '@tanstack/react-query';
import { usersConstants } from '@/features/users/constants/users.constants';
import { getUsers } from '@/features/users/api/usersApi';

export const useGetUsers = () => {
  return useQuery({
    queryKey: usersConstants.userKeys.lists(),
    queryFn: getUsers,
  });
};

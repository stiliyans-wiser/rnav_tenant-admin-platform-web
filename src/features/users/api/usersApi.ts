import api from '@/features/auth/api/axiosConfig';
import { User } from '@/features/users/interfaces/user.interface';
import { CreateUser } from '@/features/users/interfaces/create-user.interface';

const url = '/backoffice/users';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(url);
  return response.data;
};

export const createUser = async (user: Omit<CreateUser, 'id'>): Promise<User> => {
  const response = await api.post<User>(url, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`${url}/${id}`);
};

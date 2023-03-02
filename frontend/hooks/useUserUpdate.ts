import useSWRMutation from 'swr/mutation';
import { User, UserStatus } from '../src/user';
import { mutateWithToken } from '../src/fetchWithToken';

export type UserUpdateRequest = {
  id: string;
  version: number;
  username?: string;
  password?: string;
  status?: UserStatus;
}

type UseUserUpdateType = {
  updateUser: (patch: UserUpdateRequest) => Promise<User>;
  isMutating: boolean;
}

export function useUserUpdate(token: string): UseUserUpdateType {
  const { trigger, isMutating } = useSWRMutation(
    [`/users`, token],
    ([url, token], { arg: patch }) => mutateWithToken(`/user/${patch.id}`, 'PATCH', patch, token),
    {
      populateCache: (updatedUser, users) => {
        const filteredUsers = users.users.filter((existingUser: User) => existingUser.id !== updatedUser.id) ?? [];
        return { ...users, users: [...filteredUsers, updatedUser] };
      },
      revalidate: false
    }
  );
  const updateUser = (patch: UserUpdateRequest) => trigger(patch);
  return { updateUser, isMutating }
}
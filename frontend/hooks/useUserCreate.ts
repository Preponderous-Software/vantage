import useSWRMutation from 'swr/mutation';
import { User, UserStatus } from '../src/user';
import { mutateWithToken } from '../src/fetchWithToken';

export type UserCreateRequest = {
  username?: string;
  password?: string;
}

type UseUserCreateType = {
  createUser: (request: UserCreateRequest) => Promise<User>;
  isMutating: boolean;
}

export function useUserCreate(token: string): UseUserCreateType {
  const { trigger, isMutating } = useSWRMutation(
    [`/users`, token],
    ([url, token], { arg: request }) => mutateWithToken(`/user`, 'POST', request, token),
    {
      populateCache: (createdUser, users) => {
        return { ...users, users: [...users.users, createdUser] };
      },
      revalidate: false
    }
  );
  const createUser = (patch: UserCreateRequest) => trigger(patch);
  return { createUser, isMutating }
}
import { Pagination } from './pagination';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type User = {
  id: string;
  version: number;
  username: string;
  status: UserStatus;
}

export type Users = {
  users: User[];
  pagination: Pagination;
}
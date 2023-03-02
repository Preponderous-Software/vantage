import { User } from './user';
import { Pagination } from './pagination';

export type AuditItem = {
  user: User;
  description: string;
  time: string;
}

export type Audit = {
  items: AuditItem[];
  pagination: Pagination
}
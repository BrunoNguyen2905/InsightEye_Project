import { UserLibRole } from "../../../helpers/permission";

export interface IResponseListUser {
  total: number;
  users: IUser[];
}

export interface IUser {
  isBan: boolean;
  roleName: UserLibRole;
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface ISearchUserQuery {
  keyword: string;
  role: string;
  page: number;
  limit: number;
  isLoading: boolean;
  isFailed: boolean;
}

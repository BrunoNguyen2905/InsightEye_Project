import { IResponseListUser, ISearchUserQuery } from "./users";

export interface IUsersManagement {
  listUser: IResponseListUser;
  searchUserQuery: ISearchUserQuery;
}

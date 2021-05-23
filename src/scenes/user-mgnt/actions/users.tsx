import {
  ADD_USER,
  BAN_USER,
  DELETE_USER,
  EDIT_USER,
  EDIT_USER_PASSWORD,
  GET_LIST_USER,
  SET_LIST_USER,
  SET_SEARCH_QUERY_USER,
  SET_USER,
  UNBAN_USER
} from "../constants/users";
import { Action } from "redux";
import { IResponseListUser } from "../types/users";
import { UserLibRole } from "../../../helpers/permission";

export interface IGetListUser extends Action<GET_LIST_USER> {}

export function getListUser(): IGetListUser {
  return {
    type: GET_LIST_USER
  };
}

export interface ISetListUser extends Action<SET_LIST_USER> {
  payload: IResponseListUser;
}

export function setListUser(data: IResponseListUser): ISetListUser {
  return {
    type: SET_LIST_USER,
    payload: data
  };
}

export interface ISetSearchQueryPayload {
  keyword?: string;
  role?: string;
  page?: number;
  limit?: number;
  isLoading?: boolean;
  isFailed?: boolean;
}

export interface ISetSearchUserQuery extends Action<SET_SEARCH_QUERY_USER> {
  payload: ISetSearchQueryPayload;
}

export function setSearchUserQuery(
  query: ISetSearchQueryPayload
): ISetSearchUserQuery {
  return {
    type: SET_SEARCH_QUERY_USER,
    payload: query
  };
}

export interface IAddUser extends Action<ADD_USER> {
  payload: IRequestAddUser;
  meta: {
    cb: (reset: boolean) => void;
  };
}

export interface IRequestAddUser {
  emailAddress: string;
  firstName: string;
  lastName: string;
  roleSystemName: string;
}

export function addUser(
  data: IRequestAddUser,
  cb: (success: boolean) => void
): IAddUser {
  return {
    type: ADD_USER,
    payload: data,
    meta: {
      cb
    }
  };
}

export interface IEditUser extends Action<EDIT_USER> {
  payload: {
    id: string;
    data: IRequestEditUser;
  };
  meta: {
    cb: (reset: boolean) => void;
  };
}

export interface IRequestEditUser {
  firstName?: string;
  lastName?: string;
  roleSystemName?: UserLibRole;
}

export function editUser(
  data: {
    id: string;
    data: IRequestEditUser;
  },
  cb: (success: boolean) => void
): IEditUser {
  return {
    type: EDIT_USER,
    payload: data,
    meta: {
      cb
    }
  };
}

export interface IResponseEditUser {
  firstName?: string;
  lastName?: string;
  roleSystemName?: UserLibRole;
}

export interface ISetUser extends Action<SET_USER> {
  payload: {
    id: string;
    data: IResponseEditUser;
  };
}

export function setUser(data: {
  id: string;
  data: IResponseEditUser;
}): ISetUser {
  return {
    type: SET_USER,
    payload: data
  };
}

export interface IResponseEditUser {
  firstName?: string;
  lastName?: string;
  roleSystemName?: UserLibRole;
}

export interface IEditUserPassword extends Action<EDIT_USER_PASSWORD> {
  payload: IEditUserPasswordPayload;
  meta: {
    cb: (success: boolean) => void;
  };
}

export interface IEditUserPasswordPayload {
  id: string;
  newPassword: string;
  confirmPassword: string;
}

export function editUserPassword(
  data: {
    id: string;
    newPassword: string;
    confirmPassword: string;
  },
  cb: (success: boolean) => void
): IEditUserPassword {
  return {
    type: EDIT_USER_PASSWORD,
    payload: data,
    meta: {
      cb
    }
  };
}

export interface IBanUser extends Action<BAN_USER> {
  payload: {
    id: string;
  };
  meta: {
    cb?: (reset: boolean) => void;
  };
}

export function banUser(id: string, cb?: (success: boolean) => void): IBanUser {
  return {
    type: "BAN_USER",
    payload: {
      id
    },
    meta: {
      cb
    }
  };
}

export interface IUnBanUser extends Action<UNBAN_USER> {
  payload: {
    id: string;
  };
  meta: {
    cb?: (reset: boolean) => void;
  };
}

export function unbanUser(
  id: string,
  cb?: (success: boolean) => void
): IUnBanUser {
  return {
    type: "UNBAN_USER",
    payload: {
      id
    },
    meta: {
      cb
    }
  };
}

export interface IDeleteUser extends Action<DELETE_USER> {
  payload: {
    id: string;
  };
  meta: {
    cb?: (reset: boolean) => void;
  };
}

export function deleteUser(
  id: string,
  cb?: (success: boolean) => void
): IDeleteUser {
  return {
    type: "DELETE_USER",
    payload: {
      id
    },
    meta: {
      cb
    }
  };
}

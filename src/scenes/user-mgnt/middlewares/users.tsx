import { Dispatch, Store } from "react-redux";
import { IStoreState } from "../../../types";

import {
  getListUser,
  IAddUser,
  IBanUser,
  IDeleteUser,
  IEditUser,
  IEditUserPassword,
  IGetListUser,
  IUnBanUser,
  setListUser,
  setSearchUserQuery,
  setUser
} from "../actions/users";

import {
  ADD_USER,
  EDIT_USER,
  EDIT_USER_PASSWORD,
  GET_LIST_USER
} from "../constants/users";
import axios, { AxiosError, AxiosResponse } from "axios";
import { REACT_APP_API_URL } from "../../../environment";
import { IResponseListUser } from "../types/users";
import { common } from "../../../actions";
import Variant from "../../../components/notification/types/variant";

export const usersMiddleware = (store: Store<IStoreState>) => (
  next: Dispatch<
    | IGetListUser
    | IAddUser
    | IEditUser
    | IEditUserPassword
    | IDeleteUser
    | IBanUser
    | IUnBanUser
  >
) => (
  action:
    | IGetListUser
    | IAddUser
    | IEditUser
    | IEditUserPassword
    | IDeleteUser
    | IBanUser
    | IUnBanUser
) => {
  const currentState = store.getState();
  switch (action.type) {
    case GET_LIST_USER: {
      store.dispatch(
        setSearchUserQuery({
          isFailed: false,
          isLoading: true
        })
      );
      axios
        .post(
          `${REACT_APP_API_URL}/api/V2/user/${
            currentState.libs.selectedLib
          }/search/${
            currentState.usersManagement.searchUserQuery.limit
          }/${(currentState.usersManagement.searchUserQuery.page - 1) *
            currentState.usersManagement.searchUserQuery.limit}`,
          {
            keyword: currentState.usersManagement.searchUserQuery.keyword,
            role: currentState.usersManagement.searchUserQuery.role
          }
        )
        .then((data: AxiosResponse<IResponseListUser>) => {
          store.dispatch(
            setSearchUserQuery({
              isFailed: false,
              isLoading: false
            })
          );
          store.dispatch(setListUser(data.data));
        })
        .catch((e: AxiosError) => {
          console.error(e);
          store.dispatch(
            setSearchUserQuery({
              isFailed: true,
              isLoading: false
            })
          );
        });
      break;
    }
    case ADD_USER: {
      axios
        .post(
          `${REACT_APP_API_URL}/api/V2/user/${currentState.libs.selectedLib}`,
          action.payload
        )
        .then((data: AxiosResponse) => {
          common.fireNotification(store.dispatch)({
            message: "Add user success.",
            variant: Variant.SUCCESS
          });

          store.dispatch(
            setSearchUserQuery({
              isFailed: false,
              isLoading: false,
              keyword: "",
              role: "",
              limit: 10,
              page: 1
            })
          );

          store.dispatch(getListUser());

          action.meta.cb(true);
        })
        .catch((e: AxiosError) => {
          const response = e.response as AxiosResponse;

          common.fireNotification(store.dispatch)({
            message: response.data.ErrorMessage
              ? response.data.ErrorMessage
              : "Add user failed.",
            variant: Variant.ERROR
          });

          action.meta.cb(false);
        });
      break;
    }
    case EDIT_USER: {
      axios
        .put(
          `${REACT_APP_API_URL}/api/V2/user/${currentState.libs.selectedLib}/${
            action.payload.id
          }`,
          action.payload.data
        )
        .then((data: AxiosResponse) => {
          common.fireNotification(store.dispatch)({
            message: "Edit user success.",
            variant: Variant.SUCCESS
          });
          store.dispatch(
            setUser({
              id: action.payload.id,
              data: action.payload.data
            })
          );

          store.dispatch(getListUser());

          action.meta.cb(true);
        })
        .catch((e: AxiosError) => {
          const response = e.response as AxiosResponse;

          common.fireNotification(store.dispatch)({
            message:
              response && response.data && response.data.ErrorMessage
                ? response.data.ErrorMessage
                : "Edit user failed.",
            variant: Variant.ERROR
          });

          action.meta.cb(false);
        });
      break;
    }
    case EDIT_USER_PASSWORD: {
      axios
        .put(
          `${REACT_APP_API_URL}/api/v2/user/${
            currentState.libs.selectedLib
          }/password/forceset/${action.payload.id}`,
          {
            newPassword: action.payload.newPassword,
            confirmPassword: action.payload.confirmPassword
          }
        )
        .then((data: AxiosResponse) => {
          common.fireNotification(store.dispatch)({
            message: "Edit user success.",
            variant: Variant.SUCCESS
          });
          action.meta.cb(true);
        })
        .catch((e: AxiosError) => {
          const response = e.response as AxiosResponse;

          common.fireNotification(store.dispatch)({
            message:
              response && response.data && response.data.ErrorMessage
                ? response.data.ErrorMessage
                : "Edit user failed.",
            variant: Variant.ERROR
          });

          action.meta.cb(false);
        });
      break;
    }
    case "BAN_USER": {
      axios
        .put(
          `${REACT_APP_API_URL}/api/v2/user/${currentState.libs.selectedLib}/${
            action.payload.id
          }/ban`
        )
        .then((data: AxiosResponse) => {
          common.fireNotification(store.dispatch)({
            message: "Ban user success.",
            variant: Variant.SUCCESS
          });
          if (action.meta.cb) {
            action.meta.cb(true);
          }
          store.dispatch(
            setListUser({
              total: currentState.usersManagement.listUser.total,
              users: currentState.usersManagement.listUser.users.map(u => {
                console.log(u.id, action.payload.id);
                if (u.id === action.payload.id) {
                  u.isBan = true;
                }
                return u;
              })
            })
          );
        })
        .catch((e: AxiosError) => {
          const response = e.response as AxiosResponse;

          common.fireNotification(store.dispatch)({
            message:
              response && response.data && response.data.ErrorMessage
                ? response.data.ErrorMessage
                : "Ban user failed.",
            variant: Variant.ERROR
          });

          if (action.meta.cb) {
            action.meta.cb(true);
          }
        });

      break;
    }

    case "UNBAN_USER": {
      axios
        .put(
          `${REACT_APP_API_URL}/api/v2/user/${currentState.libs.selectedLib}/${
            action.payload.id
          }/unban`
        )
        .then((data: AxiosResponse) => {
          common.fireNotification(store.dispatch)({
            message: "Unban user success.",
            variant: Variant.SUCCESS
          });
          if (action.meta.cb) {
            action.meta.cb(true);
          }
          store.dispatch(
            setListUser({
              total: currentState.usersManagement.listUser.total,
              users: currentState.usersManagement.listUser.users.map(u => {
                if (u.id === action.payload.id) {
                  u.isBan = false;
                }
                return u;
              })
            })
          );
        })
        .catch((e: AxiosError) => {
          const response = e.response as AxiosResponse;

          common.fireNotification(store.dispatch)({
            message:
              response && response.data && response.data.ErrorMessage
                ? response.data.ErrorMessage
                : "Unban user failed.",
            variant: Variant.ERROR
          });

          if (action.meta.cb) {
            action.meta.cb(true);
          }
        });

      break;
    }

    case "DELETE_USER": {
      axios
        .delete(
          `${REACT_APP_API_URL}/api/v2/user/${currentState.libs.selectedLib}/${
            action.payload.id
          }`
        )
        .then((data: AxiosResponse) => {
          common.fireNotification(store.dispatch)({
            message: "Delete user success.",
            variant: Variant.SUCCESS
          });
          if (action.meta.cb) {
            action.meta.cb(true);
          }
          store.dispatch(getListUser());
        })
        .catch((e: AxiosError) => {
          const response = e.response as AxiosResponse;

          common.fireNotification(store.dispatch)({
            message:
              response && response.data && response.data.ErrorMessage
                ? response.data.ErrorMessage
                : "Delete user failed.",
            variant: Variant.ERROR
          });

          if (action.meta.cb) {
            action.meta.cb(true);
          }
        });

      break;
    }
  }
  return next(action);
};

import { combineReducers } from "redux";
import { IResponseListUser, ISearchUserQuery, IUser } from "../types/users";
import { ISetListUser, ISetSearchUserQuery, ISetUser } from "../actions/users";
import {
  SET_LIST_USER,
  SET_SEARCH_QUERY_USER,
  SET_USER
} from "../constants/users";

function listUser(
  state: IResponseListUser = {
    total: 0,
    users: []
  },
  action: ISetListUser | ISetUser
) {
  switch (action.type) {
    case SET_LIST_USER: {
      return action.payload;
    }

    case SET_USER: {
      return {
        total: state.total,
        users: state.users.reduce(
          (current, user) => {
            if (user.id === action.payload.id) {
              current.push({
                ...user,
                ...{
                  lastName: action.payload.data.lastName || user.lastName,
                  firstName: action.payload.data.firstName || user.firstName,
                  roleName: action.payload.data.roleSystemName || user.roleName
                }
              });
            } else {
              current.push(user);
            }
            return current;
          },
          [] as IUser[]
        )
      };
    }
  }

  return state;
}

function searchUserQuery(
  state: ISearchUserQuery = {
    isFailed: false,
    isLoading: false,
    keyword: "",
    role: "",
    limit: 10,
    page: 1
  },
  action: ISetSearchUserQuery
) {
  if (action.type === SET_SEARCH_QUERY_USER) {
    return {
      ...state,
      ...action.payload
    };
  }
  return state;
}

export const usersManagement = combineReducers({
  listUser,
  searchUserQuery
});

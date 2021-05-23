import * as notifications from "../components/notification/reducer";
import { combineReducers } from "redux";
import IUser from "../types/User";
import { IUserUpdateList } from "../actions/UserList";
import { USERS_UPDATE_LIST } from "../constants/UserList";
import { ISetLibActive } from "src/actions";
import { LIB_ACTIVE } from "src/constants";
import { ISetApiLoading, IUnsetApiLoading } from "../actions/loading";
import { API_LOADING_SET, API_LOADING_UNSET } from "../constants/loading";

const users = (state: IUser[] = [], action: IUserUpdateList) => {
  switch (action.type) {
    case USERS_UPDATE_LIST: {
      return action.users;
    }
  }
  return state;
};

const libActive = (state: boolean = true, action: ISetLibActive) => {
  switch (action.type) {
    case LIB_ACTIVE: {
      return action.payload;
    }
  }
  return state;
};
const loading = (
  state: string[] = [],
  action: ISetApiLoading | IUnsetApiLoading
) => {
  switch (action.type) {
    case API_LOADING_SET: {
      return [...state, action.payload];
    }
    case API_LOADING_UNSET: {
      return state.filter(api => api !== action.payload);
    }
  }
  return state;
};

export const common = combineReducers({
  ...notifications,
  users,
  libActive,
  loading
});

import { USERS_GET_LIST, USERS_UPDATE_LIST } from "../constants/UserList";
import { Action, Dispatch } from "redux";
import axios, { AxiosResponse } from "axios";
import { REACT_APP_API_URL } from "../environment";
import IUser from "../types/User";
import { Store } from "react-redux";
import { IStoreState } from "../types";

export interface IUserGetList extends Action<USERS_GET_LIST> {}
export interface IUserUpdateList extends Action<USERS_UPDATE_LIST> {
  users: IUser[];
}

export const getListUser = (store: Store<IStoreState>) => (
  dispatch: Dispatch<IUserGetList | IUserUpdateList>
) => () => {
  dispatch({
    type: USERS_GET_LIST
  });
  const currentState = store.getState();
  axios
    .get(
      `${REACT_APP_API_URL}/api/v2/incident/${
        currentState.libs.selectedLib
      }/users`
    )
    .then((resp: AxiosResponse<IUser[]>) => {
      dispatch({
        type: USERS_UPDATE_LIST,
        users: resp.data
      });
    });
};

import { Action, Store } from "redux";
import { LOGS_MGNT_SET_PAGE } from "../constaints";
import { Dispatch } from "react-redux";
import { LOGS_MGNT_SEARCH, LOGS_MGNT_UPDATE_FILTER } from "../constaints/index";
import ILogRequest from "../types/LogRequest";
import { REACT_APP_API_URL } from "src/environment";
import axios, { AxiosResponse } from "axios";
import ILogResponse from "../types/LogRespone";
import { IPagingInfo } from "../types/LogScene";
import { IStoreState } from "../../../types";

export interface ILogsMngtSetPage extends Action<LOGS_MGNT_SET_PAGE> {
  payload: Partial<IPagingInfo>;
}

export const logsMngtSetPage = (dispatch: Dispatch<ILogsMngtSetPage>) => (
  page: Partial<IPagingInfo>
) => {
  dispatch({
    type: LOGS_MGNT_SET_PAGE,
    payload: page
  });
};
export interface ILogsMngtSearch extends Action<LOGS_MGNT_SEARCH> {
  payload: ILogResponse;
}

export const logsMngtSearch = (store: Store<IStoreState>) => (
  dispatch: Dispatch<ILogsMngtSearch>
) => (pageSize: number, pageNo: number, filter: ILogRequest) => {
  const currentState = store.getState();
  axios
    .post(
      `${REACT_APP_API_URL}/api/v2/log/${
        currentState.libs.selectedLib
      }/search/${pageSize}/${(pageNo - 1) * pageSize}`,
      filter
    )
    .then((resp: AxiosResponse<ILogResponse>) => {
      dispatch({
        type: LOGS_MGNT_SEARCH,
        payload: resp.data
      });
    })
    .catch(err => {
      throw err;
    });
};

export interface ILogsMngtUpdateFilter extends Action<LOGS_MGNT_UPDATE_FILTER> {
  payload: Partial<ILogRequest>;
}

export const logsMngtUpdateFilter = (
  dispatch: Dispatch<ILogsMngtUpdateFilter>
) => (filter: Partial<ILogRequest>) => {
  dispatch({
    type: LOGS_MGNT_UPDATE_FILTER,
    payload: filter
  });
};

import { combineReducers } from "redux";
import { IPagingInfo } from "../types/LogScene";
import { ILogsMngtSetPage } from "../actions";
import { LOGS_MGNT_SET_PAGE } from "../constaints";
import ILogRequest from "../types/LogRequest";
import { ILogsMngtUpdateFilter, ILogsMngtSearch } from "../actions/index";
import { LOGS_MGNT_UPDATE_FILTER, LOGS_MGNT_SEARCH } from "../constaints/index";
import { ILog } from "../types/Log";
import {
  DEFAULT_PAGING,
  DEFAULT_FILTER,
  DEFAULT_LOGS
} from "../types/DefaultValue";

function paging(
  state: IPagingInfo = DEFAULT_PAGING,
  action: ILogsMngtSetPage | ILogsMngtSearch | ILogsMngtUpdateFilter
): IPagingInfo {
  switch (action.type) {
    case LOGS_MGNT_SET_PAGE:
      return { ...state, ...action.payload };
    case LOGS_MGNT_SEARCH:
      return { ...state, total: action.payload.total };
    case LOGS_MGNT_UPDATE_FILTER:
      return { ...state, pageNo: DEFAULT_PAGING.pageNo };
  }
  return state;
}

function filter(
  state: ILogRequest = DEFAULT_FILTER(),
  action: ILogsMngtUpdateFilter
): ILogRequest {
  switch (action.type) {
    case LOGS_MGNT_UPDATE_FILTER:
      if (!Object.keys(action.payload).length) {
        return DEFAULT_FILTER();
      }
      return { ...state, ...action.payload };
  }
  return state;
}

function logs(state: ILog[] = DEFAULT_LOGS, action: ILogsMngtSearch): ILog[] {
  switch (action.type) {
    case LOGS_MGNT_SEARCH:
      return action.payload.logs;
  }
  return state;
}

export const logMgnt = combineReducers({
  paging,
  filter,
  logs
});

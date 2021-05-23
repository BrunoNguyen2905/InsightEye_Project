import {
  MANAGEMENT_CCTV_SET_LIST_CCTV,
  MANAGEMENT_CCTV_SET_LIST_CCTV_STATE
} from "../constants";
import { ICCTV, IListCCTVState } from "../types/listCCTV";
import { ISetListCCTV, ISetListCCTVState } from "../actions/listCCTV";

export function listCTTV(state: ICCTV[] = [], action: ISetListCCTV): ICCTV[] {
  switch (action.type) {
    case MANAGEMENT_CCTV_SET_LIST_CCTV:
      return action.payload;
  }
  return state;
}

export function listState(
  state: IListCCTVState = {
    isFailed: false,
    isLoading: true,
    total: 0,
    currentPage: 1,
    skip: 10,
    keyword: ""
  },
  action: ISetListCCTVState
): IListCCTVState {
  switch (action.type) {
    case MANAGEMENT_CCTV_SET_LIST_CCTV_STATE:
      return {
        ...state,
        ...action.payload
      };
  }
  return state;
}
